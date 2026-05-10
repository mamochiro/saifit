interface Meal {
  time: string;
  name: string;
  items: string[];
  kcal: number;
  p: number;
  c: number;
  f: number;
  done: boolean;
}

const MEALS: Meal[] = [
  {
    time: "07:30",
    name: "มื้อเช้า · BREAKFAST",
    items: ["ข้าวโอ๊ต + กล้วย + เวย์", "ไข่ดาว 2 ฟอง"],
    kcal: 540,
    p: 38,
    c: 62,
    f: 14,
    done: true,
  },
  {
    time: "12:30",
    name: "มื้อกลางวัน · LUNCH",
    items: ["ข้าวกล้อง + อกไก่ย่าง", "ผักรวม + น้ำสลัดงา"],
    kcal: 720,
    p: 52,
    c: 78,
    f: 18,
    done: true,
  },
  {
    time: "16:00",
    name: "ของว่าง · SNACK",
    items: ["โยเกิร์ตกรีก + เบอร์รี่"],
    kcal: 220,
    p: 18,
    c: 22,
    f: 6,
    done: false,
  },
  {
    time: "19:00",
    name: "มื้อเย็น · DINNER",
    items: ["ปลาแซลมอน + มันหวาน", "บร็อคโคลี่นึ่ง"],
    kcal: 620,
    p: 44,
    c: 48,
    f: 22,
    done: false,
  },
];

const EATEN = 1260;
const TARGET = 2100;

function CalorieRing({ eaten, target }: { eaten: number; target: number }) {
  const pct = Math.min(eaten / target, 1);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(72% 0.20 270)" />
            <stop offset="100%" stopColor="oklch(60% 0.20 240)" />
          </linearGradient>
        </defs>
        <circle cx="55" cy="55" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
        <circle
          cx="55"
          cy="55"
          r={r}
          stroke="url(#calGrad)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ filter: "drop-shadow(0 0 6px var(--violet))" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="t-num" style={{ fontSize: 22, lineHeight: 1, color: "var(--ink)" }}>
          {Math.round(pct * 100)}
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>%</span>
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 9,
            color: "var(--ink-soft)",
            letterSpacing: "0.14em",
            marginTop: 2,
          }}
        >
          EATEN
        </div>
      </div>
    </div>
  );
}

function MacroBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
}) {
  const pct = Math.min(value / target, 1);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "K2D, sans-serif",
          fontSize: 10,
          color: "var(--ink-soft)",
          marginBottom: 3,
        }}
      >
        <span>{label}</span>
        <span>
          <span className="t-num" style={{ color: "var(--ink)", fontSize: 11 }}>
            {value}
          </span>{" "}
          / {target}g
        </span>
      </div>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: "100%",
            borderRadius: 2,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function FoodPage() {
  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">MON · CUTTING</span>
        <h1
          style={{
            fontFamily: "K2D, sans-serif",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
            margin: "6px 0 0",
          }}
        >
          แผนอาหาร
        </h1>
      </div>

      {/* Calorie ring + macros */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
          className="glass glass-glow"
          style={{ padding: "22px 22px", display: "flex", alignItems: "center", gap: 18 }}
        >
          <CalorieRing eaten={EATEN} target={TARGET} />
          <div style={{ flex: 1 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>
              วันนี้
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span className="t-num" style={{ fontSize: 30, color: "var(--ink)" }}>
                {EATEN}
              </span>
              <span
                style={{ fontFamily: "K2D, sans-serif", fontSize: 13, color: "var(--ink-mute)" }}
              >
                / {TARGET} kcal
              </span>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <MacroBar label="P · โปรตีน" value={90} target={150} color="oklch(72% 0.20 270)" />
              <MacroBar label="C · คาร์บ" value={140} target={220} color="oklch(78% 0.16 200)" />
              <MacroBar label="F · ไขมัน" value={32} target={70} color="oklch(74% 0.14 80)" />
            </div>
          </div>
        </div>
      </div>

      {/* Meal cards */}
      <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {MEALS.map((m) => (
          <div key={m.time} className="glass" style={{ padding: 16, opacity: m.done ? 0.65 : 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="t-num" style={{ fontSize: 16, color: "var(--ink)" }}>
                    {m.time}
                  </span>
                  {m.done && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "var(--violet)",
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 8px var(--violet)",
                      }}
                    >
                      <svg width="10" height="8" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "K2D, sans-serif",
                    fontSize: 11,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.04em",
                    marginTop: 1,
                  }}
                >
                  {m.name}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="t-num" style={{ fontSize: 18, color: "var(--ink)" }}>
                  {m.kcal}
                </div>
                <div
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.10em",
                  }}
                >
                  KCAL
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
              {m.items.map((item) => (
                <div
                  key={item}
                  style={{
                    fontFamily: "K2D, sans-serif",
                    fontSize: 13,
                    color: "var(--ink-mute)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "var(--ink-soft)",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                fontFamily: "Chakra Petch, monospace",
                fontSize: 11,
                color: "var(--ink-soft)",
                letterSpacing: "0.04em",
              }}
            >
              <span>
                P <span style={{ color: "var(--ink)" }}>{m.p}g</span>
              </span>
              <span>
                C <span style={{ color: "var(--ink)" }}>{m.c}g</span>
              </span>
              <span>
                F <span style={{ color: "var(--ink)" }}>{m.f}g</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add food button */}
      <div style={{ padding: "14px 24px 0" }}>
        <button
          type="button"
          className="btn-glass"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          เพิ่มอาหาร / SCAN BARCODE
        </button>
      </div>
    </div>
  );
}
