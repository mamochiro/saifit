"use client";

import { useState } from "react";
import {
  type MealItem,
  useAddMealItem,
  useDeleteMealItem,
  useFoodLog,
  useToggleMealItem,
} from "./hooks";

const MEAL_TYPES = [
  { key: "breakfast", label: "มื้อเช้า · BREAKFAST" },
  { key: "lunch", label: "มื้อกลางวัน · LUNCH" },
  { key: "snack", label: "ของว่าง · SNACK" },
  { key: "dinner", label: "มื้อเย็น · DINNER" },
] as const;

function CalorieRing({ eaten, target }: { eaten: number; target: number }) {
  const pct = Math.min(eaten / (target || 1), 1);
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
}: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(value / (target || 1), 1);
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
            {Math.round(value)}
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
          style={{ width: `${pct * 100}%`, height: "100%", borderRadius: 2, background: color }}
        />
      </div>
    </div>
  );
}

interface AddFormData {
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
  name: string;
  kcal: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
}

export default function FoodPage() {
  const todayBkk = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  const { data, isLoading } = useFoodLog(todayBkk);
  const toggleItem = useToggleMealItem();
  const deleteItem = useDeleteMealItem();
  const addItem = useAddMealItem();

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddFormData>({
    mealType: "breakfast",
    name: "",
    kcal: "",
    proteinG: "",
    carbsG: "",
    fatG: "",
  });

  const items = data?.items ?? [];
  const log = data?.log;

  const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
  const totalProtein = items.reduce((s, i) => s + Number(i.proteinG), 0);
  const totalCarbs = items.reduce((s, i) => s + Number(i.carbsG), 0);
  const totalFat = items.reduce((s, i) => s + Number(i.fatG), 0);

  const targetKcal = log?.targetKcal ?? 2100;
  const targetProtein = log?.targetProteinG ?? 150;
  const targetCarbs = log?.targetCarbsG ?? 220;
  const targetFat = log?.targetFatG ?? 70;

  const dayLabel = new Date(todayBkk)
    .toLocaleDateString("th-TH", { weekday: "short" })
    .toUpperCase();

  async function handleAdd() {
    const kcal = Number(addForm.kcal);
    if (!addForm.name || !kcal) return;

    await addItem.mutateAsync({
      date: todayBkk,
      mealType: addForm.mealType,
      name: addForm.name,
      kcal,
      proteinG: Number(addForm.proteinG.replace(",", ".")) || 0,
      carbsG: Number(addForm.carbsG.replace(",", ".")) || 0,
      fatG: Number(addForm.fatG.replace(",", ".")) || 0,
    });
    setShowAddForm(false);
    setAddForm({ mealType: "breakfast", name: "", kcal: "", proteinG: "", carbsG: "", fatG: "" });
  }

  const groupedItems = MEAL_TYPES.map((mt) => ({
    ...mt,
    items: items.filter((i) => i.mealType === mt.key),
  }));

  return (
    <div className="saifit-bg" style={{ minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ padding: "40px 24px 0" }}>
        <span className="t-label">{dayLabel} · FOOD PLAN</span>
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
          <CalorieRing eaten={totalKcal} target={targetKcal} />
          <div style={{ flex: 1 }}>
            <div className="t-label" style={{ marginBottom: 6 }}>
              วันนี้
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span className="t-num" style={{ fontSize: 30, color: "var(--ink)" }}>
                {totalKcal}
              </span>
              <span
                style={{ fontFamily: "K2D, sans-serif", fontSize: 13, color: "var(--ink-mute)" }}
              >
                / {targetKcal} kcal
              </span>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <MacroBar
                label="P · โปรตีน"
                value={totalProtein}
                target={targetProtein}
                color="oklch(72% 0.20 270)"
              />
              <MacroBar
                label="C · คาร์บ"
                value={totalCarbs}
                target={targetCarbs}
                color="oklch(78% 0.16 200)"
              />
              <MacroBar
                label="F · ไขมัน"
                value={totalFat}
                target={targetFat}
                color="oklch(74% 0.14 80)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meal groups */}
      <div style={{ padding: "14px 24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              fontFamily: "K2D, sans-serif",
              fontSize: 13,
              color: "var(--ink-mute)",
            }}
          >
            กำลังโหลด...
          </div>
        ) : groupedItems.every((g) => g.items.length === 0) ? (
          <div className="glass" style={{ padding: 24, textAlign: "center" }}>
            <div
              style={{
                fontFamily: "K2D, sans-serif",
                fontSize: 14,
                color: "var(--ink-mute)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              ยังไม่มีรายการอาหาร
              <br />
              กดปุ่มด้านล่างเพื่อเพิ่ม
            </div>
          </div>
        ) : (
          groupedItems.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.key}>
                  <div
                    style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.14em",
                      marginBottom: 6,
                      paddingLeft: 2,
                    }}
                  >
                    {group.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {group.items.map((item) => (
                      <MealCard
                        key={item.id}
                        item={item}
                        onToggle={() =>
                          toggleItem.mutate({ date: todayBkk, id: item.id, isDone: !item.isDone })
                        }
                        onDelete={() => deleteItem.mutate({ date: todayBkk, id: item.id })}
                      />
                    ))}
                  </div>
                </div>
              ),
          )
        )}
      </div>

      {/* Add food button */}
      <div style={{ padding: "14px 24px 0" }}>
        {!showAddForm ? (
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
            onClick={() => setShowAddForm(true)}
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
            เพิ่มอาหาร / ADD FOOD
          </button>
        ) : (
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 14 }}>
              เพิ่มรายการอาหาร
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div
                  style={{
                    fontFamily: "system-ui",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    marginBottom: 6,
                  }}
                >
                  MEAL TYPE
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {MEAL_TYPES.map((mt) => (
                    <button
                      key={mt.key}
                      type="button"
                      className={`pill${addForm.mealType === mt.key ? " is-active" : ""}`}
                      onClick={() => setAddForm((f) => ({ ...f, mealType: mt.key }))}
                    >
                      {mt.key}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="food-name"
                  style={{
                    fontFamily: "system-ui",
                    fontSize: 9,
                    color: "var(--ink-soft)",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  NAME · ชื่ออาหาร
                </label>
                <input
                  id="food-name"
                  className="glass-input"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="เช่น ข้าวกล้อง + อกไก่"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label
                    htmlFor="food-kcal"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    KCAL
                  </label>
                  <input
                    id="food-kcal"
                    className="glass-input"
                    inputMode="numeric"
                    value={addForm.kcal}
                    onChange={(e) => setAddForm((f) => ({ ...f, kcal: e.target.value }))}
                    placeholder="0"
                    style={{ width: "100%", textAlign: "right" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="food-protein"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    PROTEIN · g
                  </label>
                  <input
                    id="food-protein"
                    className="glass-input"
                    inputMode="decimal"
                    value={addForm.proteinG}
                    onChange={(e) => setAddForm((f) => ({ ...f, proteinG: e.target.value }))}
                    placeholder="0"
                    style={{ width: "100%", textAlign: "right" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="food-carbs"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    CARBS · g
                  </label>
                  <input
                    id="food-carbs"
                    className="glass-input"
                    inputMode="decimal"
                    value={addForm.carbsG}
                    onChange={(e) => setAddForm((f) => ({ ...f, carbsG: e.target.value }))}
                    placeholder="0"
                    style={{ width: "100%", textAlign: "right" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="food-fat"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: 9,
                      color: "var(--ink-soft)",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    FAT · g
                  </label>
                  <input
                    id="food-fat"
                    className="glass-input"
                    inputMode="decimal"
                    value={addForm.fatG}
                    onChange={(e) => setAddForm((f) => ({ ...f, fatG: e.target.value }))}
                    placeholder="0"
                    style={{ width: "100%", textAlign: "right" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="btn-glass"
                style={{ flex: 1 }}
                onClick={() => setShowAddForm(false)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={handleAdd}
                disabled={addItem.isPending}
              >
                {addItem.isPending ? "กำลังเพิ่ม..." : "เพิ่ม"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MealCard({
  item,
  onToggle,
  onDelete,
}: { item: MealItem; onToggle: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="glass" style={{ padding: 14, opacity: item.isDone ? 0.65 : 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <button
            type="button"
            onClick={onToggle}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: item.isDone ? "var(--violet)" : "rgba(255,255,255,0.06)",
              border: "1px solid var(--glass-line)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: item.isDone ? "0 0 8px var(--violet)" : "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label={item.isDone ? "ยกเลิก" : "เสร็จแล้ว"}
          >
            {item.isDone && (
              <svg width="10" height="8" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <div
            style={{
              fontFamily: "K2D, sans-serif",
              fontSize: 13,
              color: "var(--ink)",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {item.name}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
          <div style={{ textAlign: "right" }}>
            <div className="t-num" style={{ fontSize: 16, color: "var(--ink)" }}>
              {item.kcal}
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
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "var(--ink-mute)",
              }}
              aria-label="ลบ"
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
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          ) : (
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                className="pill"
                onClick={() => setConfirmDelete(false)}
                style={{ fontSize: 10, padding: "2px 8px" }}
              >
                ไม่
              </button>
              <button
                type="button"
                className="pill is-active"
                onClick={onDelete}
                style={{ fontSize: 10, padding: "2px 8px", background: "var(--danger)" }}
              >
                ลบ
              </button>
            </div>
          )}
        </div>
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
          P <span style={{ color: "var(--ink)" }}>{Number(item.proteinG).toFixed(0)}g</span>
        </span>
        <span>
          C <span style={{ color: "var(--ink)" }}>{Number(item.carbsG).toFixed(0)}g</span>
        </span>
        <span>
          F <span style={{ color: "var(--ink)" }}>{Number(item.fatG).toFixed(0)}g</span>
        </span>
      </div>
    </div>
  );
}
