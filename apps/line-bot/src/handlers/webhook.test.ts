import type { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Env, Variables } from "../types";
import { webhookHandler } from "./webhook";

// ── Hoisted mocks (available before vi.mock factory runs) ─────────────────────

const { mockReplyMessage, mockFindFirst, mockSet, mockUpdate, mockWhere, fakeDb } = vi.hoisted(
  () => {
    const mockReplyMessage = vi.fn().mockResolvedValue({});
    const mockFindFirst = vi.fn().mockResolvedValue(null);
    const mockWhere = vi.fn().mockResolvedValue([]);
    const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
    const mockUpdate = vi.fn().mockReturnValue({ set: mockSet });
    const fakeDb = {
      query: { users: { findFirst: mockFindFirst } },
      update: mockUpdate,
    };
    return { mockReplyMessage, mockFindFirst, mockSet, mockUpdate, mockWhere, fakeDb };
  },
);

vi.mock("@line/bot-sdk", () => ({
  messagingApi: {
    MessagingApiClient: vi.fn().mockImplementation(() => ({
      replyMessage: mockReplyMessage,
    })),
  },
}));

vi.mock("../lib/db", () => ({
  getDb: vi.fn().mockReturnValue(fakeDb),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

type HonoEnv = { Bindings: Env; Variables: Variables };

const ENV: Env = {
  DATABASE_URL: "postgresql://test",
  LINE_CHANNEL_ACCESS_TOKEN: "test-token",
  LINE_CHANNEL_SECRET: "test-secret",
  WEB_APP_URL: "https://saifit.app",
};

function makeContext(events: unknown[]): Context<HonoEnv> {
  const rawBody = JSON.stringify({ destination: "U_dest", events });
  return {
    get: (key: string) => (key === "rawBody" ? rawBody : undefined),
    env: ENV,
    json: (_data: unknown) => new Response("ok"),
  } as unknown as Context<HonoEnv>;
}

const followEvent = (lineUserId: string) => ({
  type: "follow" as const,
  timestamp: 1_000_000,
  mode: "active" as const,
  webhookEventId: "wh-follow-1",
  deliveryContext: { isRedelivery: false },
  source: { type: "user" as const, userId: lineUserId },
  replyToken: "reply-token-follow",
});

const unfollowEvent = (lineUserId: string) => ({
  type: "unfollow" as const,
  timestamp: 1_000_001,
  mode: "active" as const,
  webhookEventId: "wh-unfollow-1",
  deliveryContext: { isRedelivery: false },
  source: { type: "user" as const, userId: lineUserId },
});

const textMessageEvent = (text: string) => ({
  type: "message" as const,
  timestamp: 1_000_002,
  mode: "active" as const,
  webhookEventId: "wh-msg-1",
  deliveryContext: { isRedelivery: false },
  source: { type: "user" as const, userId: "U_msg" },
  replyToken: "reply-token-msg",
  message: { type: "text" as const, id: "msg-1", quoteToken: "", text },
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("webhookHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-apply default implementations cleared by clearAllMocks on the chain mocks
    mockWhere.mockResolvedValue([]);
    mockSet.mockReturnValue({ where: mockWhere });
    mockUpdate.mockReturnValue({ set: mockSet });
    mockFindFirst.mockResolvedValue(null);
    mockReplyMessage.mockResolvedValue({});
  });

  it("(a) follow event with matching lineUserId logs the matched user", async () => {
    const matchedUser = { id: "user-uuid-1", lineUserId: "U_follow" };
    mockFindFirst.mockResolvedValue(matchedUser);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const c = makeContext([followEvent("U_follow")]);
    await webhookHandler(c);

    expect(mockFindFirst).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Matched existing user:", matchedUser.id);
    consoleSpy.mockRestore();
  });

  it("(b) unfollow event sets reminderEnabled=false", async () => {
    const c = makeContext([unfollowEvent("U_unfollow")]);
    await webhookHandler(c);

    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith({ reminderEnabled: false });
    expect(mockWhere).toHaveBeenCalled();
  });

  it("(c) 'help' text → reply contains WEB_APP_URL", async () => {
    const c = makeContext([textMessageEvent("help")]);
    await webhookHandler(c);

    expect(mockReplyMessage).toHaveBeenCalledOnce();
    const arg = mockReplyMessage.mock.calls[0]?.[0] as { messages: { text: string }[] } | undefined;
    expect(arg?.messages[0]?.text).toContain(ENV.WEB_APP_URL);
  });

  it("(d) 'status' text → reply contains '/progress'", async () => {
    const c = makeContext([textMessageEvent("status")]);
    await webhookHandler(c);

    expect(mockReplyMessage).toHaveBeenCalledOnce();
    const arg = mockReplyMessage.mock.calls[0]?.[0] as { messages: { text: string }[] } | undefined;
    expect(arg?.messages[0]?.text).toContain("/progress");
  });

  it("(e) unknown text → fallback reply with WEB_APP_URL", async () => {
    const c = makeContext([textMessageEvent("something random")]);
    await webhookHandler(c);

    expect(mockReplyMessage).toHaveBeenCalledOnce();
    const arg = mockReplyMessage.mock.calls[0]?.[0] as { messages: { text: string }[] } | undefined;
    expect(arg?.messages[0]?.text).toContain(ENV.WEB_APP_URL);
  });
});
