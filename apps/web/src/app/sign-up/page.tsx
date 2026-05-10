"use client";

import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as v from "valibot";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const result = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        callbackURL: "/welcome",
      });
      if (result.error) {
        setError(result.error.message ?? "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      } else {
        router.push("/welcome");
        router.refresh();
      }
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">GymPal</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">สร้างบัญชีของคุณ</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => (!value?.trim() ? "กรุณากรอกชื่อ" : undefined),
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  ชื่อ
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="ชื่อของคุณ"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={cn(
                    "w-full h-14 px-4 bg-secondary border rounded-xl text-sm outline-none focus:ring-2 focus:ring-ring transition-all",
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? "border-destructive"
                      : "border-border",
                  )}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 leading-relaxed">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

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
            {(field) => (
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={cn(
                    "w-full h-14 px-4 bg-secondary border rounded-xl text-sm outline-none focus:ring-2 focus:ring-ring transition-all",
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? "border-destructive"
                      : "border-border",
                  )}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 leading-relaxed">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "กรุณากรอกรหัสผ่าน";
                const ok = v.safeParse(v.pipe(v.string(), v.minLength(8)), value);
                return ok.success ? undefined : "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
              },
            }}
          >
            {(field) => (
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  รหัสผ่าน
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={cn(
                    "w-full h-14 px-4 bg-secondary border rounded-xl text-sm outline-none focus:ring-2 focus:ring-ring transition-all",
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? "border-destructive"
                      : "border-border",
                  )}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-400 leading-relaxed">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-red-400 leading-relaxed">
              {error}
            </div>
          )}

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full h-14 bg-primary hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 text-primary-foreground font-semibold rounded-xl transition-colors"
              >
                {isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          มีบัญชีแล้ว?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
