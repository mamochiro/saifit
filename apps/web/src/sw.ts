/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

self.addEventListener("push", (event: Event) => {
  const pushEvent = event as PushEvent;
  const data = pushEvent.data?.json() as
    | { title?: string; body?: string; url?: string }
    | undefined;
  const title = data?.title ?? "Saifit";
  const body = data?.body ?? "";
  const url = data?.url ?? "/";
  (pushEvent as PushEvent).waitUntil(
    (self as unknown as ServiceWorkerGlobalScope).registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event: Event) => {
  const notifEvent = event as NotificationEvent;
  notifEvent.notification.close();
  const url: string = (notifEvent.notification.data as { url?: string })?.url ?? "/";
  notifEvent.waitUntil((self as unknown as ServiceWorkerGlobalScope).clients.openWindow(url));
});
