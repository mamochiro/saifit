"use client";

import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as v from "valibot";

export default function SignInPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [lineLoading, setLineLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const result = await signIn.email({
        email: value.email,
        password: value.password,
      });
      if (result.error) {
        setError(result.error.message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน");
      } else {
        router.push("/");
        router.refresh();
      }
    },
  });

  async function handleLineLogin() {
    setLineLoading(true);
    try {
      await signIn.social({ provider: "line", callbackURL: "/auth/line-callback" });
    } finally {
      setLineLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="saifit-bg relative min-h-screen flex items-center justify-center p-6">
      {/* Barbell watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 200"
          style={{ width: "100vmax", opacity: 0.045, transform: "rotate(-12deg)" }}
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {/* bar */}
          <line x1="30" y1="100" x2="570" y2="100" strokeWidth="8" />
          {/* collars */}
          <rect x="118" y="80" width="16" height="40" rx="2" />
          <rect x="466" y="80" width="16" height="40" rx="2" />
          {/* left plate — 3 concentric rings */}
          <ellipse cx="72" cy="100" rx="42" ry="72" />
          <ellipse cx="72" cy="100" rx="28" ry="48" />
          <ellipse cx="72" cy="100" rx="14" ry="24" />
          <circle cx="72" cy="100" r="6" />
          {/* right plate — mirror */}
          <ellipse cx="528" cy="100" rx="42" ry="72" />
          <ellipse cx="528" cy="100" rx="28" ry="48" />
          <ellipse cx="528" cy="100" rx="14" ry="24" />
          <circle cx="528" cy="100" r="6" />
        </svg>
      </div>

      {/* Glass card */}
      <div className="glass relative z-10 w-full max-w-sm" style={{ padding: "36px 24px 28px" }}>
        {/* Brand lockup */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, oklch(72% 0.20 270), oklch(60% 0.20 240))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px -6px rgba(120,90,255,0.7)",
                flexShrink: 0,
              }}
            >
              {/* mini barbell */}
              <svg
                viewBox="0 0 20 20"
                width={20}
                height={20}
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="2" y1="10" x2="18" y2="10" />
                <rect x="5.5" y="6.5" width="2" height="7" rx="0.5" />
                <rect x="12.5" y="6.5" width="2" height="7" rx="0.5" />
                <ellipse cx="3.5" cy="10" rx="1.5" ry="4" />
                <ellipse cx="16.5" cy="10" rx="1.5" ry="4" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "Chakra Petch, monospace",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              GymPal
            </span>
          </div>
          <p
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 14,
              color: "var(--ink-mute)",
              lineHeight: 1.5,
            }}
          >
            ติดตามการออกกำลังกายของคุณ
          </p>
        </div>

        {/* OAuth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <button
            type="button"
            onClick={handleLineLogin}
            disabled={lineLoading}
            className="btn-line"
            style={{ width: "100%" }}
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="white" aria-hidden="true">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v3.762h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            {lineLoading ? "กำลังเชื่อมต่อ..." : t("lineLogin")}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn-glass"
            style={{ width: "100%" }}
          >
            <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "กำลังเชื่อมต่อ..." : t("googleLogin")}
          </button>
        </div>

        {/* Divider */}
        <div className="divider-text" style={{ margin: "0 0 18px" }}>
          หรือ
        </div>

        {/* Email + password form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "กรุณากรอกอีเมล";
                const ok = v.safeParse(v.pipe(v.string(), v.email()), value);
                return ok.success ? undefined : "กรุณากรอกอีเมลที่ถูกต้อง";
              },
            }}
          >
            {(field) => {
              const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <div>
                  <div className={cn("glass-input", hasError && "error")}>
                    {/* @ icon */}
                    <svg
                      viewBox="0 0 20 20"
                      width={16}
                      height={16}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: "var(--ink-soft)", flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        d="M10 12v2.5A2.5 2.5 0 0012.5 17h0a2.5 2.5 0 002.5-2.5V10a5 5 0 10-5 5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="อีเมล"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {hasError && (
                    <p
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 12,
                        color: "var(--danger)",
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => (!value ? "กรุณากรอกรหัสผ่าน" : undefined),
            }}
          >
            {(field) => {
              const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
              return (
                <div>
                  <div className={cn("glass-input", hasError && "error")}>
                    {/* lock icon */}
                    <svg
                      viewBox="0 0 20 20"
                      width={16}
                      height={16}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: "var(--ink-soft)", flexShrink: 0 }}
                      aria-hidden="true"
                    >
                      <rect x="4" y="9" width="12" height="9" rx="2" />
                      <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round" />
                    </svg>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="รหัสผ่าน"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {/* eye toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--ink-soft)",
                        display: "flex",
                        flexShrink: 0,
                      }}
                      aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 20 20"
                          width={16}
                          height={16}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3.98 8.223A10.477 10.477 0 001.934 10C3.226 13.307 6.362 15.5 10 15.5c1.23 0 2.398-.248 3.47-.694M6.53 6.53A3.5 3.5 0 0110 6.5c1.93 0 3.5 1.567 3.5 3.5 0 .81-.28 1.556-.74 2.144M6.53 6.53L3 3m3.53 3.53l7.94 7.94M13.47 13.47L17 17"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 20 20"
                          width={16}
                          height={16}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {hasError && (
                    <p
                      style={{
                        fontFamily: "K2D, sans-serif",
                        fontSize: 12,
                        color: "var(--danger)",
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(200, 50, 50, 0.10)",
                border: "1px solid oklch(62% 0.20 25 / 30%)",
                borderRadius: "var(--r-sm)",
                fontFamily: "K2D, sans-serif",
                fontSize: 13,
                color: "var(--danger)",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="btn-primary"
                style={{ width: "100%", marginTop: 4 }}
              >
                {isSubmitting ? (
                  "กำลังเข้าสู่ระบบ..."
                ) : (
                  <>
                    {t("signIn")}
                    <svg
                      viewBox="0 0 20 20"
                      width={16}
                      height={16}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 10h12M10 4l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </form.Subscribe>
        </form>

        {/* Sign-up link */}
        <p
          style={{
            textAlign: "center",
            marginTop: 18,
            fontFamily: "K2D, sans-serif",
            fontSize: 13,
            color: "var(--ink-soft)",
          }}
        >
          ยังไม่มีบัญชี?{" "}
          <Link href="/sign-up" style={{ color: "var(--ink)", fontWeight: 600 }}>
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
