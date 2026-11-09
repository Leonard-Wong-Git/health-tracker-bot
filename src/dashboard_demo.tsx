import { Page, Section, Button, Input, Segmented, Select, Properties, Status, Callout, useState, useEffect, useGrokTheme } from "./kit";
import type { ReactNode } from "./kit";

// Promo kit render only: stageshow layout + minny.app footer.
// Workout/body numbers below are DEMO data for public screenshots — not live records.

type Kind = "treadmill" | "outdoor" | "cardio" | "strength" | "rower" | "bike";

// Demo body weight for calorie calculator (fictional; not a live reading).
const BODY_WEIGHT_KG = 68.0;

// ===== Body composition (fictional demo data) =====
interface BodyReading {
  date: string; time?: string; note?: string; weightLb: number; approxWeight?: boolean;
  bmi?: number; fatPct?: number; waterPct?: number; musclePct?: number; muscleLb?: number;
  bonePct?: number; boneLb?: number; bmr?: number; visceral?: number; leanLb?: number; fatLb?: number;
  status?: Record<string, string>;
}

const BODY_SOURCE = "智能磅";

const BODY_COMP: BodyReading[] = [
  { date: "2026-03-15", time: "07:42", weightLb: 149.9, bmi: 22.8, fatPct: 18.4, waterPct: 55.2, musclePct: 74.8, muscleLb: 112.1, bonePct: 4.1, boneLb: 6.2, bmr: 1520, visceral: 7, leanLb: 122.4, fatLb: 27.5,
    status: { bmi: "標準", fat: "標準", water: "標準", muscle: "標準", bone: "標準", bmr: "標準", visceral: "標準", lean: "標準", fatMass: "標準" } },
  { date: "2026-03-01", time: "07:35", weightLb: 151.0, bmi: 23.0, fatPct: 18.9, waterPct: 54.8, musclePct: 74.2, muscleLb: 112.0, bonePct: 4.1, boneLb: 6.2, bmr: 1515, visceral: 8, leanLb: 122.5, fatLb: 28.5,
    status: { bmi: "標準", fat: "標準", water: "標準", muscle: "標準", bone: "標準", bmr: "標準", visceral: "標準", lean: "標準", fatMass: "標準" } },
  { date: "2026-02-14", time: "07:50", weightLb: 152.2, bmi: 23.2, fatPct: 19.3, waterPct: 54.5, musclePct: 74.1, muscleLb: 112.3, bonePct: 4.0, boneLb: 6.1, bmr: 1510, visceral: 8, leanLb: 122.8, fatLb: 29.4,
    status: { bmi: "標準", fat: "標準", water: "標準", muscle: "標準", bone: "標準", bmr: "標準", visceral: "標準", lean: "標準", fatMass: "標準" } },
  { date: "2026-01-20", time: "07:40", weightLb: 153.5, bmi: 23.4, fatPct: 19.8, waterPct: 54.1, musclePct: 73.4, muscleLb: 112.6, bonePct: 4.0, boneLb: 6.1, bmr: 1505, visceral: 9, leanLb: 123.2, fatLb: 30.3,
    status: { bmi: "標準", fat: "標準", water: "標準", muscle: "標準", bone: "標準", bmr: "標準", visceral: "標準", lean: "標準", fatMass: "標準" } },
];

const lbToKg = (lb: number): number => Math.round(lb * 0.4536 * 10) / 10;
const BODY_SORTED = [...BODY_COMP].sort((a: BodyReading, b: BodyReading) => (a.date < b.date ? 1 : -1));
const BODY_LATEST: BodyReading | undefined = BODY_SORTED[0];
const BODY_PREV: BodyReading | undefined = BODY_SORTED[1];

// ===== Workout log (fictional demo data for public assets) =====
interface LogEntry {
  date: string; start: string; end: string; name: string; minutes: number;
  km?: number; hrAvg?: number; hrMax?: number; kcal: number;
  source: string; detail?: string; notion?: string;
}

const WORKOUT_LOG: LogEntry[] = [
  { date: "2026-03-15", start: "18:40", end: "19:05", name: "室外步行", minutes: 25, km: 2.4, hrAvg: 108, hrMax: 118, kcal: 142, source: "對話", detail: "平均時速 5.8 公里，心率 96–118 次／分，強度輕鬆" },
  { date: "2026-03-15", start: "18:22", end: "18:34", name: "徒手深蹲", minutes: 12, kcal: 68, source: "捷徑", detail: "徒手，自體重量 × 4 組 × 15 次，強度中等，時間及熱量為估算（MET 5.0，68 kg）" },
  { date: "2026-03-15", start: "18:10", end: "18:20", name: "平板支撐", minutes: 10, kcal: 42, source: "手錶", detail: "徒手，4 組 × 45 秒，強度中等，時間及熱量為估算（MET 3.5，68 kg）" },
  { date: "2026-03-15", start: "17:55", end: "18:08", name: "彈力帶划船", minutes: 13, kcal: 55, source: "對話", detail: "彈力帶，中等阻力 × 3 組 × 12 次，強度中等，時間及熱量為估算（MET 4.0，68 kg）" },
  { date: "2026-03-15", start: "17:40", end: "17:52", name: "Kettlebell 擺盪", minutes: 12, kcal: 78, source: "捷徑", detail: "重訓，12 kg × 3 組 × 15 次，強度中等，時間及熱量為估算（MET 6.0，68 kg）" },
  { date: "2026-03-15", start: "17:28", end: "17:38", name: "Kettlebell 硬拉", minutes: 10, kcal: 48, source: "對話", detail: "重訓，12 kg × 3 組 × 10 次，強度中等，時間及熱量為估算（MET 4.0，68 kg）" },
  { date: "2026-03-14", start: "07:30", end: "07:55", name: "室內跑步", minutes: 25, km: 3.2, hrAvg: 142, hrMax: 155, kcal: 248, source: "捷徑", detail: "平均時速 7.7 公里，心率 120–155 次／分" },
  { date: "2026-03-13", start: "19:00", end: "19:35", name: "瑜伽伸展", minutes: 35, kcal: 95, source: "手錶", detail: "伸展，強度輕鬆，時間及熱量為估算（MET 2.5，68 kg）" },
  { date: "2026-03-12", start: "18:15", end: "18:45", name: "健身單車", minutes: 30, km: 12.0, hrAvg: 128, hrMax: 140, kcal: 210, source: "對話", detail: "阻力中等，心率 110–140 次／分" },
  { date: "2026-03-11", start: "12:10", end: "12:40", name: "室外步行", minutes: 30, km: 2.8, hrAvg: 105, hrMax: 115, kcal: 160, source: "捷徑", detail: "平均時速 5.6 公里，心率 95–115 次／分" },
  { date: "2026-03-10", start: "17:50", end: "18:20", name: "胸推機", minutes: 18, kcal: 86, source: "對話", detail: "器械，40 kg × 4 組 × 10 次，強度中等，時間及熱量為估算（MET 5.0，68 kg）" },
  { date: "2026-03-10", start: "17:30", end: "17:48", name: "高位下拉機", minutes: 18, kcal: 80, source: "捷徑", detail: "器械，35 kg × 4 組 × 10 次，強度中等，時間及熱量為估算（MET 5.0，68 kg）" },
  { date: "2026-03-09", start: "07:20", end: "07:50", name: "室內步行", minutes: 30, km: 3.0, hrAvg: 118, hrMax: 128, kcal: 175, source: "手錶", detail: "平均時速 6.0 公里，心率 100–128 次／分" },
  { date: "2026-03-07", start: "09:00", end: "09:40", name: "室外跑步", minutes: 40, km: 5.0, hrAvg: 145, hrMax: 158, kcal: 360, source: "對話", detail: "平均時速 7.5 公里，心率 125–158 次／分" },
  { date: "2026-03-04", start: "18:00", end: "18:40", name: "橢圓機", minutes: 40, hrAvg: 132, hrMax: 145, kcal: 280, source: "捷徑", detail: "阻力 8 級，心率 115–145 次／分" },
  { date: "2026-02-28", start: "10:15", end: "10:55", name: "室外跑步", minutes: 40, km: 5.2, hrAvg: 140, hrMax: 152, kcal: 350, source: "對話", detail: "平均時速 7.8 公里" },
  { date: "2026-02-21", start: "08:00", end: "08:45", name: "室外步行", minutes: 45, km: 4.2, hrAvg: 110, hrMax: 122, kcal: 220, source: "捷徑", detail: "平均時速 5.6 公里" },
  { date: "2026-02-14", start: "17:30", end: "18:10", name: "划艇機", minutes: 40, hrAvg: 135, hrMax: 148, kcal: 310, source: "手錶", detail: "穩定划距，心率 120–148 次／分" },
  { date: "2026-02-07", start: "07:40", end: "08:15", name: "室內跑步", minutes: 35, km: 4.5, hrAvg: 138, hrMax: 150, kcal: 290, source: "對話", detail: "平均時速 7.7 公里" },
  { date: "2026-01-31", start: "18:20", end: "19:00", name: "徒手訓練", minutes: 40, kcal: 180, source: "捷徑", detail: "徒手循環，強度中等，時間及熱量為估算（MET 5.0，68 kg）" },
  { date: "2026-01-24", start: "09:10", end: "09:50", name: "室外跑步", minutes: 40, km: 4.8, hrAvg: 143, hrMax: 156, kcal: 340, source: "對話", detail: "平均時速 7.2 公里" },
  { date: "2026-01-17", start: "16:00", end: "16:35", name: "健身單車", minutes: 35, km: 14.0, hrAvg: 125, hrMax: 138, kcal: 230, source: "捷徑", detail: "阻力中等" },
  { date: "2025-12-20", start: "10:00", end: "10:50", name: "室外步行", minutes: 50, km: 4.5, hrAvg: 102, hrMax: 112, kcal: 240, source: "手錶", detail: "平均時速 5.4 公里" },
  { date: "2025-12-10", start: "18:00", end: "18:45", name: "瑜伽伸展", minutes: 45, kcal: 120, source: "對話", detail: "伸展，強度輕鬆" },
  { date: "2025-11-22", start: "08:30", end: "09:10", name: "室內跑步", minutes: 40, km: 5.1, hrAvg: 141, hrMax: 154, kcal: 330, source: "捷徑", detail: "平均時速 7.65 公里" },
  { date: "2025-10-15", start: "17:40", end: "18:20", name: "橢圓機", minutes: 40, hrAvg: 130, hrMax: 142, kcal: 270, source: "對話", detail: "阻力 7 級" },
];

// Heart-rate zones (demo settings)
const ZONES: { id: string; label: string; range: string; min: number; tone: "neutral" | "success" | "accent" | "warning" | "danger" }[] = [
  { id: "Z1", label: "恢復", range: "≤119", min: 0, tone: "neutral" },
  { id: "Z2", label: "有氧基礎", range: "120–134", min: 120, tone: "success" },
  { id: "Z3", label: "節奏", range: "135–144", min: 135, tone: "accent" },
  { id: "Z4", label: "乳酸閾", range: "145–154", min: 145, tone: "warning" },
  { id: "Z5", label: "最大", range: "≥155", min: 155, tone: "danger" },
];

function zoneIndex(hr?: number): number {
  if (hr === undefined) return -1;
  let k = 0;
  ZONES.forEach((z: { min: number }, i: number) => { if (hr >= z.min) k = i; });
  return k;
}

function typeGroup(name: string): string {
  if (name.includes("跑步")) return "跑步";
  if (name.includes("步行")) return "步行";
  return "器械";
}

function mondayOf(n: number): number {
  return n - ((new Date(n * 86400000).getUTCDay() + 6) % 7);
}

function shortDate(n: number): string {
  const d = new Date(n * 86400000);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

const MONTH_UNIT: Record<string, string> = { n: "次", min: "分鐘", km: "公里", kcal: "kcal", hr: "次／分" };

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

function londonToday(): string {
  // Promo kit freeze: neutral demo day.
  return "2026-03-15";
}

function dayNum(iso: string): number {
  const p = iso.split("-").map((s: string) => parseInt(s, 10));
  return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);
}

function dateLabel(iso: string): string {
  const p = iso.split("-").map((s: string) => parseInt(s, 10));
  const wd = WEEKDAY[new Date(dayNum(iso) * 86400000).getUTCDay()];
  return `${p[1]}月${p[2]}日（${wd}）`;
}

function sumLog(list: LogEntry[]): { n: number; min: number; km: number; kcal: number } {
  return list.reduce(
    (a: { n: number; min: number; km: number; kcal: number }, e: LogEntry) => ({ n: a.n + 1, min: a.min + e.minutes, km: a.km + (e.km ?? 0), kcal: a.kcal + e.kcal }),
    { n: 0, min: 0, km: 0, kcal: 0 },
  );
}

const ROW_PRESETS: { value: string; label: string }[] = [
  { value: "500", label: "500 米" },
  { value: "1000", label: "1000 米" },
  { value: "2000", label: "2000 米" },
  { value: "5000", label: "5000 米" },
  { value: "custom", label: "自訂" },
];

function clock(sec: number, tenths: boolean): string {
  if (!isFinite(sec) || sec <= 0) return "—";
  if (tenths) {
    const t = Math.round(sec * 10);
    const m = Math.floor(t / 600);
    const r = (t - m * 600) / 10;
    return `${m}:${r < 10 ? "0" : ""}${r.toFixed(1)}`;
  }
  const s0 = Math.round(sec);
  const m = Math.floor(s0 / 60);
  const r = s0 - m * 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

type Muscle = "chest" | "delts" | "biceps" | "triceps" | "forearms" | "abs" | "obliques" | "quads" | "adductors" | "glutes" | "hams" | "calves" | "lats" | "traps" | "erector";
type Intensity = "輕鬆" | "中等" | "劇烈";
const INTENSITIES: Intensity[] = ["輕鬆", "中等", "劇烈"];

const MUSCLE_KEY: Record<string, Muscle[]> = {
  "臀大肌": ["glutes"], "臀中肌": ["glutes"], "膕繩肌": ["hams"], "核心": ["abs", "obliques"], "握力": ["forearms"], "前臂": ["forearms"],
  "上背": ["traps"], "菱形肌": ["traps"], "斜方肌": ["traps"], "三角肌": ["delts"], "前三角肌": ["delts"], "中三角肌": ["delts"], "後三角肌": ["delts"],
  "三頭肌": ["triceps"], "二頭肌": ["biceps"], "股四頭肌": ["quads"], "下背": ["erector"], "背闊肌": ["lats"], "腹斜肌": ["obliques"],
  "腹直肌": ["abs"], "下腹": ["abs"], "髖屈肌": ["quads"], "小腿肌": ["calves"], "比目魚肌": ["calves"], "大腿內側肌": ["adductors"],
  "胸大肌": ["chest"], "上胸": ["chest"], "全身": ["quads", "glutes", "hams", "calves", "chest", "lats", "delts"],
  "內收肌": ["adductors"], "腹股溝": ["adductors"], "側腰": ["obliques"], "髖屈肌（髂腰肌）": ["quads"], "豎脊肌": ["erector"], "腓腸肌": ["calves"],
};

function muscleSplit(text: string): { primary: Muscle[]; secondary: Muscle[] } {
  const primary: Muscle[] = [];
  const secondary: Muscle[] = [];
  text.split("、").forEach((name: string, i: number) => {
    (MUSCLE_KEY[name] ?? []).forEach((m: Muscle) => {
      if (i < 2) { if (!primary.includes(m)) primary.push(m); }
      else if (!primary.includes(m) && !secondary.includes(m)) secondary.push(m);
    });
  });
  return { primary, secondary };
}

interface Shape { m: Muscle; e?: [number, number, number, number, number]; d?: string; center?: boolean }

const FRONT: Shape[] = [
  { m: "traps", e: [41, 31, 5, 2.5, -20] },
  { m: "delts", e: [31, 40, 6.5, 7, 0] },
  { m: "chest", d: "M49 38 L49 54 Q42 58 35 52 Q33 44 37 39 Z" },
  { m: "biceps", e: [26.5, 56, 4.2, 10, 10] },
  { m: "forearms", e: [22.5, 87, 3.6, 12, 8] },
  { m: "abs", d: "M44 57 L56 57 L56 89 Q50 94 44 89 Z", center: true },
  { m: "obliques", e: [39, 74, 3.5, 12, -5] },
  { m: "quads", e: [40, 128, 6.5, 19, 3] },
  { m: "adductors", e: [47, 119, 2.4, 10, -6] },
  { m: "calves", e: [41, 168, 4, 12, 0] },
];

const BACK: Shape[] = [
  { m: "traps", d: "M50 27 L37 35 L50 60 L63 35 Z", center: true },
  { m: "delts", e: [31, 40, 6.5, 7, 0] },
  { m: "triceps", e: [26.5, 56, 4.2, 10, 10] },
  { m: "forearms", e: [22.5, 87, 3.6, 12, 8] },
  { m: "lats", d: "M37 45 Q33 62 40 82 L48 74 L47 58 Z" },
  { m: "erector", e: [47, 80, 2.3, 13, 0] },
  { m: "glutes", e: [42.5, 106, 7.5, 8, 0] },
  { m: "hams", e: [41, 134, 6, 17, 3] },
  { m: "calves", e: [41, 165, 5, 11, 0] },
];

function figure(shapes: Shape[], primary: Muscle[], secondary: Muscle[], dx: number, colors: { base: string; idle: string; p: string; s: string; edge: string }, fillFn?: (m: Muscle) => string): ReactNode {
  const fillOf = (m: Muscle): string => (fillFn ? fillFn(m) : primary.includes(m) ? colors.p : secondary.includes(m) ? colors.s : colors.idle);
  const draw = (sh: Shape, k: string): ReactNode => {
    if (sh.d) return <path key={k} d={sh.d} fill={fillOf(sh.m)} stroke={colors.edge} strokeWidth={0.6} />;
    const e = sh.e as [number, number, number, number, number];
    return <ellipse key={k} cx={e[0]} cy={e[1]} rx={e[2]} ry={e[3]} transform={`rotate(${e[4]} ${e[0]} ${e[1]})`} fill={fillOf(sh.m)} stroke={colors.edge} strokeWidth={0.6} />;
  };
  const limb = { stroke: colors.base, strokeLinecap: "round" as const };
  const half = (
    <g>
      <line x1={30} y1={36} x2={25.5} y2={72} strokeWidth={10} {...limb} />
      <line x1={25.5} y1={73} x2={20.5} y2={103} strokeWidth={8} {...limb} />
      <circle cx={19.5} cy={109} r={4} fill={colors.base} />
      <line x1={41} y1={104} x2={41} y2={150} strokeWidth={17} {...limb} />
      <line x1={41} y1={153} x2={41} y2={185} strokeWidth={11} {...limb} />
      <ellipse cx={40} cy={192} rx={6} ry={3} fill={colors.base} />
    </g>
  );
  const sides = shapes.filter((s: Shape) => !s.center);
  const mids = shapes.filter((s: Shape) => s.center);
  return (
    <g transform={`translate(${dx} 0)`}>
      {half}
      <g transform="matrix(-1 0 0 1 100 0)">{half}</g>
      <ellipse cx={50} cy={14} rx={9} ry={11} fill={colors.base} />
      <rect x={45} y={22} width={10} height={10} fill={colors.base} />
      <path d="M30 33 Q50 27 70 33 L67 58 L63 90 L68 104 L32 104 L37 90 L33 58 Z" fill={colors.base} />
      {sides.map((s: Shape, i: number) => draw(s, `l${i}`))}
      <g transform="matrix(-1 0 0 1 100 0)">{sides.map((s: Shape, i: number) => draw(s, `r${i}`))}</g>
      {mids.map((s: Shape, i: number) => draw(s, `c${i}`))}
    </g>
  );
}

function MuscleMap(props: { primary: Muscle[]; secondary: Muscle[] }) {
  const theme = useGrokTheme();
  const colors = { base: theme.fill.secondary, idle: theme.border.default, p: theme.dataviz.categorical[0], s: theme.dataviz.categorical[1], edge: theme.bg.base };
  const lbl = { fill: theme.text.tertiary, fontSize: 9, fontFamily: theme.font.family, textAnchor: "middle" as const };
  const sw = (c: string) => <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: c, marginRight: 6 }} />;
  const t = { color: theme.text.secondary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: theme.font.family }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <span style={t}>{sw(colors.p)}主要肌群</span>
        {props.secondary.length > 0 && <span style={t}>{sw(colors.s)}次要肌群</span>}
      </div>
      <svg width="100%" viewBox="0 0 220 214" role="img" aria-label="肌群示意圖" style={{ maxWidth: 320, display: "block", margin: "0 auto" }}>
        {figure(FRONT, props.primary, props.secondary, 5, colors)}
        {figure(BACK, props.primary, props.secondary, 115, colors)}
        <text x={55} y={208} {...lbl}>正面</text>
        <text x={165} y={208} {...lbl}>背面</text>
      </svg>
    </div>
  );
}

function Icon(props: { id: string; active: boolean; fluid?: boolean }) {
  const theme = useGrokTheme();
  const c = props.active ? theme.dataviz.categorical[0] : theme.text.secondary;
  const a = theme.dataviz.categorical[1];
  const s = { fill: "none", stroke: c, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const kb = (x: number, y: number, r: number) => (
    <g>
      <path d={`M ${x - r * 0.6} ${y - r * 0.8} Q ${x - r * 0.6} ${y - r * 1.8} ${x} ${y - r * 1.8} Q ${x + r * 0.6} ${y - r * 1.8} ${x + r * 0.6} ${y - r * 0.8}`} {...s} />
      <circle cx={x} cy={y} r={r} fill={a} stroke={c} strokeWidth={2} />
    </g>
  );
  let body: ReactNode = null;
  switch (props.id) {
    case "kb-swing":
      body = (<g><circle cx="18" cy="8" r="3.5" fill={c} /><path d="M18 12 L18 26 L14 42 M18 26 L22 42 M18 15 L30 20" {...s} /><path d="M10 36 Q 22 44 38 22" stroke={a} strokeWidth={2} fill="none" strokeDasharray="3 3" />{kb(34, 24, 5)}</g>);
      break;
    case "kb-thruster":
      body = (<g><circle cx="20" cy="14" r="3.5" fill={c} /><path d="M20 18 L20 30 L13 36 L15 44 M20 30 L27 36 L25 44 M20 21 L28 14 L28 9" {...s} /><path d="M36 40 L36 14" stroke={a} strokeWidth={2} fill="none" strokeDasharray="3 3" />{kb(28, 6, 3.5)}</g>);
      break;
    case "kb-goblet":
      body = (<g><circle cx="24" cy="7" r="3.5" fill={c} /><path d="M24 11 L24 26 M24 26 L14 30 L14 42 M24 26 L34 30 L34 42 M24 15 L20 20 L24 22 M24 15 L28 20 L24 22" {...s} />{kb(24, 23, 4)}</g>);
      break;
    case "kb-press":
      body = (<g><circle cx="22" cy="14" r="3.5" fill={c} /><path d="M22 18 L22 32 L17 44 M22 32 L27 44 M22 21 L30 13 L30 9 M22 21 L16 26" {...s} />{kb(30, 6, 3.5)}</g>);
      break;
    case "kb-row":
      body = (<g><circle cx="10" cy="14" r="3.5" fill={c} /><path d="M13 16 L30 22 L30 42 M30 22 L22 42 M18 18 L18 28 L22 30 M14 17 L12 26" {...s} />{kb(22, 35, 4)}</g>);
      break;
    case "kb-tgu":
      body = (<g><circle cx="12" cy="30" r="3.5" fill={c} /><path d="M15 32 L30 36 L42 42 M30 36 L28 42 M16 31 L24 18 L24 12 M15 33 L10 42" {...s} />{kb(24, 9, 3.5)}</g>);
      break;
    case "kb-clean":
      body = (<g><circle cx="22" cy="8" r="3.5" fill={c} /><path d="M22 12 L22 28 L17 42 M22 28 L27 42 M22 16 L30 22 L28 15" {...s} /><path d="M30 40 Q 38 30 31 18" stroke={a} strokeWidth={2} fill="none" strokeDasharray="3 3" />{kb(31, 16, 4)}</g>);
      break;
    case "pushup":
      body = (<g><circle cx="9" cy="20" r="3.5" fill={c} /><path d="M12 22 L42 30 M16 23 L16 34 M22 25 L23 34" {...s} /><path d="M4 35 L44 35" stroke={a} strokeWidth={2.4} strokeLinecap="round" /></g>);
      break;
    case "squat":
      body = (<g><circle cx="20" cy="8" r="3.5" fill={c} /><path d="M20 12 L17 26 L28 30 L26 42 M17 26 L21 34 L20 42 M19 16 L32 18" {...s} /><path d="M6 43 L42 43" stroke={a} strokeWidth={2.4} strokeLinecap="round" /></g>);
      break;
    case "lunge":
      body = (<g><circle cx="24" cy="7" r="3.5" fill={c} /><path d="M24 11 L24 26 L34 30 L34 42 M24 26 L16 34 L8 34 M24 15 L20 24 M24 15 L28 24" {...s} /><path d="M4 43 L44 43" stroke={a} strokeWidth={2.4} strokeLinecap="round" /></g>);
      break;
    case "plank":
      body = (<g><circle cx="9" cy="24" r="3.5" fill={c} /><path d="M12 26 L42 32 M14 28 L14 34 L20 34" {...s} /><path d="M4 35 L44 35" stroke={a} strokeWidth={2.4} strokeLinecap="round" /><circle cx="38" cy="14" r="6" fill="none" stroke={a} strokeWidth={2} /><path d="M38 10 L38 14 L41 16" stroke={a} strokeWidth={2} fill="none" strokeLinecap="round" /></g>);
      break;
  }
  const m = { fill: "none", stroke: a, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const cable = { fill: "none", stroke: a, strokeWidth: 1.4, strokeDasharray: "2 2" };
  switch (props.id) {
    case "m-legpress":
      body = (<g><path d="M6 20 L14 38 L26 38 M14 38 L14 44 M26 38 L26 44" {...m} /><path d="M33 19 L39 33" stroke={a} strokeWidth={3.4} strokeLinecap="round" /><path d="M37 24 L45 10" {...cable} /><circle cx="44" cy="10" r="3" fill={a} /><circle cx="9" cy="18" r="3.5" fill={c} /><path d="M11 22 L18 35 L26 23 L35 27 M13 25 L19 35" {...s} /></g>);
      break;
    case "m-chest":
      body = (<g><path d="M12 12 L12 38 L26 38 M14 38 L14 44 M24 38 L24 44" {...m} /><path d="M35 15 L35 25" stroke={a} strokeWidth={3.4} strokeLinecap="round" /><path d="M35 20 L42 8 L42 44" {...m} /><circle cx="17" cy="10" r="3.5" fill={c} /><path d="M16 14 L16 34 L28 34 L28 44 M16 19 L34 20" {...s} /></g>);
      break;
    case "m-pulldown":
      body = (<g><path d="M6 4 L42 4 M42 4 L42 44" {...m} /><path d="M24 4 L24 10" {...cable} /><path d="M10 11 L38 11" stroke={a} strokeWidth={3.4} strokeLinecap="round" /><path d="M14 40 L34 40" {...m} /><circle cx="24" cy="19" r="3.5" fill={c} /><path d="M24 23 L24 36 M24 25 L16 21 L14 12 M24 25 L32 21 L34 12 M24 36 L17 38 L17 44 M24 36 L31 38 L31 44" {...s} /></g>);
      break;
    case "m-row":
      body = (<g><path d="M4 38 L24 38 M8 38 L8 44 M22 38 L22 44" {...m} /><path d="M37 25 L37 39" stroke={a} strokeWidth={3.4} strokeLinecap="round" /><path d="M20 25 L44 30" {...cable} /><circle cx="44" cy="30" r="2.6" fill={a} /><path d="M44 33 L44 44" {...m} /><circle cx="12" cy="13" r="3.5" fill={c} /><path d="M13 17 L15 35 L26 27 L36 32 M14 21 L8 26 L19 25" {...s} /></g>);
      break;
    case "m-legext":
      body = (<g><path d="M10 10 L13 36 L28 36 M14 36 L14 44 M26 36 L26 44" {...m} /><path d="M30 37 L40 30" {...cable} /><circle cx="41" cy="28" r="3.2" fill={a} /><circle cx="16" cy="9" r="3.5" fill={c} /><path d="M17 13 L18 33 L30 33 L39 25 M17 18 L22 30" {...s} /></g>);
      break;
    case "m-legcurl":
      body = (<g><path d="M4 31 L32 31 M8 31 L8 42 M28 31 L28 42" {...m} /><path d="M36 30 L32 15" {...cable} /><circle cx="31" cy="12" r="3.2" fill={a} /><circle cx="6" cy="24" r="3.5" fill={c} /><path d="M10 26 L28 27 L36 27 L32 15 M12 26 L6 31" {...s} /></g>);
      break;
    case "m-shoulder":
      body = (<g><path d="M14 16 L14 40 L28 40 M16 40 L16 44 M26 40 L26 44" {...m} /><path d="M7 6 L15 6 M23 6 L31 6" stroke={a} strokeWidth={3.4} strokeLinecap="round" /><circle cx="19" cy="15" r="3.5" fill={c} /><path d="M19 19 L19 36 L29 36 L29 44 M19 22 L11 17 L11 7 M19 22 L27 17 L27 7" {...s} /></g>);
      break;
    case "c-bike":
      body = (<g><circle cx="36" cy="34" r="7" fill="none" stroke={a} strokeWidth={2.4} /><path d="M12 19 L20 19 M16 19 L18 44 M8 44 L44 44 M18 30 L36 34 M38 14 L38 27 M35 14 L41 14" {...m} /><circle cx="22" cy="6" r="3.5" fill={c} /><path d="M21 10 L16 18 L27 24 L24 33 M20 12 L36 14" {...s} /></g>);
      break;
    case "c-rower":
      body = (<g><path d="M4 40 L44 40 M8 40 L8 44 M40 40 L40 44 M10 36 L18 36" {...m} /><circle cx="39" cy="31" r="6" fill="none" stroke={a} strokeWidth={2.4} /><path d="M22 23 L36 29" {...cable} /><circle cx="13" cy="17" r="3.5" fill={c} /><path d="M14 21 L15 34 L26 27 L32 36 M14 24 L22 23" {...s} /></g>);
      break;
    case "c-elliptical":
      body = (<g><ellipse cx="24" cy="40" rx="14" ry="4" fill="none" stroke={a} strokeWidth={2.4} /><path d="M34 6 L38 40 M14 36 L20 38 M28 42 L34 42" {...m} /><circle cx="22" cy="7" r="3.5" fill={c} /><path d="M22 11 L22 25 L17 37 M22 25 L31 41 M22 15 L34 8" {...s} /></g>);
      break;
  }
  return <svg width={props.fluid ? "100%" : 48} height={props.fluid ? "100%" : 48} viewBox="0 0 48 48" aria-hidden="true" style={{ flex: "0 0 auto" }}>{body}</svg>;
}

// ===== 動作圖鑑 =====
type Move = [string, string, string, string, string, string, string];

const GUIDE_GROUPS: string[] = ["Kettlebell", "健身器械", "彈力帶", "有氧運動", "徒手訓練", "伸展"];

const MOVES: Move[] = [
  ["Kettlebell", "全身爆發", "擺盪", "Swing", "雙手握鈴，由胯下前擺至胸高", "臀大肌、膕繩肌、核心", "@kb-swing"],
  ["Kettlebell", "全身爆發", "單手擺盪", "One-Arm Swing", "單手握鈴，由胯下前擺至胸高", "臀大肌、膕繩肌、核心、握力", "1|47 16 46 26 46 54 58 30 70 31 45 40 44 52 47 71 47 88 45 71 45 88|K 71 42;A 54 80 80 80 80 50"],
  ["Kettlebell", "全身爆發", "上膊", "Clean", "由胯下把鈴拉起，停在肩前", "臀大肌、膕繩肌、上背、前臂", "@kb-clean"],
  ["Kettlebell", "全身爆發", "抓舉", "Snatch", "由胯下一口氣把鈴拉到頭頂", "臀大肌、上背、三角肌、核心", "1|46 16 46 26 46 54 56 14 62 3 45 40 44 52 47 71 47 88 45 71 45 88|K 66 10;A 70 80 90 56 76 20"],
  ["Kettlebell", "全身爆發", "清舉推", "Clean & Press", "先上膊至肩前，再推過頭", "臀大肌、三角肌、三頭肌、核心", "1|46 16 46 26 46 54 56 14 62 3 45 40 44 52 47 71 47 88 45 71 45 88|K 66 10;k 60 36;A 80 40 80 26 80 14"],
  ["Kettlebell", "全身爆發", "土耳其起立", "Get-up", "躺地舉鈴，慢慢站起再躺回", "三角肌、核心、臀大肌", "@kb-tgu"],
  ["Kettlebell", "下肢", "高腳杯深蹲", "Goblet Squat", "雙手捧鈴於胸前下蹲", "股四頭肌、臀大肌、核心", "@kb-goblet"],
  ["Kettlebell", "下肢", "硬拉", "Deadlift", "鈴放兩腳間，挺背屈髖拿起", "臀大肌、膕繩肌、下背", "1|68 30 60 38 36 52 61 52 61 66 59 52 59 66 46 68 44 88 44 68 42 88|K 61 77;A 82 80 82 66 82 50"],
  ["Kettlebell", "下肢", "弓步", "Lunge", "持鈴向前一步，後膝下沉", "股四頭肌、臀大肌", "1|46 18 46 28 46 56 47 42 48 54 45 42 44 54 60 64 62 88 40 82 26 86|K 48 65;A 26 56 26 64 30 74"],
  ["Kettlebell", "下肢", "單臂推舉深蹲", "Squat Press", "深蹲站起時單手推鈴過頭", "股四頭肌、臀大肌、三角肌", "@kb-thruster"],
  ["Kettlebell", "下肢", "雙手推舉深蹲", "Thruster", "雙手捧鈴深蹲，站起時推過頭", "股四頭肌、臀大肌、三角肌、三頭肌、核心", "@kb-thruster"],
  ["Kettlebell", "上肢", "推舉", "Press", "鈴在肩前，單手推至頭頂", "三角肌、三頭肌、核心", "@kb-press"],
  ["Kettlebell", "上肢", "划船", "Row", "俯身，把鈴拉向腰間", "背闊肌、菱形肌、二頭肌", "@kb-row"],
  ["Kettlebell", "核心", "風車", "Windmill", "單手舉鈴過頭，側身彎腰", "腹斜肌、三角肌、膕繩肌", "0|26 24 33 33 48 56 42 22 50 10 34 48 36 62 56 72 60 88 40 72 36 88|K 53 17;A 70 40 66 22 52 18"],
  ["Kettlebell", "核心", "俄羅斯轉體", "Russian Twist", "坐地抬腳，持鈴左右轉身", "腹斜肌、腹直肌", "1|25 40 30 50 40 76 40 62 52 60 38 64 50 62 56 62 72 68 54 64 70 70|K 56 66;A 64 46 50 34 38 42"],
  ["Kettlebell", "核心", "農夫行走", "Farmer's Walk", "雙手提鈴，挺胸向前行", "握力、斜方肌、核心", "1|48 16 48 26 48 54 49 40 50 52 47 40 46 52 54 71 58 88 43 71 38 88|K 51 62;k 46 62;A 66 30 76 30 86 30"],
  ["Kettlebell", "核心", "環繞", "Around the World", "站直，把鈴繞腰一圈由一手傳到另一手", "核心、腹斜肌、三角肌、握力", "1|48 16 48 26 48 54 54 40 58 54 42 40 40 54 52 71 54 88 44 71 42 88|K 61 62;k 35 60;A 34 68 48 78 62 70"],
  ["Kettlebell", "核心", "左右擺盪", "Side-to-Side Swing", "站立雙手握鈴，左右交替擺動", "腹斜肌、臀大肌、三角肌、握力", "0|48 16 48 26 48 54 58 36 66 46 56 38 65 47 56 70 60 88 41 70 36 88|K 67 56;k 29 56;A 30 66 48 82 66 66"],
  ["健身器械", "腿部", "腿推機", "Leg Press", "坐着用雙腳把踏板推出", "股四頭肌、臀大肌、膕繩肌", "@m-legpress"],
  ["健身器械", "腿部", "哈克深蹲機", "Hack Squat", "背靠斜墊下蹲再推起", "股四頭肌、臀大肌", "1|34 20 38 30 46 58 42 42 36 32 40 42 34 32 64 58 60 82 62 60 58 82|L 26 18 40 74;L 48 88 74 80;L 32 28 46 30;A 84 40 80 52 74 64"],
  ["健身器械", "腿部", "史密斯機深蹲", "Smith Squat", "槓在肩上沿軌道下蹲", "股四頭肌、臀大肌", "1|48 20 46 30 38 58 56 38 56 30 54 38 54 30 56 62 52 86 54 64 50 86|L 14 4 14 88;L 84 4 84 88;L 8 30 90 30;A 72 42 72 52 72 64"],
  ["健身器械", "腿部", "腿伸展機", "Leg Extension", "坐着把小腿向前踢直", "股四頭肌", "@m-legext"],
  ["健身器械", "腿部", "坐姿腿彎舉機", "Seated Leg Curl", "坐着把小腿向下屈", "膕繩肌", "1|35 20 34 30 36 58 40 44 44 56 38 44 42 56 60 58 56 82 58 59 54 83|R 24 60 26 6;L 28 60 24 24;L 50 52 66 52;g 60 58 82 60;A 84 70 80 86 64 88"],
  ["健身器械", "腿部", "俯臥腿彎舉機", "Lying Leg Curl", "伏着把腳跟拉向臀部", "膕繩肌", "@m-legcurl"],
  ["健身器械", "腿部", "站姿提踵機", "Calf Raise", "站着肩頂墊，踮起腳跟", "小腿肌", "1|48 12 48 22 48 50 49 34 44 26 47 34 52 26 48 66 48 80 46 66 46 80|R 40 82 28 6;L 38 24 58 24;L 72 4 72 88;A 84 72 84 62 84 52"],
  ["健身器械", "腿部", "坐姿提踵機", "Seated Calf", "坐着膝頂墊，踮起腳跟", "比目魚肌", "1|35 18 34 28 34 56 42 40 52 46 41 41 50 47 56 52 58 74 54 53 56 75|R 22 58 24 5;L 46 48 66 48;R 52 76 18 8;A 78 74 78 66 78 56"],
  ["健身器械", "臀部及髖", "髖外展機", "Hip Abduction", "坐着雙膝向外推開", "臀中肌", "0|48 18 48 28 48 56 58 42 62 54 38 42 34 54 64 60 66 84 32 60 30 84|R 32 58 32 6;L 72 52 72 70;L 24 52 24 70;A 76 40 82 40 90 40;A 20 40 14 40 6 40"],
  ["健身器械", "臀部及髖", "髖內收機", "Hip Adduction", "坐着雙膝向內夾", "大腿內側肌", "0|48 18 48 28 48 56 58 42 62 54 38 42 34 54 60 60 62 84 36 60 34 84|R 32 58 32 6;L 54 52 54 70;L 42 52 42 70;A 90 40 84 40 76 40;A 6 40 12 40 20 40"],
  ["健身器械", "臀部及髖", "臀推機", "Hip Thrust", "背靠墊，用臀把髖向上推", "臀大肌、膕繩肌", "1|19 40 28 46 50 46 38 52 48 42 36 54 46 44 68 48 70 86 66 50 68 86|R 6 50 24 8;L 42 40 58 40;A 50 82 50 70 50 58"],
  ["健身器械", "臀部及髖", "後踢臀機", "Glute Kickback", "單腳向後上方踢", "臀大肌", "1|66 24 60 32 44 52 66 42 72 50 64 42 70 50 30 56 14 46 46 70 46 88|L 74 30 74 62;L 82 8 82 88;A 26 74 10 72 8 54"],
  ["健身器械", "胸部", "胸推機", "Chest Press", "坐着雙手向前推出", "胸大肌、三頭肌、前三角肌", "@m-chest"],
  ["健身器械", "胸部", "上斜胸推機", "Incline Press", "坐着向前上方推出", "上胸、前三角肌", "1|21 22 24 32 32 58 40 30 52 18 38 31 50 19 54 60 54 86 52 61 52 86|R 20 60 26 5;L 26 60 14 22;L 52 10 52 26;A 60 28 66 19 74 10"],
  ["健身器械", "胸部", "蝴蝶機（夾胸）", "Pec Deck", "雙臂由兩側向中間夾", "胸大肌", "0|48 18 48 30 48 58 68 32 68 16 28 32 28 16 56 66 58 86 40 66 38 86|L 72 10 72 40;L 24 10 24 40;A 92 26 86 26 78 26;A 4 26 10 26 18 26"],
  ["健身器械", "胸部", "繩索夾胸", "Cable Fly", "拉兩邊繩索於胸前合攏", "胸大肌", "0|48 16 48 26 48 54 64 34 54 46 32 34 42 46 54 71 56 88 42 71 40 88|O 6 8 3;O 90 8 3;C 9 10 42 46;C 87 10 54 46;A 80 46 74 56 62 58"],
  ["健身器械", "背部", "高位下拉機", "Lat Pulldown", "坐着把橫槓拉到胸前", "背闊肌、二頭肌", "@m-pulldown"],
  ["健身器械", "背部", "坐姿划船機", "Seated Row", "坐着把手柄拉向腹部", "背闊肌、菱形肌、二頭肌", "@m-row"],
  ["健身器械", "背部", "輔助引體上升機", "Assisted Pull-up", "跪在墊上把身體拉上", "背闊肌、二頭肌", "0|48 18 48 28 48 54 60 18 58 4 36 18 38 4 54 70 54 82 42 70 42 82|L 24 4 72 4;R 34 82 28 6;A 80 52 80 42 80 30"],
  ["健身器械", "背部", "直臂下壓", "Straight-Arm", "手臂伸直把繩索壓下", "背闊肌", "1|53 19 50 28 44 54 60 39 70 50 58 40 68 51 48 71 48 88 46 71 46 88|O 84 8 3;C 83 11 70 50;g 50 28 72 12;A 80 30 84 46 76 60"],
  ["健身器械", "背部", "背部伸展機", "Back Extension", "俯身再挺直上身", "下背、臀大肌", "1|70 38 64 44 44 62 62 52 56 46 60 53 54 47 32 74 20 84 30 75 18 85|L 40 70 52 58;L 12 88 46 64;O 20 80 3;g 44 62 56 84;A 60 74 76 68 80 48"],
  ["健身器械", "肩部", "肩推機", "Shoulder Press", "坐着把手柄推過頭", "三角肌、三頭肌", "@m-shoulder"],
  ["健身器械", "肩部", "側平舉機", "Lateral Raise", "雙臂向兩側抬至肩高", "中三角肌", "0|48 18 48 28 48 56 64 28 78 30 32 28 18 30 56 66 58 86 40 66 38 86|R 34 58 28 5;A 86 46 88 40 86 32;A 10 46 8 40 10 32"],
  ["健身器械", "肩部", "反向飛鳥機", "Reverse Fly", "面向機，雙臂向後打開", "後三角肌、上背", "1|47 20 46 30 44 58 34 30 20 32 36 31 22 33 62 60 62 86 60 61 60 86|L 58 24 58 54;R 30 60 26 5;g 46 30 72 32;A 66 22 46 10 26 22"],
  ["健身器械", "手臂", "二頭肌彎舉機", "Bicep Curl", "屈肘把手柄拉向肩", "二頭肌", "1|37 20 36 30 32 58 64 50 58 30 62 51 56 31 54 60 54 86 52 61 52 86|L 46 40 70 54;R 20 60 26 5;g 64 50 78 60;A 82 50 80 32 66 24"],
  ["健身器械", "手臂", "三頭肌下壓（繩索）", "Pushdown", "手肘貼身把繩索壓下", "三頭肌", "1|49 16 48 26 48 54 50 40 60 56 49 41 59 57 49 71 49 88 47 71 47 88|O 70 4 3;C 70 7 60 56;g 50 40 62 30;A 82 30 82 44 82 58"],
  ["健身器械", "手臂", "三頭肌伸展機", "Tricep Ext.", "屈肘再把手柄推直", "三頭肌", "1|41 20 40 30 36 58 62 34 76 42 61 35 75 43 58 60 58 86 56 61 56 86|L 50 40 68 40;R 24 60 26 5;g 62 34 52 18;A 58 14 80 14 82 34"],
  ["健身器械", "腹部及核心", "腹部捲腹機", "Ab Crunch", "坐着收腹向前捲", "腹直肌", "1|60 38 52 36 34 58 56 46 52 34 55 47 51 35 56 60 56 86 54 61 54 86|R 22 60 26 5;g 34 58 34 26;A 38 14 60 12 68 28"],
  ["健身器械", "腹部及核心", "旋轉軀幹機", "Torso Rotation", "坐着上身左右轉", "腹斜肌", "0|48 18 48 30 48 58 60 40 44 46 36 40 52 46 56 66 58 86 40 66 38 86|R 34 58 28 5;A 22 34 48 54 74 34"],
  ["健身器械", "腹部及核心", "懸垂舉腿", "Leg Raise", "吊着或撐着把雙腿抬起", "下腹、髖屈肌", "1|42 14 40 24 40 54 40 36 56 34 39 37 55 35 62 52 82 52 60 54 80 54|L 34 8 34 62;L 36 34 60 34;g 40 54 42 86;A 66 82 84 80 86 62"],
  ["彈力帶", "", "划船", "Band Row", "帶固定前方，拉向腹部", "背闊肌、菱形肌", "1|33 42 32 52 30 80 26 62 40 64 25 63 39 65 52 80 72 80 50 81 70 81|L 88 40 88 88;O 88 52 3;B 40 64 88 52;A 64 46 54 46 44 46"],
  ["彈力帶", "", "胸推", "Chest Press", "帶繞背，雙手向前推", "胸大肌、三頭肌", "1|48 16 48 26 48 54 58 32 70 32 56 33 68 33 47 71 47 88 45 71 45 88|B 70 32 56 38 42 36 40 30 46 26;A 74 22 82 22 90 22"],
  ["彈力帶", "", "深蹲", "Squat", "雙腳踩帶，持帶下蹲", "股四頭肌、臀大肌", "1|48 20 46 30 36 58 56 38 54 28 54 39 52 29 56 62 50 86 54 63 48 86|B 52 88 54 28;A 76 40 76 50 76 62"],
  ["彈力帶", "", "側走", "Lateral Walk", "帶套膝上，半蹲橫行", "臀中肌", "0|48 20 48 30 48 56 58 42 52 50 38 42 44 50 60 70 62 88 36 70 34 88|B 36 66 48 63 60 66;B 36 71 48 74 60 71;A 70 50 80 50 90 50"],
  ["彈力帶", "", "臀橋", "Glute Bridge", "帶套膝上，躺地抬臀", "臀大肌、膕繩肌", "1|13 80 24 82 48 66 34 86 44 86 33 86 43 86 64 54 70 86 62 56 68 86|B 60 50 67 52 65 58 58 56 60 50;A 48 58 48 50 48 42"],
  ["彈力帶", "", "肩推", "Shoulder Press", "雙腳踩帶，推過頭", "三角肌、三頭肌", "0|48 18 48 28 48 56 56 14 58 2 40 14 38 2 54 72 56 88 42 72 40 88|B 44 88 38 2;B 52 88 58 2;A 76 26 76 16 76 6"],
  ["彈力帶", "", "側平舉", "Lateral Raise", "踩帶，雙臂側舉至肩高", "中三角肌", "0|48 18 48 28 48 56 64 28 78 30 32 28 18 30 54 72 56 88 42 72 40 88|B 52 88 78 30;B 44 88 18 30;A 88 46 90 40 88 32"],
  ["彈力帶", "", "二頭彎舉", "Bicep Curl", "踩帶，屈肘拉向肩", "二頭肌", "1|49 16 48 26 48 54 50 40 58 28 49 41 57 29 49 71 49 88 47 71 47 88|B 50 88 58 28;g 50 40 52 56;A 68 54 72 36 62 24"],
  ["彈力帶", "", "三頭伸展", "Tricep Ext.", "帶在頭後，向上伸直手肘", "三頭肌", "1|49 16 48 26 48 54 52 10 56 0 40 40 42 50 49 71 49 88 47 71 47 88|B 42 50 34 30 56 0;g 52 10 40 20;A 68 22 68 12 68 2"],
  ["彈力帶", "", "面拉", "Face Pull", "帶固定前方，拉向面部", "後三角肌、上背", "1|51 16 48 26 48 54 38 20 56 18 37 21 55 19 49 71 49 88 47 71 47 88|L 88 10 88 88;O 88 20 3;B 56 18 88 20;A 78 8 68 8 58 8"],
  ["彈力帶", "", "拉開", "Pull-apart", "雙手持帶於胸前向外拉", "後三角肌、菱形肌", "0|48 18 48 28 48 56 64 32 80 32 32 32 16 32 54 72 56 88 42 72 40 88|B 16 32 48 34 80 32;A 70 20 80 20 90 20;A 26 20 16 20 6 20"],
  ["徒手訓練", "", "掌上壓", "Push-up", "俯撐，屈肘降胸再推起", "胸大肌、三頭肌、核心", "@pushup"],
  ["徒手訓練", "", "徒手深蹲", "Squat", "雙腳與肩同寬下蹲", "股四頭肌、臀大肌", "@squat"],
  ["徒手訓練", "", "弓箭步", "Lunge", "向前一步，後膝下沉", "股四頭肌、臀大肌", "@lunge"],
  ["徒手訓練", "", "平板支撐", "Plank", "前臂撐地，身體成一直線", "核心、三角肌", "@plank"],
  ["有氧運動", "", "划艇機", "Rower", "蹬腿後再拉手柄向腹部", "股四頭肌、背闊肌、心肺", "@c-rower"],
  ["有氧運動", "", "健身單車", "Exercise Bike", "坐着踩踏板", "股四頭肌、臀大肌、心肺", "@c-bike"],
  ["有氧運動", "", "橢圓機", "Elliptical", "手推腳踩，前後擺動", "全身、心肺", "@c-elliptical"],
  ["有氧運動", "", "超慢跑", "Slow Jogging", "在墊上原地小步輕跑，約 180 步／分", "小腿肌、股四頭肌、臀大肌、心肺", "1|48 12 47 22 46 50 54 36 58 30 41 36 37 42 55 67 52 83 46 69 46 87|R 22 88 52 2;A 72 72 72 64 72 56"],
  ["徒手訓練", "", "提踵", "Calf Raise", "站直，踮起腳跟再慢慢放下", "腓腸肌、比目魚肌", "1|48 12 48 22 48 50 50 36 50 50 46 36 46 50 48 66 47 80 46 66 45 80|R 38 82 24 6;A 70 72 70 62 70 52"],
  ["徒手訓練", "", "船式", "Boat Pose", "坐地後傾，雙腿抬起，身體成 V 形", "腹直肌、髖屈肌", "0|24 48 30 56 44 80 42 60 56 62 40 58 54 60 58 64 72 48 56 62 70 46|R 10 88 76 2"],
  ["徒手訓練", "", "登山跑", "Mountain Climber", "俯撐，雙膝輪流快速提向胸口", "核心、髖屈肌、三角肌、心肺", "0|78 44 70 50 40 60 70 69 70 88 68 69 68 88 56 70 46 84 26 72 12 86|R 10 88 76 2;A 26 80 36 80 46 78"],
  ["徒手訓練", "", "高抬腿", "High Knees", "原地交替把膝蓋抬至髖部高度", "髖屈肌、核心、心肺", "1|48 12 48 22 48 50 56 36 60 26 40 36 40 48 62 50 60 66 48 69 48 88|A 76 70 76 60 76 50"],
  ["伸展", "", "三角式", "Triangle Pose", "雙腳分開，上身側傾，一手向下一手向上", "膕繩肌、內收肌、腹斜肌、側腰", "0|76 44 67 48 44 62 67 63 67 78 64 36 62 24 57 75 70 88 34 75 24 88|R 10 88 76 2"],
  ["伸展", "", "低弓步式", "Low Lunge", "前腳屈膝，後膝着地，髖部向前沉", "髖屈肌（髂腰肌）、股四頭肌", "0|49 34 48 44 46 70 52 32 54 20 46 32 46 20 64 68 66 88 30 86 12 88|R 10 88 76 2"],
  ["伸展", "", "坐立前屈", "Seated Forward Fold", "坐地雙腿伸直，由髖部向前屈", "膕繩肌、小腿肌、豎脊肌", "0|58 62 50 66 28 84 62 72 74 80 60 72 72 80 52 86 76 86 50 86 74 86|R 10 88 76 2"],
  ["伸展", "", "坐姿單腿抱腿", "Seated Knee Hug", "坐直，把單膝抱向胸口", "臀大肌、下背", "0|35 44 34 54 34 82 44 66 52 60 42 64 50 58 50 58 52 82 56 84 78 84|R 10 88 76 2"],
  ["伸展", "", "束角式", "Bound Angle", "坐地，腳掌相對，雙膝向兩側放鬆", "內收肌、腹股溝", "0|48 40 48 50 48 80 58 66 50 82 38 66 46 82 66 74 50 84 30 74 46 84|R 10 88 76 2"],
  ["伸展", "", "駱駝式（選做）", "Camel Pose", "跪立，胸口上提，上身向後伸展", "髖屈肌、股四頭肌、胸大肌、腹直肌", "0|34 36 42 42 54 62 38 60 30 82 40 60 32 82 54 86 30 86 52 86 28 86|R 10 88 76 2"],
];

const MOVE_CALC: string[] = (
  "s9.8 s9.8 s9.8 s9.8 s9.8 s5 s6 s6 s5 s8 s5 s5 s4 s4 s6 s4.5 s7 " +
  "s5 s6 s6 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s5 s3.5 s5 s5 s3.5 s3.5 s5 s5 s5 s3.5 s3.5 s5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.8 " +
  "s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 s3.5 " +
  "s3.8 s5 s3.8 t3 row bike ell c4.8 " +
  "s2.8 t3.8 t8 t7 " +
  "t2.3 t2.3 t2.3 t2.3 t2.3 t2.3"
).split(" ");

interface CalcItem { key: string; label: string; name: string; kind: Kind; met: number; timed: boolean; primary: Muscle[]; secondary: Muscle[] }

const CALC_ITEMS: CalcItem[] = [
  { key: "run-in", label: "跑步｜室內跑步（跑步機）", name: "室內跑步", kind: "treadmill", met: 0, timed: false, primary: ["quads", "glutes", "hams", "calves"], secondary: ["abs", "obliques", "erector"] },
  { key: "run-out", label: "跑步｜室外跑步", name: "室外跑步", kind: "outdoor", met: 0, timed: false, primary: ["quads", "glutes", "hams", "calves"], secondary: ["abs", "obliques", "erector"] },
  ...MOVES.map((m: Move, i: number): CalcItem => {
    const c = MOVE_CALC[i] ?? "s4";
    const kind: Kind = c === "row" ? "rower" : c === "bike" ? "bike" : c === "ell" || c.startsWith("c") ? "cardio" : "strength";
    const ms = muscleSplit(m[5]);
    return {
      key: `m${i}`, label: `${m[0]}｜${m[2]} ${m[3]}`, name: `${m[2]} ${m[3]}`, kind,
      met: kind === "strength" || c.startsWith("c") ? parseFloat(c.slice(1)) : 0, timed: c.startsWith("t"), primary: ms.primary, secondary: ms.secondary,
    };
  }),
];

CALC_ITEMS.push({ key: "walk-in", label: "步行｜跑步機斜坡步行 Incline Walk", name: "跑步機斜坡步行", kind: "treadmill", met: 0, timed: false, primary: ["glutes", "hams", "calves"], secondary: ["quads", "abs", "erector"] });

const CALC_CATS: string[] = ["跑步及步行", "Kettlebell", "健身器械", "彈力帶", "有氧運動", "徒手訓練", "伸展"];
function calcCat(c: CalcItem): string {
  return c.key.startsWith("m") ? (MOVES[parseInt(c.key.slice(1), 10)] ?? [""])[0] : "跑步及步行";
}
function cardioMets(c: CalcItem): number[] {
  return c.name.startsWith("超慢跑") ? [4.3, 4.8, 6.0] : [4, 5, 7];
}

// ===== stageshow 觀感：柔和進場（減少動態設定時直接顯示）、格狀版面、內部捲動 =====
const EASE = "cubic-bezier(0.3, 0.75, 0.1, 1)";

function useReduced(): boolean {
  const [r, setR] = useState<boolean>(false);
  useEffect(() => {
    try { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch { setR(false); }
  }, []);
  return r;
}

function Reveal(props: { delay?: number; children?: ReactNode }) {
  const reduced = useReduced();
  const [on, setOn] = useState<boolean>(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 30 + (props.delay ?? 0));
    return () => clearTimeout(id);
  }, []);
  const show = on || reduced;
  return (
    <div style={{ minWidth: 0, opacity: show ? 1 : 0, transform: show ? "none" : "translateY(10px)", transition: reduced ? "none" : `opacity 420ms ease, transform 560ms ${EASE}` }}>
      {props.children}
    </div>
  );
}

// 格狀：桌面兩至三欄，手機一欄
function Cols(props: { min: number; tpl?: string; gap?: number; children?: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: props.tpl ?? `repeat(auto-fit, minmax(min(100%, ${props.min}px), 1fr))`, gap: props.gap ?? 18, alignItems: "start" }}>{props.children}</div>;
}

function Stack(props: { children?: ReactNode; gap?: number }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: props.gap ?? 14, minWidth: 0 }}>{props.children}</div>;
}

function Scroller(props: { h: number; children?: ReactNode }) {
  const theme = useGrokTheme();
  return (
    <div style={{ maxHeight: props.h, overflowY: "auto", overscrollBehavior: "contain", paddingRight: 4, borderRadius: 16, scrollbarWidth: "thin", scrollbarColor: `${theme.border.strong} transparent` }}>
      {props.children}
    </div>
  );
}

// ===== 響應式：手機 <700、iPad 直向 700–999、iPad 橫向 1000–1299、桌面 ≥1300 =====
type Bp = "phone" | "portrait" | "land" | "desk";
type Vp = { w: number; h: number; bp: Bp; fit: boolean };
function readVp(): { w: number; h: number } {
  try {
    const sh = window.screen && window.screen.availHeight > 0 ? window.screen.availHeight : 4000;
    return { w: window.innerWidth, h: Math.min(window.innerHeight, sh, 1100) };
  } catch { return { w: 1180, h: 820 }; }
}
function useVp(): Vp {
  const [s, setS] = useState<{ w: number; h: number }>(readVp());
  useEffect(() => {
    const on = () => setS(readVp());
    try { window.addEventListener("resize", on); } catch { /* 無視窗時不作處理 */ }
    return () => { try { window.removeEventListener("resize", on); } catch { /* 無視窗時不作處理 */ } };
  }, []);
  const bp: Bp = s.w < 700 ? "phone" : s.w < 1000 ? "portrait" : s.w < 1300 ? "land" : "desk";
  return { w: s.w, h: s.h, bp, fit: (bp === "land" || bp === "desk") && s.h >= 600 };
}

// 緊湊表格：行高約 30px，數字靠右，表頭固定
function CompactTable(props: { columns: string[]; rows: string[][] }) {
  const theme = useGrokTheme();
  const cell = { padding: "6px 8px", fontSize: 13, lineHeight: "18px", fontVariantNumeric: "tabular-nums" as const, whiteSpace: "nowrap" as const };
  return (
    <div style={{ overflowX: "auto", fontFamily: theme.font.family }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>{props.columns.map((c: string, i: number) => (
            <th key={`h${i}`} style={{ ...cell, position: "sticky", top: 0, background: theme.bg.base, color: theme.text.tertiary, fontWeight: theme.weight.medium, fontSize: 12, textAlign: i === 0 ? "left" : "right", borderBottom: `1px solid ${theme.border.default}` }}>{c}</th>
          ))}</tr>
        </thead>
        <tbody>
          {props.rows.map((r: string[], j: number) => (
            <tr key={`r${j}`} style={{ background: j % 2 === 1 ? theme.fill.secondary : "transparent" }}>
              {r.map((c: string, i: number) => (
                <td key={`c${i}`} style={{ ...cell, textAlign: i === 0 ? "left" : "right", color: i === 0 ? theme.text.secondary : theme.text.primary, fontWeight: i === r.length - 1 && i > 0 ? theme.weight.semibold : theme.weight.regular }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 小型趨勢線（取代大圖表，高度可調）
function MiniTrend(props: { points: { label: string; value: number }[]; color: string; unit: string; h: number }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const [on, setOn] = useState<boolean>(false);
  useEffect(() => { const id = setTimeout(() => setOn(true), 120); return () => clearTimeout(id); }, []);
  const pts = props.points;
  if (pts.length < 2) return null;
  const vals = pts.map((p: { value: number }) => p.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = Math.max(0.5, hi - lo);
  const W = 300;
  const H = Math.max(60, props.h - 22);
  const pad = 10;
  const x = (i: number): number => pad + (i * (W - pad * 2)) / (pts.length - 1);
  const y = (v: number): number => pad + (1 - (v - lo) / span) * (H - pad * 2);
  const line = pts.map((p: { value: number }, i: number) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const first = pts[0];
  const d = Math.round((last.value - first.value) * 10) / 10;
  const small = { color: theme.text.tertiary, fontSize: 12, lineHeight: "16px" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: theme.font.family }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ color: theme.text.primary, fontSize: 22, lineHeight: "26px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{`${last.value}${props.unit}`}</span>
        <span style={small}>{`較首次 ${d > 0 ? "+" : d < 0 ? "−" : ""}${d === 0 ? "持平" : Math.abs(d)}`}</span>
        <span style={{ ...small, marginLeft: "auto" }}>{`低 ${lo}・高 ${hi}`}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block", overflow: "visible" }}>
        <line x1={pad} x2={W - pad} y1={y(lo)} y2={y(lo)} stroke={theme.border.subtle} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <line x1={pad} x2={W - pad} y1={y(hi)} y2={y(hi)} stroke={theme.border.subtle} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <polyline points={line} fill="none" stroke={props.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={on || reduced ? 0 : 1} style={{ transition: reduced ? "none" : `stroke-dashoffset 900ms ${EASE}` }} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", ...small }}>
        <span>{first.label}</span>
        <span>{`${pts.length} 次讀數`}</span>
        <span>{last.label}</span>
      </div>
    </div>
  );
}

function CardBox(props: { title?: string; aside?: string; children?: ReactNode }) {
  const theme = useGrokTheme();
  return (
    <div style={{ borderRadius: 22, background: theme.bg.base, border: `1px solid ${theme.border.subtle}`, padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 12, minWidth: 0, fontFamily: theme.font.family }}>
      {props.title && (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: theme.text.primary, fontSize: 15, lineHeight: "20px", fontWeight: theme.weight.semibold, letterSpacing: "-0.01em" }}>{props.title}</span>
          {props.aside && <span style={{ color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{props.aside}</span>}
        </div>
      )}
      {props.children}
    </div>
  );
}

function CatPills(props: { value: string; options: string[]; onPick: (v: string) => void }) {
  const theme = useGrokTheme();
  const c = PASTEL[3];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontFamily: theme.font.family }}>
      {props.options.map((o: string) => {
        const on = o === props.value;
        return (
          <div key={o} role="button" onClick={() => props.onPick(o)} style={{ padding: "9px 14px", minHeight: 38, boxSizing: "border-box", display: "flex", alignItems: "center", borderRadius: theme.radius.full, background: on ? c : theme.bg.elevated, color: on ? INK : theme.text.secondary, fontWeight: theme.weight.semibold, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.label.lineHeight, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", transition: `background 250ms ease` }}>{o}</div>
        );
      })}
    </div>
  );
}

function guideSubs(g: string): string[] {
  const out: string[] = [];
  MOVES.forEach((m: Move) => { if (m[0] === g && m[1] && !out.includes(m[1])) out.push(m[1]); });
  return out;
}

function MoveArt(props: { art: string; label: string; h?: number }) {
  const theme = useGrokTheme();
  if (props.art.startsWith("@")) {
    return (
      <div role="img" aria-label={props.label} style={{ height: props.h ?? 96, display: "flex", justifyContent: "center" }}>
        <Icon id={props.art.slice(1)} active={false} fluid />
      </div>
    );
  }
  const parts = props.art.split("|");
  const toes = parts[0] === "1";
  const n = parts[1].split(" ").map((s: string) => parseFloat(s));
  const pt = (i: number): [number, number] => [n[i * 2], n[i * 2 + 1]];
  const [H, N, P, E1, W1, E2, W2, K1, F1, K2, F2] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i: number) => pt(i));
  const fig = theme.text.secondary;
  const eq = theme.dataviz.categorical[1];
  const arr = theme.dataviz.categorical[0];
  let k = 0;
  const seg = (a: [number, number], b: [number, number], col: string, w: number, op: number, dash?: string): ReactNode => (
    <line key={`s${k++}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={w} strokeLinecap="round" opacity={op} strokeDasharray={dash} />
  );
  const back: ReactNode[] = [];
  const front: ReactNode[] = [];
  (parts[2] ?? "").split(";").filter((s: string) => s.trim() !== "").forEach((part: string) => {
    const bits = part.trim().split(" ");
    const t = bits[0];
    const v = bits.slice(1).map((s: string) => parseFloat(s));
    if (t === "L") back.push(seg([v[0], v[1]], [v[2], v[3]], eq, 4.8, 1));
    else if (t === "R") back.push(<rect key={`r${k++}`} x={v[0]} y={v[1]} width={v[2]} height={v[3]} rx={2} fill="none" stroke={eq} strokeWidth={3} />);
    else if (t === "O") back.push(<circle key={`o${k++}`} cx={v[0]} cy={v[1]} r={v[2]} fill={eq} />);
    else if (t === "C") back.push(seg([v[0], v[1]], [v[2], v[3]], eq, 2.4, 1, "4 4"));
    else if (t === "B") {
      const pts: string[] = [];
      for (let i = 0; i + 1 < v.length; i += 2) pts.push(`${v[i]},${v[i + 1]}`);
      back.push(<polyline key={`b${k++}`} points={pts.join(" ")} fill="none" stroke={eq} strokeWidth={2.6} strokeLinejoin="round" />);
    } else if (t === "g") back.push(seg([v[0], v[1]], [v[2], v[3]], theme.text.tertiary, 4.8, 0.6, "5 5"));
    else if (t === "K" || t === "k") {
      const x = v[0];
      const y = v[1];
      front.push(
        <g key={`k${k++}`} opacity={t === "K" ? 1 : 0.4}>
          <path d={`M${x - 4} ${y - 4} Q${x - 4} ${y - 11} ${x} ${y - 11} Q${x + 4} ${y - 11} ${x + 4} ${y - 4}`} fill="none" stroke={eq} strokeWidth={2.8} />
          <circle cx={x} cy={y} r={6} fill={eq} />
        </g>,
      );
    } else if (t === "A") {
      const ang = Math.atan2(v[5] - v[3], v[4] - v[2]);
      const a1 = [v[4] - 5 * Math.cos(ang - 0.5), v[5] - 5 * Math.sin(ang - 0.5)];
      const a2 = [v[4] - 5 * Math.cos(ang + 0.5), v[5] - 5 * Math.sin(ang + 0.5)];
      front.push(
        <path key={`a${k++}`} d={`M${v[0]} ${v[1]} Q${v[2]} ${v[3]} ${v[4]} ${v[5]} M${a1[0].toFixed(1)} ${a1[1].toFixed(1)} L${v[4]} ${v[5]} L${a2[0].toFixed(1)} ${a2[1].toFixed(1)}`} fill="none" stroke={arr} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />,
      );
    }
  });
  const far = 0.45;
  return (
    <svg width="100%" height={props.h ?? 96} viewBox="-2 -4 100 98" role="img" aria-label={props.label} style={{ display: "block" }}>
      <line x1={2} y1={89} x2={94} y2={89} stroke={theme.border.default} strokeWidth={1.5} />
      {back}
      {seg(N, E2, fig, 4.8, far)}
      {seg(E2, W2, fig, 4.8, far)}
      {seg(P, K2, fig, 4.8, far)}
      {seg(K2, F2, fig, 4.8, far)}
      {toes && seg(F2, [F2[0] + 5, F2[1]], fig, 4.8, far)}
      {seg(N, P, fig, 4.8, 1)}
      {seg(N, E1, fig, 4.8, 1)}
      {seg(E1, W1, fig, 4.8, 1)}
      {seg(P, K1, fig, 4.8, 1)}
      {seg(K1, F1, fig, 4.8, 1)}
      {toes && seg(F1, [F1[0] + 5, F1[1]], fig, 4.8, 1)}
      <circle cx={H[0]} cy={H[1]} r={7} fill={fig} />
      {front}
    </svg>
  );
}

const MOVE_TIPS: Record<string, string> = {
  "Kettlebell|擺盪": "3 組 × 10–15；用髖部發力，手臂只作引導；背部保持平直，鈴擺至胸高即可；站直時收緊臀部，不要後仰",
  "Kettlebell|單手擺盪": "3 組 × 每邊 8–10；先熟練雙手擺盪；肩膀拉穩，不讓身體被鈴扭轉；髖部爆發，背部保持中立",
  "Kettlebell|上膊": "3 組 × 每邊 6–8；鈴貼身拉起，手腕順勢轉入；鈴輕放前臂，不要撞手腕；髖部發力，背部保持中立",
  "Kettlebell|抓舉": "3 組 × 每邊 5–8；熟練擺盪及上膊後才做；頂部手臂伸直，肩膀穩定；鈴走貼身路線，避免撞前臂",
  "Kettlebell|清舉推": "3 組 × 每邊 6–8；先穩定上膊，再推舉；推舉時收緊臀部及腹部，不後仰；頂部手臂貼近耳邊",
  "Kettlebell|土耳其起立": "2–3 組 × 每邊 2–3 次；眼睛望住鈴，手臂全程伸直；逐步慢慢完成，不求快；先空手或用輕鈴練習",
  "Kettlebell|高腳杯深蹲": "3 組 × 10–12；膝蓋與腳尖同方向；胸口挺起，重心在腳掌中間；蹲至舒適深度，不痛為準",
  "Kettlebell|硬拉": "3 組 × 8–10；屈髖向後坐，背部保持平直；鈴貼近身體拿起；站直時收緊臀部，不要後仰",
  "Kettlebell|弓步": "3 組 × 每邊 8–10；步幅足夠，前膝不內塌；上身挺直，後膝落至地面上方；需要時扶牆保持平衡",
  "Kettlebell|單臂推舉深蹲": "3 組 × 每邊 8；用腿的力量帶動推舉；推過頭時肋骨下收，不拱腰；選擇較輕的鈴",
  "Kettlebell|雙手推舉深蹲": "3 組 × 8–10；雙手捧鈴於胸前深蹲；用腿發力站起，順勢把鈴推過頭；推過頭時肋骨下收，不拱腰",
  "Kettlebell|推舉": "3 組 × 每邊 8–10；收緊臀部及腹部，腰不後拱；推至手臂伸直，手肘稍向前；肩膀不適即減重",
  "Kettlebell|划船": "3 組 × 每邊 10–12；背部平直，另一手撐穩；手肘向後拉向腰間；不要扭轉上身借力",
  "Kettlebell|風車": "2–3 組 × 每邊 5；眼睛望住頭頂的鈴；屈髖向側下，不是彎腰；先空手練熟幅度",
  "Kettlebell|俄羅斯轉體": "3 組 × 每邊 10；背部挺直，不要拱背；以胸口轉動，不只是手動；下背不適可雙腳着地",
  "Kettlebell|農夫行走": "3 組 × 20–30 米；挺胸，肩膀向下向後；步伐穩定，核心收緊；握力不足即放下休息",
  "Kettlebell|環繞": "3 組 × 每方向 8–10 圈；站直，腹部收緊，只用手傳鈴，身體不要跟着轉；鈴貼近腰間，換手時握穩；兩個方向都要做",
  "Kettlebell|左右擺盪": "3 組 × 每邊 10–15；膝蓋微屈，用髖部及腹部帶動，手臂只作引導；擺至腰至胸高，不要甩過肩；背部保持平直，腳掌踩穩",
  "健身器械|腿推機": "3 組 × 10–12；腳掌全踩踏板，膝蓋與腳尖同方向；伸直時膝蓋不要鎖死；下背貼緊靠墊",
  "健身器械|哈克深蹲機": "3 組 × 10–12；背部貼墊，重心在腳掌中間至腳跟；膝蓋與腳尖同方向；控制下降速度",
  "健身器械|史密斯機深蹲": "3 組 × 8–10；先扣好安全鈎；雙腳稍放前，背部挺直；蹲至舒適深度即可",
  "健身器械|腿伸展機": "3 組 × 12–15；軸心對準膝蓋；慢起慢落，不要甩動；膝蓋不適用較輕重量",
  "健身器械|坐姿腿彎舉機": "3 組 × 10–12；腿墊壓在腳踝上方；屈膝到底停一秒；回程慢慢控制",
  "健身器械|俯臥腿彎舉機": "3 組 × 10–12；髖部貼緊墊面，不要翹臀；腳跟拉向臀部；不用甩力",
  "健身器械|站姿提踵機": "3 組 × 12–15；踮到最高停一秒；腳跟慢慢放低至伸展；膝蓋微曲，不鎖死",
  "健身器械|坐姿提踵機": "3 組 × 12–15；膝墊壓穩大腿；全幅度上落；慢速控制",
  "健身器械|髖外展機": "3 組 × 12–15；坐直，背貼靠墊；向外推時慢慢控制；不要用身體前後擺動",
  "健身器械|髖內收機": "3 組 × 12–15；起始幅度不要拉得太開；雙膝慢慢夾合；腹股溝不適即減幅度",
  "健身器械|臀推機": "3 組 × 10–12；頂部收緊臀部停一秒；下巴微收，不拱腰；以腳跟發力",
  "健身器械|後踢臀機": "3 組 × 每邊 10–12；用臀部發力向後踢；腰部不要拱起；動作慢而穩",
  "健身器械|胸推機": "3 組 × 10–12；把手與胸中線同高；肩胛向後收、向下沉；推出時手肘不鎖死",
  "健身器械|上斜胸推機": "3 組 × 10–12；背貼靠墊，胸口挺起；肩膀不聳起；慢落穩推",
  "健身器械|蝴蝶機（夾胸）": "3 組 × 12–15；手肘微曲，角度固定；合攏時擠壓胸部停一秒；回程不要拉過身後",
  "健身器械|繩索夾胸": "3 組 × 12–15；前後腳站穩；手肘微曲，以弧線合攏；不要前傾借力",
  "健身器械|高位下拉機": "3 組 × 10–12；拉向上胸，不拉到頸後；胸口挺起，肩胛先下沉；上身不要後仰太多",
  "健身器械|坐姿划船機": "3 組 × 10–12；背部挺直，不前後擺動；先收肩胛再屈肘；手肘貼身向後拉",
  "健身器械|輔助引體上升機": "3 組 × 8–10；輔助重量越大越容易；肩膀先下沉再拉；慢慢放下",
  "健身器械|直臂下壓": "3 組 × 12–15；手臂近乎伸直，以背闊肌壓下；上身微前傾保持穩定；不聳肩",
  "健身器械|背部伸展機": "2–3 組 × 10–12；起至身體成直線即止，不過度後仰；動作慢而穩；下背痛即停止",
  "健身器械|肩推機": "3 組 × 10–12；背貼靠墊，腰不拱；推至接近伸直，手肘不鎖死；不聳肩",
  "健身器械|側平舉機": "3 組 × 12–15；抬至肩高即止；以手肘帶動，不聳肩；慢慢放下",
  "健身器械|反向飛鳥機": "3 組 × 12–15；胸貼墊，手肘微曲；向後打開時收肩胛；用輕重量",
  "健身器械|二頭肌彎舉機": "3 組 × 10–12；上臂貼墊不移動；慢慢放下至接近伸直；不用身體借力",
  "健身器械|三頭肌下壓（繩索）": "3 組 × 12–15；手肘貼身固定；壓至手臂伸直停一秒；上身不前傾借力",
  "健身器械|三頭肌伸展機": "3 組 × 12–15；手肘對準軸心；伸直時不猛力鎖死；慢速回程",
  "健身器械|腹部捲腹機": "3 組 × 12–15；以腹部捲曲，不用手拉；呼氣時收腹；重量宜輕",
  "健身器械|旋轉軀幹機": "2–3 組 × 每邊 10–12；坐直，髖部固定；幅度適中，不要猛轉；下背不適即停止",
  "健身器械|懸垂舉腿": "2–3 組 × 8–12；屈膝可降低難度；不要擺盪身體借力；慢慢放下",
  "彈力帶|划船": "3 組 × 12–15；背部挺直；先收肩胛再拉；回程慢慢放",
  "彈力帶|胸推": "3 組 × 12–15；帶繞上背或固定在身後；推出時不聳肩；手腕保持平直",
  "彈力帶|深蹲": "3 組 × 12–15；膝蓋與腳尖同方向；胸口挺起；起身時收緊臀部",
  "彈力帶|側走": "2–3 組 × 每邊 10–15 步；保持半蹲，膝蓋不內塌；步伐細而穩；上身不左右搖",
  "彈力帶|臀橋": "3 組 × 12–15；頂部收緊臀部，膝蓋向外撐帶；不要拱腰；以腳跟發力",
  "彈力帶|肩推": "3 組 × 12–15；腳踩穩彈力帶；收緊腹部，不後仰；推至手臂伸直",
  "彈力帶|側平舉": "3 組 × 12–15；抬至肩高即止；手肘微曲；不聳肩",
  "彈力帶|二頭彎舉": "3 組 × 12–15；手肘貼身；慢慢放下；身體不搖動",
  "彈力帶|三頭伸展": "3 組 × 12–15；上臂固定，只動前臂；肋骨下收，不拱腰；慢速回程",
  "彈力帶|面拉": "3 組 × 12–15；拉向眉心，手肘向外向上；收肩胛停一秒；用輕阻力",
  "彈力帶|拉開": "3 組 × 15；手臂在胸前伸直；拉開時收肩胛；不聳肩",
  "徒手訓練|掌上壓": "3 組 × 8–12；身體成一直線，不塌腰；手肘與身體約 45 度；可扶牆或跪地降低難度",
  "徒手訓練|徒手深蹲": "3 組 × 12–15；重心在腳掌中間；膝蓋與腳尖同方向；可扶椅背保持平衡",
  "徒手訓練|弓箭步": "3 組 × 每邊 8–10；上身挺直；前膝不內塌；需要時扶牆",
  "徒手訓練|平板支撐": "3 組 × 20–40 秒；手肘在肩膀正下方；身體成一直線，不塌腰不翹臀；保持正常呼吸",
  "有氧運動|划艇機": "15–20 分鐘或 2000 米・心率 Z2（120–134 次／分）；次序：蹬腿、後傾、拉手；回程倒序，背部挺直；手柄拉向下胸，不聳肩",
  "有氧運動|健身單車": "20–30 分鐘・心率 Z2（120–134 次／分）；座位高度令膝蓋在最低點微曲；踏頻約 80–90；上身放鬆",
  "有氧運動|橢圓機": "20–30 分鐘・心率 Z2（120–134 次／分）；上身挺直，不靠扶手撐體重；腳掌貼緊踏板；節奏平穩",
  "有氧運動|超慢跑": "10–30 分鐘・約 180 步／分・心率 Z2（120–134 次／分）；在墊上原地小步，以前腳掌輕着地；跟節拍器保持步頻；保持「微笑配速」，可以說話",
  "徒手訓練|提踵": "3–4 組 × 15–20；踮至最高停一秒；腳跟慢慢放下，控制下降速度；需要時扶牆保持平衡",
  "徒手訓練|船式": "3 組 × 20–30 秒；脊柱保持伸長，不要拱背；屈膝可降低難度；保持正常呼吸",
  "徒手訓練|登山跑": "4–6 組 × 20–30 秒；肩膀位於手腕正上方；臀部不要抬得太高；心率會明顯上升，按體能調節速度",
  "徒手訓練|高抬腿": "5 組 × 30 秒；可代替跳繩及開合跳，衝擊較低；上身挺直，收緊核心；改為原地踏步較溫和，計算熱量時請選「輕鬆」",
  "伸展|三角式": "每邊 30–60 秒 × 1–2 輪；宜於運動後進行；兩腳相距約一條腿長；膝蓋與腳尖方向一致；肩膀放鬆，不要聳肩",
  "伸展|低弓步式": "每邊 30–60 秒 × 1–2 輪；宜於運動後進行；前膝位於腳踝正上方；骨盆保持穩定；收緊腹部，下背不要塌陷",
  "伸展|坐立前屈": "30–60 秒 × 1–2 輪；宜於運動後進行，跑步後尤其適合；由髖部向前延伸，而非彎腰；不要強行拉伸；呼吸保持平順",
  "伸展|坐姿單腿抱腿": "每邊 30–60 秒 × 1–2 輪；宜於運動後進行；脊柱向上延伸；左右兩邊均須進行",
  "伸展|束角式": "30–60 秒 × 1–2 輪；宜於運動後進行；不要用手向下壓膝蓋；腰背挺直，讓雙膝自然放鬆",
  "伸展|駱駝式（選做）": "30–60 秒 × 1–2 輪（選做）；宜於運動後進行；對腰椎要求較高，雙手可扶住骨盆；感到任何不適即停止",
};

function moveTips(m: Move): { sets: string; tips: string[] } {
  const raw = MOVE_TIPS[`${m[0]}|${m[2]}`] ?? "2–3 組 × 10–12；動作慢而穩；保持正常呼吸";
  const parts = raw.split("；");
  return { sets: parts[0], tips: parts.slice(1) };
}

function MoveSheet(props: { m: Move; onClose: () => void; onCalc?: () => void }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const [up, setUp] = useState<boolean>(false);
  useEffect(() => { const id = setTimeout(() => setUp(true), 20); return () => clearTimeout(id); }, []);
  const shown = up || reduced;
  const m = props.m;
  const c = PASTEL[3];
  const dark = theme.kind === "dark";
  const t = moveTips(m);
  const ms = muscleSplit(m[5]);
  const names = m[5].split("、");
  const prim = names.slice(0, 2);
  const sec = names.slice(2);
  const kg = m[0] === "有氧運動" ? undefined : lastKg(m);
  const cap = { fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  const head = { color: theme.text.secondary, fontWeight: theme.weight.semibold, ...cap };
  const chip = (txt: string, bg: string): ReactNode => (
    <span key={txt} style={{ padding: "3px 12px", borderRadius: theme.radius.full, background: bg, color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight }}>{txt}</span>
  );
  return (
    <div onClick={props.onClose} style={{ position: "fixed", inset: 0, zIndex: 60, background: shown ? "rgba(20,16,18,0.42)" : "rgba(20,16,18,0)", transition: reduced ? "none" : "background 300ms ease", display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: theme.font.family }}>
      <div onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()} role="dialog" aria-label={`${m[2]} 詳情`} style={{ width: "100%", maxWidth: 820, maxHeight: "88vh", overflowY: "auto", background: theme.bg.base, borderRadius: "28px 28px 0 0", boxShadow: "0 -8px 30px rgba(0,0,0,0.18)", transform: shown ? "none" : "translateY(40px)", opacity: shown ? 1 : 0, transition: reduced ? "none" : `transform 520ms ${EASE}, opacity 300ms ease` }}>
        <div style={{ position: "relative", padding: "14px 18px 12px", background: `linear-gradient(160deg, ${c}${dark ? "55" : "66"}, ${c}${dark ? "18" : "1C"})` }}>
          <div style={{ width: 44, height: 5, borderRadius: 3, background: theme.border.default, margin: "0 auto 10px" }} />
          <div role="button" aria-label="關閉" onClick={props.onClose} style={{ position: "absolute", right: 14, top: 14, width: 34, height: 34, borderRadius: 17, background: theme.bg.elevated, color: theme.text.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>×</div>
          <div style={{ color: theme.text.primary, fontSize: 24, lineHeight: "30px", fontWeight: theme.weight.semibold }}>{m[2]}</div>
          <div style={{ color: theme.text.secondary, ...cap }}>{`${m[3]}・${m[0]}${m[1] ? `・${m[1]}` : ""}・${m[4]}`}</div>
        </div>
        <div style={{ padding: "14px 18px 22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16, alignItems: "start" }}>
          <div style={{ borderRadius: 20, background: theme.bg.elevated, padding: "8px 12px" }}>
            <MoveArt art={m[6]} label={`${m[2]} ${m[3]}`} h={170} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={head}>主要訓練肌肉</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{prim.map((n: string) => chip(n, `${PASTEL[0]}${dark ? "55" : "44"}`))}</div>
            <span style={head}>次要肌肉</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{sec.length > 0 ? sec.map((n: string) => chip(n, `${PASTEL[1]}${dark ? "44" : "33"}`)) : <span style={{ color: theme.text.tertiary, ...cap }}>沒有明顯的次要肌肉</span>}</div>
            <MuscleMap primary={ms.primary} secondary={ms.secondary} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ borderRadius: 18, padding: "12px 14px", background: `${c}${dark ? "26" : "2A"}`, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={head}>建議組數 × 次數</span>
              <span style={{ color: theme.text.primary, fontSize: 18, lineHeight: "24px", fontWeight: theme.weight.semibold }}>{t.sets}</span>
              {kg && <span style={{ color: theme.text.secondary, ...cap }}>{`上次紀錄：${kg} kg`}</span>}
            </div>
            {props.onCalc && <Button label="計算熱量" onClick={props.onCalc} />}
            <span style={head}>注意事項</span>
            {t.tips.map((x: string) => (
              <div key={x} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight }}>
                <span style={{ width: 7, height: 7, borderRadius: 4, background: c, marginTop: 7, flex: "0 0 auto" }} />
                <span>{x}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TodaySlider(props: { labels: string[]; colors: string[]; slides: ReactNode[]; lead?: ReactNode; h?: number }) {
  const theme = useGrokTheme();
  const [idx, setIdx] = useState<number>(0);
  const [x0, setX0] = useState<number>(-1);
  const [y0, setY0] = useState<number>(0);
  const n = props.slides.length;
  const go = (i: number) => setIdx(Math.max(0, Math.min(n - 1, i)));
  const arrow = (dir: number, label: string, glyph: string): ReactNode => {
    const off = dir < 0 ? idx === 0 : idx === n - 1;
    return (
      <div role="button" aria-label={label} onClick={() => { if (!off) go(idx + dir); }} style={{ width: 44, height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", background: theme.bg.elevated, color: theme.text.primary, opacity: off ? 0.35 : 1, cursor: off ? "default" : "pointer", fontSize: 22, lineHeight: "22px", userSelect: "none", flex: "0 0 auto" }}>{glyph}</div>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: theme.font.family }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: props.lead ? "space-between" : "center", gap: 10, flexWrap: "wrap" }}>
        {props.lead}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {arrow(-1, "上一張", "‹")}
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: theme.radius.full, background: theme.bg.elevated }}>
          {props.labels.map((l: string, i: number) => {
            const on = i === idx;
            return (
              <div key={l} role="button" onClick={() => go(i)} style={{ padding: "10px 18px", borderRadius: theme.radius.full, background: on ? props.colors[i] ?? PASTEL[0] : "transparent", color: on ? INK : theme.text.secondary, fontWeight: theme.weight.semibold, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight, cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", transition: "background 350ms ease, color 350ms ease" }}>{l}</div>
            );
          })}
        </div>
        {arrow(1, "下一張", "›")}
        </div>
      </div>
      <div
        onPointerDown={(e: { clientX: number; clientY: number }) => { setX0(e.clientX); setY0(e.clientY); }}
        onPointerUp={(e: { clientX: number; clientY: number }) => {
          if (x0 >= 0) {
            const dx = e.clientX - x0;
            const dy = e.clientY - y0;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
          }
          setX0(-1);
        }}
        onPointerCancel={() => setX0(-1)}
        style={{ overflow: "hidden", touchAction: "pan-y", borderRadius: 24 }}
      >
        <div style={{ display: "flex", alignItems: "stretch", width: `${n * 100}%`, transform: `translateX(-${(idx * 100) / n}%)`, transition: `transform 450ms ${EASE}` }}>
          {props.slides.map((s: ReactNode, i: number) => (
            <div key={`sl${i}`} aria-hidden={i !== idx} style={{ flex: `0 0 ${100 / n}%`, width: `${100 / n}%`, minWidth: 0, boxSizing: "border-box", padding: "0 1px", display: "flex", flexDirection: "column", height: props.h, overflowY: props.h ? "auto" : undefined }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TodayCard(props: { children?: ReactNode; cols?: string }) {
  const theme = useGrokTheme();
  const C = PASTEL[5];
  const dark = theme.kind === "dark";
  return (
    <div style={{ flex: "1 1 auto", borderRadius: 24, padding: "14px 14px 16px", background: `linear-gradient(160deg, ${C}${dark ? "44" : "40"}, ${C}${dark ? "14" : "10"})`, border: `1px solid ${C}66`, display: "grid", gridTemplateColumns: props.cols ?? "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 16, alignItems: "start", fontFamily: theme.font.family }}>
      {props.children}
    </div>
  );
}

function GuideGrid(props: { moves: { m: Move; i: number }[]; selected: string; onPick: (key: string) => void }) {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
      {props.moves.map((x: { m: Move; i: number }, j: number) => {
        const m = x.m;
        const on = props.selected === `m${x.i}`;
        return (
          <Reveal key={`g${x.i}`} delay={Math.min(j, 10) * 35}>
            <div
              role="button"
              onClick={() => props.onPick(`m${x.i}`)}
              style={{
                padding: "8px 10px 10px", borderRadius: 18,
                border: `${on ? 2 : 1}px solid ${on ? theme.border.focus : theme.border.subtle}`,
                background: on ? theme.fill.accentSubtle : theme.bg.elevated, cursor: "pointer",
                fontFamily: theme.font.family, display: "flex", flexDirection: "column", gap: 2, minWidth: 0,
                transition: `background ${theme.motion.hover} ${theme.motion.easing}`,
              }}
            >
              <MoveArt art={m[6]} label={`${m[2]} ${m[3]}`} h={72} />
              <div style={{ marginTop: 2, color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight, fontWeight: theme.weight.semibold }}>{m[2]}</div>
              <div style={{ color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{m[3]}</div>
              <div style={{ color: theme.text.accent, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m[5].split("、").join(" · ")}</div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

interface BodyTile { label: string; value: string; sub?: string; status?: string }

function bodyTiles(r: BodyReading): BodyTile[] {
  const s = r.status ?? {};
  const t: BodyTile[] = [{ label: "體重", value: `${lbToKg(r.weightLb)} kg`, sub: `${r.weightLb.toFixed(1)} lb` }];
  if (r.bmi !== undefined) t.push({ label: "BMI", value: `${r.bmi}`, status: s.bmi });
  if (r.fatPct !== undefined) t.push({ label: "體脂率", value: `${r.fatPct}%`, sub: r.fatLb !== undefined ? `脂肪 ${lbToKg(r.fatLb)} kg` : undefined, status: s.fat });
  if (r.visceral !== undefined) t.push({ label: "內臟脂肪", value: `${r.visceral}`, status: s.visceral });
  if (r.muscleLb !== undefined) t.push({ label: "肌肉量", value: `${lbToKg(r.muscleLb)} kg`, sub: r.musclePct !== undefined ? `${r.musclePct}%` : undefined, status: s.muscle });
  if (r.leanLb !== undefined) t.push({ label: "去脂體重", value: `${lbToKg(r.leanLb)} kg`, sub: `${r.leanLb} lb`, status: s.lean });
  if (r.waterPct !== undefined) t.push({ label: "水分", value: `${r.waterPct}%`, status: s.water });
  if (r.boneLb !== undefined) t.push({ label: "骨量", value: `${lbToKg(r.boneLb)} kg`, sub: r.bonePct !== undefined ? `${r.bonePct}%` : undefined, status: s.bone });
  if (r.bmr !== undefined) t.push({ label: "基礎代謝", value: `${r.bmr}`, sub: "kcal／日", status: s.bmr });
  if (r.fatLb !== undefined) t.push({ label: "脂肪重量", value: `${lbToKg(r.fatLb)} kg`, sub: `${r.fatLb} lb`, status: s.fatMass });
  return t;
}

function signed(n: number, digits: number): string {
  const v = Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
  if (v === 0) return "持平";
  return `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`;
}

function bodyCompare(prev: BodyReading, now: BodyReading): string[][] {
  const rows: string[][] = [[
    "體重",
    `${prev.approxWeight ? "約 " : ""}${lbToKg(prev.weightLb)} kg`,
    `${lbToKg(now.weightLb)} kg`,
    `${signed(lbToKg(now.weightLb) - lbToKg(prev.weightLb), 1)} kg（${signed(now.weightLb - prev.weightLb, 1)} lb）`,
  ]];
  if (prev.fatPct !== undefined && now.fatPct !== undefined) rows.push(["體脂率", `${prev.fatPct}%`, `${now.fatPct}%`, `${signed(now.fatPct - prev.fatPct, 1)} 百分點`]);
  if (prev.muscleLb !== undefined && now.muscleLb !== undefined) rows.push(["肌肉量", `${lbToKg(prev.muscleLb)} kg`, `${lbToKg(now.muscleLb)} kg`, signed(now.muscleLb - prev.muscleLb, 1) === "持平" ? "持平" : `${signed(lbToKg(now.muscleLb) - lbToKg(prev.muscleLb), 1)} kg`]);
  if (prev.bmi !== undefined && now.bmi !== undefined) rows.push(["BMI", `${prev.bmi}`, `${now.bmi}`, signed(now.bmi - prev.bmi, 1)]);
  if (prev.bmr !== undefined && now.bmr !== undefined) rows.push(["基礎代謝", `${prev.bmr} kcal`, `${now.bmr} kcal`, `${signed(now.bmr - prev.bmr, 0)} kcal`]);
  if (prev.visceral !== undefined && now.visceral !== undefined) rows.push(["內臟脂肪", `${prev.visceral}`, `${now.visceral}`, signed(now.visceral - prev.visceral, 0)]);
  if (prev.waterPct !== undefined && now.waterPct !== undefined) rows.push(["水分", `${prev.waterPct}%`, `${now.waterPct}%`, `${signed(now.waterPct - prev.waterPct, 1)} 百分點`]);
  if (prev.leanLb !== undefined && now.leanLb !== undefined) rows.push(["去脂體重", `${lbToKg(prev.leanLb)} kg`, `${lbToKg(now.leanLb)} kg`, `${signed(lbToKg(now.leanLb) - lbToKg(prev.leanLb), 1)} kg`]);
  if (prev.fatLb !== undefined && now.fatLb !== undefined) rows.push(["脂肪重量", `${lbToKg(prev.fatLb)} kg`, `${lbToKg(now.fatLb)} kg`, `${signed(lbToKg(now.fatLb) - lbToKg(prev.fatLb), 1)} kg`]);
  return rows;
}

const BODY_ASC = [...BODY_SORTED].reverse();
const bodyDate = (iso: string): string => `${parseInt(iso.slice(5, 7), 10)}月${parseInt(iso.slice(8, 10), 10)}日`;
const trendRange = (vals: number[], pad: number): { floor: number; ceiling: number } => ({
  floor: Math.floor(Math.min(...vals) - pad),
  ceiling: Math.ceil(Math.max(...vals) + pad),
});
const BODY_W_POINTS = BODY_ASC.map((r: BodyReading) => ({ label: bodyDate(r.date), value: lbToKg(r.weightLb) }));
const BODY_F_POINTS = BODY_ASC.filter((r: BodyReading) => r.fatPct !== undefined).map((r: BodyReading) => ({ label: bodyDate(r.date), value: r.fatPct ?? 0 }));
const BODY_W_RANGE = trendRange(BODY_W_POINTS.map((p: { value: number }) => p.value), 1);
const BODY_F_RANGE = trendRange(BODY_F_POINTS.map((p: { value: number }) => p.value), 1);
const BODY_HISTORY_ROWS: string[][] = BODY_SORTED.map((r: BodyReading) => [
  `${bodyDate(r.date)}${r.time ? ` ${r.time}` : ""}${r.note ? `（${r.note}）` : ""}`,
  `${r.approxWeight ? "約 " : ""}${lbToKg(r.weightLb)} kg`,
  r.fatPct !== undefined ? `${r.fatPct}%` : "—",
  r.visceral !== undefined ? `${r.visceral}` : "—",
  r.muscleLb !== undefined ? `${lbToKg(r.muscleLb)} kg` : "—",
  r.bmr !== undefined ? `${r.bmr}` : "—",
]);

function BodyTiles(props: { tiles: BodyTile[] }) {
  const theme = useGrokTheme();
  const tone = (s?: string): "success" | "warning" | "neutral" => (s === "標準" ? "success" : s === "偏高" || s === "偏低" ? "warning" : "neutral");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, fontFamily: theme.font.family }}>
      {props.tiles.map((t: BodyTile, i: number) => (
        <Reveal key={t.label} delay={i * 50}>
          <div style={{ padding: "8px 12px", borderRadius: 16, border: `1px solid ${theme.border.subtle}`, background: theme.bg.elevated, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <span style={{ color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{t.label}</span>
              {t.status && <Status tone={tone(t.status)}>{t.status}</Status>}
            </div>
            <div style={{ color: theme.text.primary, fontSize: 18, lineHeight: "24px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{t.value}</div>
            {t.sub && <div style={{ color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{t.sub}</div>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

type ZoneRow = { id: string; label: string; range: string; min: number; n: number };

function ZoneBars(props: { rows: ZoneRow[] }) {
  const theme = useGrokTheme();
  const col = (i: number): string => [PASTEL_GRAY, PASTEL[2], PASTEL[1], PASTEL[3], PASTEL[0]][i] ?? PASTEL_GRAY;
  const total = Math.max(1, props.rows.reduce((a: number, r: ZoneRow) => a + r.min, 0));
  const max = Math.max(1, ...props.rows.map((r: ZoneRow) => r.min));
  const small = { color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, fontFamily: theme.font.family }}>
      <div style={{ display: "flex", height: 22, borderRadius: 11, overflow: "hidden", background: theme.fill.secondary, marginBottom: 4 }}>
        {props.rows.map((r: ZoneRow, i: number) => (r.min > 0 ? (
          <div key={r.id} style={{ flex: `${r.min} 0 0`, background: col(i), color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: theme.font.caption.fontSize, fontWeight: theme.weight.semibold }}>{`${Math.round((r.min / total) * 100)}%`}</div>
        ) : null))}
      </div>
      {props.rows.map((r: ZoneRow, i: number) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: "0 0 26px", height: 26, borderRadius: 13, background: col(i), color: INK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: theme.font.caption.fontSize, fontWeight: theme.weight.semibold }}>{r.id}</div>
          <div style={{ flex: "0 0 30%", minWidth: 0 }}>
            <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: "18px", fontWeight: theme.weight.semibold }}>{r.label}</div>
            <div style={small}>{`${r.range} 次／分`}</div>
          </div>
          <div style={{ flex: "1 1 auto", height: 8, borderRadius: 4, background: theme.fill.secondary }}>
            <div style={{ width: `${(r.min / max) * 100}%`, height: "100%", borderRadius: 4, background: col(i) }} />
          </div>
          <div style={{ flex: "0 0 22%", textAlign: "right" }}>
            <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: "18px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{`${r.min} 分`}</div>
            <div style={small}>{`${r.n} 次`}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stepper(props: { label: string; value: number; step: number; min: number; max?: number; onChange: (v: number) => void }) {
  const theme = useGrokTheme();
  const btn = {
    width: 44, height: 44, borderRadius: theme.radius.full, border: `1px solid ${theme.border.default}`,
    background: theme.bg.elevated, color: theme.text.primary, fontSize: 18, cursor: "pointer", fontFamily: theme.font.family,
  };
  const clamp = (v: number) => Math.min(props.max ?? 9999, Math.max(props.min, Math.round(v * 10) / 10));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontFamily: theme.font.family }}>
      <div style={{ minWidth: 104, color: theme.text.secondary, fontSize: theme.font.label.fontSize }}>{props.label}</div>
      <button style={btn} onClick={() => props.onChange(clamp(props.value - props.step))}>−</button>
      <div style={{ minWidth: 48, textAlign: "center", color: theme.text.primary, fontSize: 20, fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{props.value}</div>
      <button style={btn} onClick={() => props.onChange(clamp(props.value + props.step))}>+</button>
    </div>
  );
}

function acsmVO2(kmh: number, gradePct: number): number {
  const v = (kmh * 1000) / 60;
  const g = gradePct / 100;
  return kmh < 6.5 ? 0.1 * v + 1.8 * v * g + 3.5 : 0.2 * v + 0.9 * v * g + 3.5;
}

const fmt1 = (n: number): string => (Math.round(n * 10) / 10).toString();

function paceText(minPerKm: number): string {
  if (!isFinite(minPerKm) || minPerKm <= 0) return "—";
  let m = Math.floor(minPerKm);
  let s = Math.round((minPerKm - m) * 60);
  if (s === 60) { m += 1; s = 0; }
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// ===== 柔和雜誌風格（設計 C）=====
const PASTEL: string[] = ["#E88AA2", "#7FA8D9", "#86C29E", "#F2B45E", "#A993D6", "#EE9A86"];
const PASTEL_GRAY = "#C9BDB5";
const INK = "#3B3335";
const tint = (hex: string, kind: string): string => `${hex}${kind === "dark" ? "33" : "2B"}`;

const GLYPH: Record<string, string> = {
  run: "M17 4a2 2 0 1 1-4 0a2 2 0 1 1 4 0M10 21l2-6 3 3v4M6 12l3-4 4 1 3 4 3 1M9 8l-2 5",
  walk: "M15 4a2 2 0 1 1-4 0a2 2 0 1 1 4 0M9 21l2-7 3 3 1 4M11 14l1-6-4 2-1 4M12 8l3 3 3 1",
  machine: "M3 19h18M5 19v-3M19 19v-3M21 12a3 3 0 1 1-6 0a3 3 0 1 1 6 0M10 7a2 2 0 1 1-4 0a2 2 0 1 1 4 0M8 9l1 6 5-3",
  calendar: "M6 5h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM3 10h18M8 3v4M16 3v4",
  scale: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM8 9a5 5 0 0 1 8 0M12 9l1.5-2",
  flame: "M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z",
  kb: "M8 9V7a4 4 0 0 1 8 0v2M18 15a6 6 0 1 1-12 0a6 6 0 1 1 12 0",
  band: "M4 12c0-4 4-6 8-6s8 2 8 6-4 6-8 6-8-2-8-6z",
  body: "M14 4a2 2 0 1 1-4 0a2 2 0 1 1 4 0M5 9h14M12 9v6l-3 6M12 15l3 6",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.5M4.5 12h.5M4.5 18h.5",
  book: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6",
  stretch: "M14 4a2 2 0 1 1-4 0a2 2 0 1 1 4 0M12 8l-1 7-4 6M11 15l5 6M12 9l5-5M12 10l-6 3",
};

function Glyph(props: { id: string; color: string; size?: number }) {
  const sz = props.size ?? 22;
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "0 0 auto", display: "block" }}>
      <path d={GLYPH[props.id] ?? ""} fill="none" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TYPE_STYLE: Record<string, { glyph: string; color: string }> = {
  "跑步": { glyph: "run", color: PASTEL[0] },
  "步行": { glyph: "walk", color: PASTEL[2] },
  "器械": { glyph: "machine", color: PASTEL[4] },
};

interface HeroStat { value: string; label: string }
interface HeroCard { kicker: string; value: string; unit: string; detail: string; color: string; glyph: string; stats: HeroStat[] }

function HeroCards(props: { cards: HeroCard[] }) {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontFamily: theme.font.family }}>
      {props.cards.map((c: HeroCard, i: number) => (
        <Reveal key={c.kicker} delay={i * 70}>
          <div style={{ position: "relative", borderRadius: 22, padding: "14px 18px 16px", background: tint(c.color, theme.kind), minWidth: 0 }}>
            <div style={{ position: "absolute", right: 16, top: 14 }}><Glyph id={c.glyph} color={c.color} size={32} /></div>
            <div style={{ color: theme.text.secondary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight, fontWeight: theme.weight.semibold }}>{c.kicker}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
              <span style={{ color: theme.text.primary, fontSize: 40, lineHeight: "46px", fontWeight: theme.weight.semibold, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{c.value}</span>
              <span style={{ color: theme.text.secondary, fontSize: theme.font.body1.fontSize, fontWeight: theme.weight.semibold }}>{c.unit}</span>
            </div>
            <div style={{ color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{c.detail}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {c.stats.map((s: HeroStat) => (
                <div key={s.label} style={{ flex: "1 1 80px", borderRadius: 12, padding: "6px 10px", background: theme.bg.elevated, minWidth: 0 }}>
                  <div style={{ color: theme.text.primary, fontSize: 17, lineHeight: "22px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                  <div style={{ color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Lollipop(props: { points: { label: string; value: number }[]; ceil: number; unit: string }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const [grown, setGrown] = useState<boolean>(false);
  useEffect(() => { const id = setTimeout(() => setGrown(true), 120); return () => clearTimeout(id); }, []);
  const g = grown || reduced;
  const W = 600;
  const H = 180;
  const L = 36;
  const R = 18;
  const T = 24;
  const B = 28;
  const n = props.points.length;
  const x = (i: number): number => L + (n <= 1 ? 0 : (i * (W - L - R)) / (n - 1));
  const y = (v: number): number => T + (H - T - B) * (1 - v / props.ceil);
  const tick = { fill: theme.text.tertiary, fontSize: 11, fontFamily: theme.font.family };
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`每週運動時間（${props.unit}）`} style={{ display: "block" }}>
      {[0, props.ceil / 2, props.ceil].map((v: number) => (
        <g key={`t${v}`}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={theme.border.subtle} strokeDasharray={v === 0 ? undefined : "3 4"} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" {...tick}>{Math.round(v)}</text>
        </g>
      ))}
      {props.points.map((p: { label: string; value: number }, i: number) => {
        const c = PASTEL[i % 5];
        const yy = g ? y(p.value) : y(0);
        const tr = reduced ? "none" : `all 700ms ${EASE} ${i * 40}ms`;
        return (
          <g key={`p${i}`}>
            {p.value > 0 ? (
              <g>
                <line x1={x(i)} x2={x(i)} y1={y(0)} y2={yy} stroke={c} strokeWidth={4} strokeLinecap="round" style={{ transition: tr }} />
                <circle cx={x(i)} cy={yy} r={6} fill={c} style={{ transition: tr }} />
                <text x={x(i)} y={yy - 11} textAnchor="middle" fill={theme.text.secondary} fontSize={11} fontWeight={600} fontFamily={theme.font.family} style={{ transition: tr, opacity: g ? 1 : 0 }}>{p.value}</text>
              </g>
            ) : (
              <circle cx={x(i)} cy={y(0)} r={2.5} fill={theme.border.strong} />
            )}
            {p.label !== "" && <text x={x(i)} y={H - 8} textAnchor="middle" {...tick}>{p.label}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function MonthPills(props: { points: { label: string; value: number; display: string }[] }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const [grown, setGrown] = useState<boolean>(false);
  useEffect(() => { const id = setTimeout(() => setGrown(true), 120); return () => clearTimeout(id); }, []);
  const g = grown || reduced;
  const max = Math.max(1, ...props.points.map((p: { value: number }) => p.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, minHeight: 150, paddingTop: 6, fontFamily: theme.font.family }}>
      {props.points.map((p: { label: string; value: number; display: string }, i: number) => (
        <div key={p.label} style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", textAlign: "center", gap: 5 }}>
          <div style={{ color: theme.text.primary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight, fontWeight: theme.weight.semibold, overflowWrap: "anywhere", fontVariantNumeric: "tabular-nums" }}>{p.display}</div>
          <div style={{ height: p.value > 0 ? (g ? Math.max(6, Math.round((p.value / max) * 96)) : 6) : 2, borderRadius: "999px 999px 10px 10px", background: p.value > 0 ? PASTEL[i % PASTEL.length] : theme.border.default, transition: reduced ? "none" : `height 650ms ${EASE} ${i * 50}ms` }} />
          <div style={{ color: theme.text.tertiary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{p.label}</div>
        </div>
      ))}
    </div>
  );
}

interface BodyBar { label: string; frac: number; value: string; status?: string; color: string }

function bodyBars(r: BodyReading): BodyBar[] {
  const s = r.status ?? {};
  const out: BodyBar[] = [];
  if (r.fatPct !== undefined) out.push({ label: "體脂率", frac: r.fatPct / 40, value: `${r.fatPct}%`, status: s.fat, color: PASTEL[0] });
  if (r.musclePct !== undefined) out.push({ label: "肌肉率", frac: r.musclePct / 100, value: `${r.musclePct}%`, status: s.muscle, color: PASTEL[2] });
  if (r.waterPct !== undefined) out.push({ label: "水分", frac: r.waterPct / 100, value: `${r.waterPct}%`, status: s.water, color: PASTEL[1] });
  if (r.bonePct !== undefined) out.push({ label: "骨量", frac: r.bonePct / 10, value: `${r.boneLb !== undefined ? `${lbToKg(r.boneLb)} kg・` : ""}${r.bonePct}%`, status: s.bone, color: PASTEL[4] });
  if (r.visceral !== undefined) out.push({ label: "內臟脂肪", frac: r.visceral / 30, value: `${r.visceral}`, status: s.visceral, color: PASTEL[5] });
  if (r.bmi !== undefined) out.push({ label: "BMI", frac: r.bmi / 40, value: `${r.bmi}`, status: s.bmi, color: PASTEL[3] });
  return out;
}

const BODY_TILE_KEEP: string[] = ["體重", "肌肉量", "去脂體重", "脂肪重量", "基礎代謝"];

const statusTone = (s?: string): "success" | "warning" | "neutral" => (s === "標準" ? "success" : s === "偏高" || s === "偏低" ? "warning" : "neutral");

function BodyBars(props: { rows: BodyBar[] }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const [grown, setGrown] = useState<boolean>(false);
  useEffect(() => { const id = setTimeout(() => setGrown(true), 120); return () => clearTimeout(id); }, []);
  const g = grown || reduced;
  const txt = { fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: theme.font.family }}>
      {props.rows.map((b: BodyBar, i: number) => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 60px", color: theme.text.secondary, ...txt }}>{b.label}</div>
          <div style={{ flex: "1 1 80px", height: 10, borderRadius: 5, background: theme.fill.secondary, overflow: "hidden" }}>
            <div style={{ width: g ? `${Math.min(100, b.frac * 100)}%` : "0%", height: "100%", borderRadius: 5, background: b.color, transition: reduced ? "none" : `width 700ms ${EASE} ${i * 60}ms` }} />
          </div>
          <div style={{ flex: "0 0 auto", minWidth: 52, textAlign: "right", color: theme.text.primary, fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums", ...txt }}>{b.value}</div>
          {b.status && <Status tone={statusTone(b.status)}>{b.status}</Status>}
        </div>
      ))}
    </div>
  );
}

function Timeline(props: { rows: LogEntry[] }) {
  const theme = useGrokTheme();
  const cap = { fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", columnGap: 14, rowGap: 8, fontFamily: theme.font.family }}>
      {props.rows.map((e: LogEntry, i: number) => {
        const st = TYPE_STYLE[typeGroup(e.name)] ?? TYPE_STYLE["器械"];
        const z = zoneIndex(e.hrAvg);
        return (
          <Reveal key={`${e.date}-${e.start}-${e.name}`} delay={Math.min(i, 12) * 30}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, borderRadius: 16, border: `1px solid ${theme.border.subtle}`, background: theme.bg.elevated, padding: "8px 12px 8px 8px" }}>
              <div style={{ flex: "0 0 34px", width: 34, height: 34, borderRadius: 17, background: tint(st.color, theme.kind), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph id={st.glyph} color={st.color} size={18} />
              </div>
              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: "18px", fontWeight: theme.weight.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                <div style={{ color: theme.text.tertiary, ...cap }}>{`${dateLabel(e.date)} ${e.start}–${e.end}・${Math.round(e.minutes)} 分${e.km !== undefined ? `・${e.km.toFixed(1)} 公里` : ""}`}</div>
              </div>
              {z >= 0 && <Status tone={ZONES[z].tone}>{`♥ ${e.hrAvg}`}</Status>}
              <div style={{ textAlign: "right", flex: "0 0 auto", minWidth: 40 }}>
                <div style={{ color: theme.text.primary, fontSize: 17, lineHeight: "22px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{e.kcal > 0 ? Math.round(e.kcal) : "—"}</div>
                <div style={{ color: theme.text.tertiary, ...cap }}>kcal</div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

const GUIDE_GLYPH: Record<string, string> = { "Kettlebell": "kb", "健身器械": "machine", "彈力帶": "band", "有氧運動": "run", "徒手訓練": "body", "伸展": "stretch" };

function GuideTiles(props: { value: string; onPick: (g: string) => void }) {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: 8, fontFamily: theme.font.family }}>
      {GUIDE_GROUPS.map((g: string, i: number) => {
        const c = PASTEL[i % PASTEL.length];
        const on = props.value === g;
        const n = MOVES.filter((m: Move) => m[0] === g).length;
        return (
          <div key={g} role="button" onClick={() => props.onPick(g)} style={{ cursor: "pointer", borderRadius: 16, padding: "8px 10px", background: tint(c, theme.kind), border: `2px solid ${on ? c : "transparent"}`, display: "flex", alignItems: "center", gap: 8, transition: "border-color 250ms ease" }}>
            <Glyph id={GUIDE_GLYPH[g] ?? "body"} color={c} size={24} />
            <div style={{ minWidth: 0 }}>
              <div style={{ color: theme.text.primary, fontSize: 17, lineHeight: "20px", fontWeight: theme.weight.semibold }}>{n}</div>
              <div style={{ color: on ? theme.text.primary : theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight, fontWeight: on ? theme.weight.semibold : theme.weight.regular, whiteSpace: "nowrap" }}>{g}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KcalHero(props: { kcal: number; name: string; minutes: string }) {
  const theme = useGrokTheme();
  const c = PASTEL[3];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", borderRadius: 20, padding: "12px 16px", background: tint(c, theme.kind), fontFamily: theme.font.family }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: theme.bg.elevated, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Glyph id="flame" color={c} size={24} />
      </div>
      <div style={{ flex: "1 1 160px", minWidth: 0 }}>
        <div style={{ color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{props.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          <span style={{ color: theme.text.primary, fontSize: 34, lineHeight: "40px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{props.kcal}</span>
          <span style={{ color: theme.text.secondary, fontSize: theme.font.label.fontSize }}>{`kcal・${props.minutes} 分鐘`}</span>
        </div>
      </div>
    </div>
  );
}

// ===== 今日總覽 =====
const MUSCLE_ZH: Record<Muscle, string> = {
  chest: "胸", delts: "肩", biceps: "二頭肌", triceps: "三頭肌", forearms: "前臂", abs: "腹直肌", obliques: "腹斜肌",
  quads: "股四頭肌", adductors: "大腿內側", glutes: "臀部", hams: "膕繩肌", calves: "小腿", lats: "背闊肌", traps: "斜方肌", erector: "下背",
};

const CARDIO_ART: Record<string, string> = {
  run: "0|52 13 49 23 44 49 56 35 64 29 40 36 33 44 57 62 53 79 39 67 25 74|",
  walk: "0|48 12 47 22 46 50 52 36 54 50 42 36 39 50 53 68 56 87 42 69 36 87|",
  incline: "0|48 10 47 20 46 48 53 33 58 40 42 34 39 48 53 66 56 84 42 67 36 86|L 14 89 84 81;L 80 81 74 34;L 74 34 62 34",
};

const normName = (s: string): string => s.replace(/髋/g, "髖").replace(/^Kettlebell\s*/, "").trim();

const stripName = (s: string): string => normName(s).replace(/^彈力帶|^徒手/, "").replace(/機$/, "");

function moveFor(name: string): Move | undefined {
  const n = normName(name);
  const ns = stripName(name);
  let best: Move | undefined;
  let bestScore = -1;
  MOVES.forEach((m: Move) => {
    const ms = stripName(m[2]);
    if (ms === "") return;
    const exact = normName(m[2]) === n;
    if (!exact && ms !== ns && !ns.includes(ms)) return;
    let sc = (exact ? 100 : ms === ns ? 60 : 0) + ms.length;
    if (/Kettlebell|壺鈴/i.test(name) && m[0] === "Kettlebell") sc += 50;
    if (name.includes("彈力帶") && m[0] === "彈力帶") sc += 50;
    if (/機$/.test(n) && m[0] === "健身器械") sc += 30;
    if (!/Kettlebell|壺鈴/i.test(name) && m[0] === "Kettlebell") sc -= 20;
    if (!name.includes("彈力帶") && m[0] === "彈力帶") sc -= 10;
    if (sc > bestScore) { bestScore = sc; best = m; }
  });
  return best;
}

function dayArt(e: LogEntry): string {
  const m = moveFor(e.name);
  if (m) return m[6];
  const g = typeGroup(e.name);
  if (g === "步行") return e.name.includes("斜坡") || (e.detail ?? "").includes("斜度") ? CARDIO_ART.incline : CARDIO_ART.walk;
  if (g === "跑步") return CARDIO_ART.run;
  return "@m-chest";
}

function dayMuscles(e: LogEntry): { primary: Muscle[]; secondary: Muscle[] } {
  if (e.name.includes("橢圓")) return { primary: ["quads", "glutes", "hams"], secondary: ["calves", "chest", "lats", "delts"] };
  const m = moveFor(e.name);
  if (m) return muscleSplit(m[5]);
  if (typeGroup(e.name) !== "器械") return { primary: CALC_ITEMS[0].primary, secondary: CALC_ITEMS[0].secondary };
  return { primary: [], secondary: [] };
}

// ===== 下次建議（規則與 v1 相同）=====
const FOCUS_ORDER: string[] = ["上肢推", "上肢拉", "下肢", "核心", "有氧"];
const FOCUS_MUSCLES: Record<string, Muscle[]> = {
  "上肢推": ["chest", "delts", "triceps"],
  "上肢拉": ["lats", "traps", "biceps", "forearms"],
  "下肢": ["quads", "hams", "glutes", "calves", "adductors"],
  "核心": ["abs", "obliques", "erector"],
  "有氧": [],
};
const isCardio = (name: string): boolean => typeGroup(name) !== "器械" || /划艇|單車|橢圓/.test(name);
const EASY_RUN: Move = ["有氧運動", "", "輕鬆跑", "Easy Run", "", "股四頭肌、臀大肌、膕繩肌、小腿肌", CARDIO_ART.run];

interface FocusStat { focus: string; status: string; level: number; recovering: boolean; suggested: boolean }
interface PlanItem { name: string; art: string; note: string }
interface SwapItem { from: string; fromArt: string; to?: Move; toNote: string; reason: string }
interface Suggestion { focus: string; stats: FocusStat[]; targets: Muscle[]; rest: Muscle[]; keep: PlanItem[]; add: PlanItem[]; swap: SwapItem[]; cardio: boolean; reason: string }

const PART_ZH: Record<Muscle, string> = {
  chest: "胸部", delts: "肩部", triceps: "手臂", biceps: "手臂", forearms: "手臂", lats: "背部", traps: "背部", erector: "背部",
  abs: "核心", obliques: "核心", quads: "腿部", hams: "腿部", glutes: "腿部", calves: "腿部", adductors: "腿部",
};
const partsOf = (ms: Muscle[]): string => Array.from(new Set(ms.map((m: Muscle) => PART_ZH[m]))).join("、");
const CORE_SET: Muscle[] = ["abs", "obliques", "erector"];
const UPPER_SET: Muscle[] = ["chest", "delts", "triceps", "biceps", "forearms", "lats", "traps"];
const moveLabel = (m: Move): string => (m[0] === "Kettlebell" ? `Kettlebell ${m[2]}` : m[0] === "彈力帶" ? `彈力帶${m[2]}` : m[2]);
const regionOf = (ms: Muscle[]): string => (ms.some((x: Muscle) => UPPER_SET.includes(x)) ? "上" : ms.every((x: Muscle) => CORE_SET.includes(x)) ? "核" : "下");

function lastKg(m: Move): string | undefined {
  const hits = WORKOUT_LOG.filter((e: LogEntry) => moveFor(e.name) === m && /kg ×/.test(e.detail ?? ""))
    .sort((a: LogEntry, b: LogEntry) => (a.date + a.start < b.date + b.start ? 1 : -1));
  const mm = hits.length > 0 ? (hits[0].detail ?? "").match(/([\d.]+) kg ×/) : null;
  return mm ? mm[1] : undefined;
}

function loadHint(m: Move): string {
  const c = MOVE_CALC[MOVES.indexOf(m)] ?? "s4";
  if (m[0] === "有氧運動") return "20–30 分鐘・心率 Z2";
  if (c.startsWith("t")) return "3 組 × 30–45 秒";
  const kg = lastKg(m);
  if (kg) return `3 組 × 10・${kg} kg（上次）`;
  if (m[0] === "Kettlebell") return "3 組 × 10・輕鈴起步";
  if (m[0] === "彈力帶") return "3 組 × 12–15";
  return "3 組 × 10–12・輕重量起步";
}

function suggestNext(baseDate: string): Suggestion {
  const base = dayNum(baseDate);
  const dayWord = baseDate === londonToday() ? "今日" : "當日";
  const recent = WORKOUT_LOG.filter((e: LogEntry) => { const d = dayNum(e.date); return d <= base && d > base - 7; });
  const dayRows = WORKOUT_LOG.filter((e: LogEntry) => e.date === baseDate).sort((a: LogEntry, b: LogEntry) => (a.start < b.start ? -1 : 1));
  const rest: Muscle[] = [];
  recent.filter((e: LogEntry) => dayNum(e.date) >= base - 1).forEach((e: LogEntry) => {
    dayMuscles(e).primary.forEach((m: Muscle) => { if (!rest.includes(m)) rest.push(m); });
  });
  const restFromDay = rest.every((m: Muscle) => dayRows.some((d: LogEntry) => dayMuscles(d).primary.includes(m)));
  const wOf = (e: LogEntry): number => { const ago = base - dayNum(e.date); return ago <= 1 ? 1 : ago <= 3 ? 0.7 : 0.5; };
  const lastAgo = (hit: (e: LogEntry) => boolean): number => recent.reduce((a: number, e: LogEntry) => (hit(e) ? Math.min(a, base - dayNum(e.date)) : a), 99);
  const raw = FOCUS_ORDER.map((f: string): { focus: string; load: number; score: number; ago: number; recovering: boolean } => {
    let load = 0;
    if (f === "有氧") {
      recent.forEach((e: LogEntry) => { if (isCardio(e.name)) load += Math.min(1, e.minutes / 20) * wOf(e); });
      const lately = recent.filter((e: LogEntry) => isCardio(e.name) && base - dayNum(e.date) <= 1).reduce((a: number, e: LogEntry) => a + e.minutes, 0);
      return { focus: f, load, score: load + (lately >= 30 ? 1 : 0), ago: lastAgo((e: LogEntry) => isCardio(e.name)), recovering: lately >= 30 };
    }
    const g = FOCUS_MUSCLES[f];
    recent.forEach((e: LogEntry) => {
      const ms = dayMuscles(e);
      if (ms.primary.some((m: Muscle) => g.includes(m))) load += wOf(e);
      else if (ms.secondary.some((m: Muscle) => g.includes(m))) load += 0.5 * wOf(e);
    });
    const resting = g.filter((m: Muscle) => rest.includes(m)).length / g.length;
    return { focus: f, load, score: load + 2 * resting, ago: lastAgo((e: LogEntry) => dayMuscles(e).primary.some((m: Muscle) => g.includes(m))), recovering: resting > 0 };
  });
  const best = [...raw].sort((a: { score: number }, b: { score: number }) => a.score - b.score)[0];
  const focus = best.focus;
  const cardio = focus === "有氧";
  const statusOf = (ago: number): string => (ago === 0 ? `${dayWord}已練` : ago === 1 ? (dayWord === "今日" ? "昨日已練" : "前一日已練") : ago < 7 ? `${ago} 日未練` : "本週未練");
  const lvl = (l: number): number => (l >= 3 ? 3 : l >= 1.5 ? 2 : l > 0 ? 1 : 0);
  const group = FOCUS_MUSCLES[focus];
  let targets: Muscle[] = cardio ? ["quads", "glutes", "hams", "calves"] : group.filter((m: Muscle) => !rest.includes(m));
  if (targets.length === 0) targets = group;
  const focusAgo = cardio ? best.ago : lastAgo((e: LogEntry) => dayMuscles(e).primary.some((m: Muscle) => targets.includes(m)));
  const stats: FocusStat[] = raw.map((r: { focus: string; load: number; ago: number; recovering: boolean }) => ({
    focus: r.focus, status: statusOf(r.focus === focus ? focusAgo : r.ago), level: lvl(r.load), recovering: r.recovering && r.focus !== focus, suggested: r.focus === focus,
  }));
  const swapTargets: Muscle[] = cardio ? (Object.keys(MUSCLE_ZH) as Muscle[]).filter((m: Muscle) => !rest.includes(m)) : targets;

  const keep: PlanItem[] = [];
  const strength: LogEntry[] = [];
  const seen: string[] = [];
  dayRows.forEach((e: LogEntry) => {
    const k = normName(e.name);
    if (seen.includes(k)) return;
    seen.push(k);
    const p = dayMuscles(e).primary;
    if (isCardio(e.name)) keep.push({ name: e.name, art: dayArt(e), note: "心率 Z2 輕鬆做" });
    else if (p.length > 0 && p.every((m: Muscle) => CORE_SET.includes(m))) keep.push({ name: e.name, art: dayArt(e), note: "核心恢復快，可照做" });
    else strength.push(e);
  });
  if (keep.length === 0) {
    const counts: Record<string, { e: LogEntry; n: number }> = {};
    WORKOUT_LOG.filter((e: LogEntry) => { const d = dayNum(e.date); return d <= base && d > base - 14 && isCardio(e.name); })
      .forEach((e: LogEntry) => { const k = normName(e.name); counts[k] = { e, n: (counts[k]?.n ?? 0) + 1 }; });
    const top = Object.values(counts).sort((a: { n: number }, b: { n: number }) => b.n - a.n)[0];
    if (top) keep.push({ name: top.e.name, art: dayArt(top.e), note: "近期常做・心率 Z2" });
  }

  const dayMoves = dayRows.map((e: LogEntry) => moveFor(e.name));
  const used: Move[] = [];
  const fit = (m: Move): number => {
    const ms = muscleSplit(m[5]);
    let sc = 0;
    ms.primary.forEach((x: Muscle) => { sc += swapTargets.includes(x) ? 3 : 0.5; });
    ms.secondary.forEach((x: Muscle) => { sc += rest.includes(x) ? -0.5 : swapTargets.includes(x) ? 1 : 0; });
    return sc + (m[0] === "健身器械" ? 0.5 : 0);
  };
  const swap: SwapItem[] = strength.slice(0, 3).map((e: LogEntry): SwapItem => {
    const p = dayMuscles(e).primary;
    const reg = regionOf(p);
    const cand = MOVES.filter((m: Move) => {
      if (m[0] === "有氧運動" || m[0] === "伸展" || dayMoves.includes(m) || used.includes(m)) return false;
      const mp = muscleSplit(m[5]).primary;
      return mp.length > 0 && regionOf(mp) === reg && mp.every((x: Muscle) => !rest.includes(x)) && mp.some((x: Muscle) => swapTargets.includes(x));
    }).sort((a: Move, b: Move) => fit(b) - fit(a))[0];
    if (!cand) return { from: e.name, fromArt: dayArt(e), toNote: "休息", reason: `${partsOf(p)}需要恢復，下次先休息` };
    used.push(cand);
    return { from: e.name, fromArt: dayArt(e), to: cand, toNote: loadHint(cand), reason: `${partsOf(p)}${dayWord}已練，改練${partsOf(muscleSplit(cand[5]).primary)}` };
  });

  const add: PlanItem[] = [];
  if (cardio) {
    [EASY_RUN, ...MOVES.filter((m: Move) => m[0] === "有氧運動" && !dayMoves.includes(m))].slice(0, 2)
      .forEach((m: Move) => add.push({ name: moveLabel(m), art: m[6], note: m === EASY_RUN ? "25–35 分鐘・心率 Z2" : loadHint(m) }));
  } else {
    const ranked = MOVES.filter((m: Move) => m[0] !== "有氧運動" && m[0] !== "伸展" && !dayMoves.includes(m) && !used.includes(m)).map((m: Move) => {
      const ms = muscleSplit(m[5]);
      const tp = ms.primary.filter((x: Muscle) => targets.includes(x)).length;
      const ts = ms.secondary.filter((x: Muscle) => targets.includes(x)).length;
      const rp = ms.primary.filter((x: Muscle) => rest.includes(x)).length;
      return { m, tp, score: tp * 3 + ts - rp * 1.5 + (m[0] === "健身器械" ? 0.3 : 0) };
    }).filter((x: { tp: number; score: number }) => x.tp > 0 && x.score > 0).sort((a: { score: number }, b: { score: number }) => b.score - a.score);
    const first = ranked[0];
    if (first) {
      add.push({ name: moveLabel(first.m), art: first.m[6], note: loadHint(first.m) });
      const second = ranked.find((x: { m: Move }) => x.m[0] !== first.m[0]);
      if (second) add.push({ name: moveLabel(second.m), art: second.m[6], note: loadHint(second.m) });
    }
  }

  const restParts = partsOf(rest.filter((m: Muscle) => (!targets.includes(m) || cardio) && !CORE_SET.includes(m)));
  const focusParts = cardio ? "有氧" : partsOf(targets);
  const focusWord = focusAgo >= 7 ? "本週未練" : focusAgo >= 3 ? "已多日未練" : "練得較少";
  const reason = `${focusParts}${focusWord}${restParts ? `；${restParts}${restFromDay ? `${dayWord}已練` : "近兩日已練"}，需要休息` : ""}`;
  return { focus, stats, targets, rest, keep: keep.slice(0, 4), add, swap, cardio, reason };
}

function entryStat(e: LogEntry): string {
  const d = e.detail ?? "";
  const sets = d.match(/([\d.]+) kg × (\d+) 組 × (\d+) 次/);
  if (sets) return `${sets[1]} kg × ${sets[2]} × ${sets[3]}`;
  const row = d.match(/(\d+) 米，完成時間 ([\d:]+)/);
  if (row) return `${row[1]} m・${row[2]}`;
  const parts: string[] = [`${Math.round(e.minutes)} 分`];
  const inc = d.match(/斜度 ([\d.]+)%/);
  if (inc) parts.push(`斜度 ${inc[1]}%`);
  const lv = d.match(/阻力 (\d+) 級/);
  if (lv) parts.push(`阻力 ${lv[1]}`);
  if (e.km !== undefined) parts.push(`${e.km.toFixed(1)} 公里`);
  return parts.join("・");
}

type MuscleHits = Record<string, { p: number; s: number }>;

function muscleHits(list: LogEntry[]): MuscleHits {
  const out: MuscleHits = {};
  list.forEach((e: LogEntry) => {
    const ms = dayMuscles(e);
    ms.primary.forEach((m: Muscle) => { out[m] = out[m] ?? { p: 0, s: 0 }; out[m].p += 1; });
    ms.secondary.forEach((m: Muscle) => { out[m] = out[m] ?? { p: 0, s: 0 }; out[m].s += 1; });
  });
  return out;
}

const alphaHex = (a: number): string => {
  const v = Math.max(0, Math.min(255, Math.round(a * 255))).toString(16);
  return v.length < 2 ? `0${v}` : v;
};

function DayNav(props: { label: string; canPrev: boolean; canNext: boolean; onPrev: () => void; onNext: () => void }) {
  const theme = useGrokTheme();
  const btn = (on: boolean, txt: string, go: () => void, aria: string): ReactNode => (
    <div role="button" aria-label={aria} onClick={() => { if (on) go(); }} style={{ width: 44, height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: on ? "pointer" : "default", opacity: on ? 1 : 0.35, background: tint(PASTEL[1], theme.kind), color: theme.text.primary, fontSize: 18, lineHeight: "18px", userSelect: "none" }}>{txt}</div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: theme.font.family }}>
      {btn(props.canPrev, "‹", props.onPrev, "前一日")}
      <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight, fontWeight: theme.weight.semibold, minWidth: 110, textAlign: "center" }}>{props.label}</div>
      {btn(props.canNext, "›", props.onNext, "後一日")}
    </div>
  );
}

function DayStats(props: { items: { value: string; label: string }[] }) {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, fontFamily: theme.font.family }}>
      {props.items.map((s: { value: string; label: string }, i: number) => (
        <div key={s.label} style={{ borderRadius: 16, padding: "8px 10px", background: `${PASTEL[i % PASTEL.length]}${theme.kind === "dark" ? "4D" : "52"}`, minWidth: 0 }}>
          <div style={{ color: theme.text.primary, fontSize: 22, lineHeight: "28px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          <div style={{ color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function DayCards(props: { rows: LogEntry[] }) {
  const theme = useGrokTheme();
  const cap = { fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))", gap: 8, fontFamily: theme.font.family }}>
      {props.rows.map((e: LogEntry, i: number) => {
        const st = TYPE_STYLE[typeGroup(e.name)] ?? TYPE_STYLE["器械"];
        return (
          <Reveal key={`${e.date}-${e.start}-${e.name}`} delay={i * 45}>
            <div style={{ borderRadius: 16, padding: "8px 10px 10px", background: tint(st.color, theme.kind), display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
              <div style={{ borderRadius: 10, background: theme.bg.elevated, padding: 3 }}>
                <MoveArt art={dayArt(e)} label={e.name} h={64} />
              </div>
              <div style={{ marginTop: 4, color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: "18px", fontWeight: theme.weight.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{normName(e.name)}</div>
              <div style={{ color: theme.text.primary, ...cap }}>{entryStat(e)}</div>
              <div style={{ color: theme.text.tertiary, ...cap }}>{`${e.kcal > 0 ? Math.round(e.kcal) : "—"} kcal・${e.start}`}</div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

function DayMuscleMap(props: { hits: MuscleHits }) {
  const theme = useGrokTheme();
  const keys = Object.keys(props.hits);
  const max = Math.max(1, ...keys.map((k: string) => props.hits[k].p + props.hits[k].s));
  const shade = (m: Muscle): string => {
    const h = props.hits[m];
    if (!h || h.p + h.s === 0) return theme.border.default;
    const n = h.p + h.s;
    return h.p > 0 ? `${PASTEL[0]}${alphaHex(0.4 + (0.6 * n) / max)}` : `${PASTEL[1]}${alphaHex(0.35 + (0.35 * n) / max)}`;
  };
  const colors = { base: theme.fill.secondary, idle: theme.border.default, p: PASTEL[0], s: PASTEL[1], edge: theme.bg.base };
  const lbl = { fill: theme.text.tertiary, fontSize: 9, fontFamily: theme.font.family, textAnchor: "middle" as const };
  const cap = { color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  const ranked = (keys as Muscle[]).sort((a: Muscle, b: Muscle) => (props.hits[b].p * 10 + props.hits[b].s) - (props.hits[a].p * 10 + props.hits[a].s));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch", fontFamily: theme.font.family }}>
      <svg viewBox="0 0 220 214" role="img" aria-label="當日鍛鍊肌群" style={{ width: "100%", maxWidth: 300, maxHeight: 280, display: "block", margin: "0 auto" }}>
        {figure(FRONT, [], [], 5, colors, shade)}
        {figure(BACK, [], [], 115, colors, shade)}
        <text x={55} y={208} {...lbl}>正面</text>
        <text x={165} y={208} {...lbl}>背面</text>
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <span style={cap}>主要肌群</span>
        <span style={{ width: 56, height: 9, borderRadius: 5, background: `linear-gradient(90deg, ${PASTEL[0]}66, ${PASTEL[0]})`, display: "inline-block" }} />
        <span style={cap}>{`淡至深：1 至 ${max} 項`}</span>
        <span style={{ width: 9, height: 9, borderRadius: 2, background: `${PASTEL[1]}99`, display: "inline-block", marginLeft: 6 }} />
        <span style={cap}>次要肌群</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
        {ranked.map((m: Muscle) => (
          <span key={m} style={{ padding: "2px 9px", borderRadius: theme.radius.full, background: props.hits[m].p > 0 ? tint(PASTEL[0], theme.kind) : tint(PASTEL[1], theme.kind), color: theme.text.primary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>
            {`${MUSCLE_ZH[m]} ${props.hits[m].p + props.hits[m].s}`}
          </span>
        ))}
      </div>
    </div>
  );
}

function NextCard(props: { s: Suggestion; forDate: string }) {
  const theme = useGrokTheme();
  const s = props.s;
  const G = PASTEL[2];
  const R = PASTEL[5];
  const dark = theme.kind === "dark";
  const cap = { fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight };
  const shade = (m: Muscle): string => (s.targets.includes(m) ? G : s.rest.includes(m) ? `${R}88` : theme.border.default);
  const colors = { base: theme.fill.secondary, idle: theme.border.default, p: G, s: R, edge: theme.bg.base };
  const lbl = { fill: theme.text.tertiary, fontSize: 9, fontFamily: theme.font.family, textAnchor: "middle" as const };
  const dot = (c: string, sq?: boolean): ReactNode => <span style={{ width: sq ? 10 : 8, height: sq ? 10 : 8, borderRadius: sq ? 2 : 4, background: c, display: "inline-block" }} />;
  const head = (txt: string, c: string): ReactNode => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
      {dot(c)}
      <span style={{ color: theme.text.primary, fontWeight: theme.weight.semibold, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight }}>{txt}</span>
    </div>
  );
  const row = (key: string, art: string, title: string, sub: string, mark?: string): ReactNode => (
    <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 14, padding: "3px 8px 3px 3px", background: theme.bg.elevated, minWidth: 0 }}>
      <div style={{ width: 40, flex: "0 0 40px", borderRadius: 10, overflow: "hidden" }}><MoveArt art={art} label={title} h={40} /></div>
      <div style={{ minWidth: 0, flex: "1 1 auto" }}>
        <div style={{ color: theme.text.primary, fontWeight: theme.weight.semibold, fontSize: theme.font.label.fontSize, lineHeight: "18px", wordBreak: "break-word" }}>{title}</div>
        <div style={{ color: theme.text.secondary, ...cap }}>{sub}</div>
      </div>
      {mark && <span style={{ color: dark ? G : INK, fontWeight: theme.weight.semibold, fontSize: 16, flex: "0 0 auto" }}>{mark}</span>}
    </div>
  );
  return (
    <div style={{ flex: "1 1 auto", borderRadius: 24, padding: "14px 14px 16px", background: `linear-gradient(160deg, ${G}${dark ? "44" : "40"}, ${G}${dark ? "14" : "10"})`, border: `1px solid ${G}66`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 14, alignItems: "start", fontFamily: theme.font.family }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "3px 12px", borderRadius: theme.radius.full, background: G, color: INK, fontWeight: theme.weight.semibold, ...cap }}>建議</span>
          <span style={{ color: theme.text.primary, fontSize: 20, lineHeight: "26px", fontWeight: theme.weight.semibold }}>{`下次：${s.focus}`}</span>
          <span style={{ color: theme.text.secondary, ...cap }}>{props.forDate}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
          {s.stats.map((f: FocusStat) => {
            const bg = f.suggested ? G : f.recovering ? `${R}${dark ? "55" : "4D"}` : theme.bg.elevated;
            const fg = f.suggested ? INK : theme.text.primary;
            return (
              <div key={f.focus} style={{ borderRadius: 12, padding: "5px 2px", textAlign: "center", background: bg, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ color: fg, fontWeight: theme.weight.semibold, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight, whiteSpace: "nowrap" }}>{f.focus}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3].map((k: number) => (
                    <span key={k} style={{ width: 6, height: 6, borderRadius: 3, background: k <= f.level ? (f.suggested ? INK : theme.text.secondary) : (f.suggested ? `${INK}33` : theme.border.default), display: "inline-block" }} />
                  ))}
                </div>
                <div style={{ color: f.suggested ? INK : theme.text.secondary, fontSize: 11, lineHeight: "14px", whiteSpace: "nowrap" }}>{f.status}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", color: theme.text.tertiary, ...cap }}>
          <span>近 7 日訓練量：圓點越多，訓練量越多</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{dot(G)}建議</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{dot(R)}恢復中</span>
        </div>
        <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight }}>{s.reason}</div>
        <svg viewBox="0 0 220 214" role="img" aria-label="建議訓練肌群" style={{ width: "100%", maxWidth: 260, maxHeight: 230, display: "block", margin: "0 auto" }}>
          {figure(FRONT, [], [], 5, colors, shade)}
          {figure(BACK, [], [], 115, colors, shade)}
          <text x={55} y={208} {...lbl}>正面</text>
          <text x={165} y={208} {...lbl}>背面</text>
        </svg>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", color: theme.text.secondary, ...cap }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{dot(G, true)}建議訓練</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{dot(`${R}88`, true)}休息中</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        {s.keep.length > 0 && head("繼續做", theme.text.secondary)}
        {s.keep.map((k: PlanItem) => row(`k-${k.name}`, k.art, k.name, k.note, "✓"))}
        {s.add.length > 0 && head("建議加入", G)}
        {s.add.map((k: PlanItem) => row(`a-${k.name}`, k.art, k.name, k.note, "+"))}
        {s.swap.length > 0 && head("建議取代", R)}
        {s.swap.map((w: SwapItem) => row(`s-${w.from}`, w.to ? w.to[6] : w.fromArt, `${w.from} → ${w.to ? moveLabel(w.to) : "休息"}`, w.reason))}
        {s.cardio && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 14, padding: "8px 10px", background: theme.bg.elevated, marginTop: 4 }}>
            <Glyph id="run" color={G} size={22} />
            <span style={{ color: theme.text.primary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>輕鬆跑：保持心率 Z2（120–134 次／分），配速約 7:45–8:15／公里，或跑走交替</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== 一日重播（stageshow：每項按記錄時間落位，總數在落位後才更新）=====
function Replay(props: { date: string; run: number }) {
  const theme = useGrokTheme();
  const reduced = useReduced();
  const rows = WORKOUT_LOG.filter((r: LogEntry) => r.date === props.date).sort((a: LogEntry, b: LogEntry) => (a.start === b.start ? a.name.localeCompare(b.name) : a.start < b.start ? -1 : 1));
  const n = rows.length;
  const [k, setK] = useState<number>(0);
  useEffect(() => {
    if (reduced) { setK(n); return; }
    setK(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setK(i); if (i >= n) clearInterval(id); }, 650);
    return () => clearInterval(id);
  }, [props.date, props.run, n, reduced]);
  const toM = (t: string): number => parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3, 5), 10);
  const t0 = Math.min(...rows.map((r: LogEntry) => toM(r.start)));
  const t1 = Math.max(...rows.map((r: LogEntry) => toM(r.start) + r.minutes));
  const span = Math.max(10, t1 - t0);
  const shown = rows.slice(0, k);
  const min = shown.reduce((a: number, r: LogEntry) => a + r.minutes, 0);
  const kcal = shown.reduce((a: number, r: LogEntry) => a + r.kcal, 0);
  const unknown = shown.some((r: LogEntry) => r.kcal <= 0);
  const done = k >= n;
  const fmtT = (m: number): string => `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, "0")}`;
  const cap = { fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight, color: theme.text.tertiary };
  const big = { fontSize: 32, lineHeight: "38px", fontWeight: theme.weight.semibold, color: theme.text.primary, fontVariantNumeric: "tabular-nums" as const };
  return (
    <div style={{ fontFamily: theme.font.family, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 26, alignItems: "baseline" }}>
        <div><span style={big}>{shown.length}</span><span style={{ ...cap, marginLeft: 6 }}>{`／${n} 項`}</span></div>
        <div><span style={big}>{Math.round(min)}</span><span style={{ ...cap, marginLeft: 6 }}>分鐘</span></div>
        <div><span style={big}>{Math.round(kcal)}</span><span style={{ ...cap, marginLeft: 6 }}>{unknown ? "kcal（部分未知）" : "kcal"}</span></div>
      </div>
      <Scroller h={380}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {rows.map((r: LogEntry, i: number) => {
            const on = i < k;
            const st = TYPE_STYLE[typeGroup(r.name)] ?? TYPE_STYLE["器械"];
            const left = ((toM(r.start) - t0) / span) * 100;
            const w = Math.max(1.5, (r.minutes / span) * 100);
            return (
              <div key={`${r.start}-${r.name}`} style={{ display: "flex", alignItems: "center", gap: 10, opacity: on ? 1 : 0.18, transform: on ? "none" : "translateY(6px)", transition: reduced ? "none" : `opacity 420ms ease, transform 420ms ${EASE}` }}>
                <div style={{ flex: "0 0 36%", minWidth: 0 }}>
                  <div style={{ color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: "18px", fontWeight: theme.weight.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{normName(r.name)}</div>
                  <div style={cap}>{`${r.start}・${r.source.split("（")[0]}`}</div>
                </div>
                <div style={{ flex: "1 1 auto", position: "relative", height: 12, borderRadius: 6, background: theme.fill.secondary }}>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: `${left}%`, width: on ? `${w}%` : "0%", borderRadius: 6, background: st.color, transition: reduced ? "none" : `width 520ms ${EASE}` }} />
                </div>
                <div style={{ flex: "0 0 48px", textAlign: "right", color: theme.text.primary, fontSize: theme.font.label.fontSize, fontVariantNumeric: "tabular-nums" }}>{r.kcal > 0 ? `${Math.round(r.kcal)}` : "—"}</div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "calc(36% + 10px)", marginRight: 58, ...cap }}>
            <span>{fmtT(t0)}</span>
            <span>{fmtT(t1)}</span>
          </div>
        </div>
      </Scroller>
      <div style={{ opacity: done ? 1 : 0, transform: done ? "none" : "translateY(8px)", transition: reduced ? "none" : `opacity 500ms ease 250ms, transform 500ms ${EASE} 250ms`, borderTop: `1px solid ${theme.border.default}`, paddingTop: 10, color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight }}>
        {`一次過總結：${n} 項，共 ${Math.round(min)} 分鐘，約 ${Math.round(kcal)} kcal${unknown ? "（有一項熱量未能讀取）" : ""}。`}
      </div>
    </div>
  );
}

function TabBand(props: { color: string; glyph: string; title: string; sub: string; stat: string }) {
  const theme = useGrokTheme();
  const dark = theme.kind === "dark";
  const c = props.color;
  return (
    <Reveal>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, padding: "12px 18px", background: `linear-gradient(135deg, ${c}${dark ? "66" : "77"}, ${c}${dark ? "22" : "26"})`, fontFamily: theme.font.family, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ position: "absolute", right: -16, top: -26, width: 96, height: 96, borderRadius: 48, background: `${c}${dark ? "33" : "44"}` }} />
        <Glyph id={props.glyph} color={dark ? theme.text.primary : INK} size={28} />
        <div style={{ position: "relative", minWidth: 0 }}>
          <div style={{ color: theme.text.primary, fontSize: 22, lineHeight: "28px", fontWeight: theme.weight.semibold, letterSpacing: "-0.01em" }}>{props.title}</div>
          {props.sub !== "" && <div style={{ color: theme.text.secondary, fontSize: theme.font.caption.fontSize, lineHeight: theme.font.caption.lineHeight }}>{props.sub}</div>}
        </div>
        {props.stat !== "" && <div style={{ position: "relative", marginLeft: "auto", padding: "4px 12px", borderRadius: theme.radius.full, background: theme.bg.elevated, color: theme.text.primary, fontSize: theme.font.label.fontSize, lineHeight: theme.font.label.lineHeight, fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums" }}>{props.stat}</div>}
      </div>
    </Reveal>
  );
}

function TabPanel(props: { color: string; children?: ReactNode }) {
  const theme = useGrokTheme();
  const dark = theme.kind === "dark";
  return (
    <Reveal delay={60}>
      <div style={{ borderRadius: 26, padding: "12px 12px 14px", background: `${props.color}${dark ? "1C" : "14"}`, display: "flex", flexDirection: "column", gap: 16 }}>
        {props.children}
      </div>
    </Reveal>
  );
}

const TABS: { id: string; label: string; glyph: string; color: string }[] = [
  { id: "today", label: "今日", glyph: "flame", color: PASTEL[5] },
  { id: "week", label: "本週", glyph: "calendar", color: PASTEL[1] },
  { id: "log", label: "紀錄", glyph: "list", color: PASTEL[2] },
  { id: "body", label: "身體", glyph: "scale", color: PASTEL[4] },
  { id: "guide", label: "動作圖鑑", glyph: "book", color: PASTEL[3] },
];

function BandChip(props: { color: string; sub: string; stat: string }) {
  const theme = useGrokTheme();
  return (
    <div style={{ flex: "1 1 240px", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, fontFamily: theme.font.family }}>
      {props.sub !== "" && <span style={{ color: theme.text.tertiary, fontSize: 13, lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{props.sub}</span>}
      {props.stat !== "" && <span style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: theme.radius.full, background: tint(props.color, theme.kind), color: theme.text.primary, fontSize: 14, lineHeight: "20px", fontWeight: theme.weight.semibold, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{props.stat}</span>}
    </div>
  );
}

// ===== 頁尾署名：minny.app（m 字標原樣使用，不作修改）=====
const MINNY_M_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 258" role="img" aria-label="m"><path fill="#9acba4" fill-rule="evenodd" d="M347.69,29.00 C341.57,19.22 336.28,14.14 328.00,9.31 C319.72,4.49 305.50,1.23 298.00,0.06 C290.50,-1.10 289.17,0.27 283.00,2.31 C276.83,4.35 271.33,4.54 261.00,12.31 C250.67,20.08 229.17,42.22 221.00,48.94 C212.83,55.66 214.83,52.33 212.00,52.62 C209.17,52.92 208.67,53.91 204.00,50.69 C199.33,47.47 189.83,37.08 184.00,33.31 C178.17,29.54 175.00,28.77 169.00,28.06 C163.00,27.35 155.17,27.12 148.00,29.06 C140.83,31.00 131.67,37.70 126.00,39.69 C120.33,41.68 119.33,43.56 114.00,41.00 C108.67,38.44 100.83,28.76 94.00,24.31 C87.17,19.86 78.67,16.19 73.00,14.31 C67.33,12.44 65.50,11.90 60.00,13.06 C54.50,14.23 47.45,15.32 40.00,21.31 C32.55,27.30 21.14,38.89 15.31,49.00 C9.49,59.11 7.60,59.50 5.06,82.00 C2.52,104.50 0.02,162.67 0.06,184.00 C0.10,205.33 2.60,201.83 5.31,210.00 C8.02,218.17 10.86,226.29 16.31,233.00 C21.76,239.71 31.05,246.43 38.00,250.25 C44.95,254.07 50.33,254.82 58.00,255.94 C65.67,257.05 75.67,258.44 84.00,256.94 C92.33,255.44 102.29,250.59 108.00,246.94 C113.71,243.28 115.59,239.82 118.25,235.00 C120.91,230.18 123.75,230.33 123.94,218.00 C124.12,205.67 119.65,173.67 119.38,161.00 C119.10,148.33 120.53,147.45 122.31,142.00 C124.09,136.55 126.45,131.80 130.06,128.31 C133.68,124.82 139.51,121.73 144.00,121.06 C148.49,120.40 152.79,121.16 157.00,124.31 C161.21,127.47 166.43,134.39 169.25,140.00 C172.07,145.61 172.97,149.33 173.94,158.00 C174.91,166.67 173.54,184.00 175.06,192.00 C176.58,200.00 179.24,202.34 183.06,206.00 C186.89,209.66 192.18,212.90 198.00,213.94 C203.82,214.98 212.68,214.07 218.00,212.25 C223.32,210.43 226.32,207.38 229.94,203.00 C233.55,198.62 235.39,199.17 239.69,186.00 C243.99,172.83 250.36,136.67 255.75,124.00 C261.14,111.33 267.30,111.33 272.00,110.00 C276.70,108.67 280.78,112.50 283.94,116.00 C287.09,119.50 289.43,124.00 290.94,131.00 C292.45,138.00 293.49,145.33 293.00,158.00 C292.51,170.67 287.45,195.00 288.00,207.00 C288.55,219.00 292.81,224.89 296.31,230.00 C299.81,235.11 304.05,236.12 309.00,237.69 C313.95,239.25 317.67,240.38 326.00,239.38 C334.33,238.38 350.72,235.92 359.00,231.69 C367.28,227.46 372.35,223.11 375.69,214.00 C379.02,204.89 379.46,195.17 379.00,177.00 C378.54,158.83 375.32,123.17 372.94,105.00 C370.55,86.83 368.90,80.67 364.69,68.00 C360.48,55.33 353.80,38.78 347.69,29.00 Z"/><g id="eyes"><ellipse cx="110.64" cy="97.70" rx="16.79" ry="19.08" fill="#38312d"/><ellipse cx="106.22" cy="91.44" rx="3.05" ry="3.05" fill="#ffffff"/><ellipse cx="225.10" cy="92.36" rx="16.02" ry="19.08" fill="#38312d"/><ellipse cx="220.37" cy="85.64" rx="3.05" ry="3.05" fill="#ffffff"/></g></svg>`;
function MinnyFooter() {
  const theme = useGrokTheme();
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 6, fontFamily: theme.font.family }}>
      <a href="https://minny.app" target="_blank" rel="noopener noreferrer" aria-label="minny.app" style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 14px", borderRadius: theme.radius.full, color: theme.text.tertiary, textDecoration: "none", fontSize: 13, lineHeight: "18px" }}>
        <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(MINNY_M_SVG)}`} alt="" width={18} height={12} style={{ display: "block", width: 18, height: "auto" }} />
        <span>minny.app</span>
      </a>
    </div>
  );
}

function TabBar(props: { value: string; onPick: (id: string) => void; aside?: ReactNode }) {
  const theme = useGrokTheme();
  const vp = useVp();
  const wide = vp.bp === "land" || vp.bp === "desk";
  const i = Math.max(0, TABS.findIndex((t: { id: string }) => t.id === props.value));
  const cur = TABS[i];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: theme.bg.base, padding: "4px 0 8px", fontFamily: theme.font.family, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div role="tablist" style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${TABS.length}, minmax(0, 1fr))`, gap: 4, padding: 4, borderRadius: 18, background: theme.fill.secondary, flex: wide ? "0 1 660px" : "1 1 100%", minWidth: 0 }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 4, bottom: 4, left: `calc(4px + ${i} * ((100% - 8px + 4px) / ${TABS.length}))`, width: `calc((100% - 8px - ${(TABS.length - 1) * 4}px) / ${TABS.length})`, borderRadius: 14, background: cur.color, boxShadow: `0 1px 4px ${theme.border.default}`, transition: `left 420ms ${EASE}, background 300ms ease` }} />
        {TABS.map((t: { id: string; label: string; glyph: string; color: string }) => {
          const on = props.value === t.id;
          return (
            <div key={t.id} role="tab" aria-selected={on} onClick={() => props.onPick(t.id)} style={{ position: "relative", cursor: "pointer", borderRadius: 14, padding: wide ? "0 6px" : "6px 2px 4px", minHeight: wide ? 46 : 52, boxSizing: "border-box", minWidth: 0, display: "flex", flexDirection: wide ? "row" : "column", alignItems: "center", justifyContent: "center", gap: wide ? 8 : 2 }}>
              <Glyph id={t.glyph} color={on ? INK : t.color} size={wide ? 20 : 20} />
              <span style={{ color: on ? INK : theme.text.secondary, fontSize: wide ? 15 : 13, lineHeight: wide ? "20px" : "18px", fontWeight: on ? theme.weight.semibold : theme.weight.regular, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%", transition: "color 300ms ease" }}>{t.label}</span>
            </div>
          );
        })}
      </div>
      {wide && props.aside}
    </div>
  );
}

export default function App() {
  const vp = useVp();
  const fit = vp.fit;
  const [top, setTop] = useState<number>(150);
  const [calcKey, setCalcKey] = useState<string>("m0");
  const [speed, setSpeed] = useState<number>(9);
  const [incline, setIncline] = useState<number>(1);
  const [km, setKm] = useState<number>(5);
  const [mins, setMins] = useState<number>(30);
  const [intensity, setIntensity] = useState<Intensity>("中等");
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(12);
  const [rowInput, setRowInput] = useState<string>("time");
  const [splitMin, setSplitMin] = useState<number>(3);
  const [splitSec, setSplitSec] = useState<number>(10);
  const [calcQ, setCalcQ] = useState<string>("");
  const [load, setLoad] = useState<string>("");
  const [rowMode, setRowMode] = useState<string>("2000");
  const [rowDist, setRowDist] = useState<number>(2000);
  const [rowMin, setRowMin] = useState<number>(8);
  const [rowSec, setRowSec] = useState<number>(15);
  const [level, setLevel] = useState<number>(8);
  const [bikeKm, setBikeKm] = useState<number>(10);
  const [bikeW, setBikeW] = useState<string>("");
  const [rpm, setRpm] = useState<string>("");
  const [histFilter, setHistFilter] = useState<string>("全部");
  const [logView, setLogView] = useState<string>("list");
  const [replayDay, setReplayDay] = useState<string>("");
  const [replayRun, setReplayRun] = useState<number>(0);
  const [monthMetric, setMonthMetric] = useState<string>("kcal");
  const [guideGroup, setGuideGroup] = useState<string>(GUIDE_GROUPS[0]);
  const [guideSub, setGuideSub] = useState<string>(guideSubs(GUIDE_GROUPS[0])[0] ?? "全部");
  const [dayPick, setDayPick] = useState<number>(0);
  const [tab, setTab] = useState<string>("today");
  const [openMove, setOpenMove] = useState<number>(-1);

  const ex = CALC_ITEMS.find((c: CalcItem) => c.key === calcKey) ?? CALC_ITEMS[2];
  const pickCalc = (key: string) => {
    setCalcKey(key);
    if (key === "walk-in") { setSpeed(4.5); setIncline(10); }
    else if (key === "run-in") { setSpeed(9); setIncline(1); }
    else if (key.startsWith("m")) {
      const mv = MOVES[parseInt(key.slice(1), 10)];
      const lk = mv && mv[0] !== "有氧運動" ? lastKg(mv) : undefined;
      setLoad(lk ?? "");
    }
  };
  const calcQn = calcQ.trim().toLowerCase();
  const calcOpts = CALC_ITEMS
    .filter((c: CalcItem) => (calcQn ? c.label.toLowerCase().includes(calcQn) : calcCat(c) === calcCat(ex)))
    .map((c: CalcItem) => ({ value: c.key, label: calcQn ? c.label : (c.label.split("｜")[1] ?? c.label) }));
  const unit = ex.timed ? "秒" : "次";
  const kg = BODY_WEIGHT_KG;
  const touch = () => undefined;

  let kcal = 0;
  let duration = mins;
  const extra: { label: string; value: string }[] = [];

  if (ex.kind === "treadmill") {
    kcal = (acsmVO2(speed, incline) * kg / 1000) * 5 * mins;
    const dist = (speed * mins) / 60;
    extra.push({ label: "距離", value: `${fmt1(dist)} 公里` });
    extra.push({ label: "配速", value: `${paceText(60 / speed)}／公里` });
  } else if (ex.kind === "outdoor") {
    const kmh = mins > 0 ? km / (mins / 60) : 0;
    kcal = kmh > 0 ? (acsmVO2(kmh, 0) * kg / 1000) * 5 * mins : 0;
    extra.push({ label: "平均速度", value: `${fmt1(kmh)} 公里／小時` });
    extra.push({ label: "配速", value: `${paceText(mins / km)}／公里` });
  } else if (ex.kind === "rower") {
    const split = splitMin * 60 + splitSec;
    const secs = rowInput === "split" ? mins * 60 : rowMin * 60 + rowSec;
    const dist = rowInput === "split" ? (split > 0 ? Math.round((secs / split) * 500) : 0) : rowDist;
    duration = secs / 60;
    const p = dist > 0 && secs > 0 ? secs / dist : 0;
    const watts = p > 0 ? 2.8 / Math.pow(p, 3) : 0;
    kcal = p > 0 ? (watts * 3.44 + 300) * (secs / 3600) : 0;
    extra.push({ label: "距離", value: `${dist} 米` });
    extra.push({ label: "每 500 米", value: clock(p * 500, true) });
    extra.push({ label: "平均功率", value: `${Math.round(watts)} 瓦` });
  } else if (ex.kind === "bike") {
    const w = parseFloat(bikeW);
    const met = [4.8, 6.8, 8.8][level <= 7 ? 0 : level <= 14 ? 1 : 2];
    kcal = w > 0 ? (w * mins * 60) / 1000 : (met * 3.5 * kg / 200) * mins;
    extra.push({ label: "平均速度", value: `${fmt1(mins > 0 ? bikeKm / (mins / 60) : 0)} 公里／小時` });
    extra.push(w > 0 ? { label: "平均功率", value: `${Math.round(w)} 瓦` } : { label: "代謝當量", value: `${met}` });
    const r = parseFloat(rpm);
    if (r > 0) extra.push({ label: "踏頻", value: `每分鐘 ${Math.round(r)} 轉` });
  } else if (ex.kind === "cardio") {
    const met = cardioMets(ex)[INTENSITIES.indexOf(intensity)];
    kcal = (met * 3.5 * kg / 200) * mins;
    extra.push({ label: "代謝當量", value: `${met}` });
  } else {
    const ii = Math.max(0, INTENSITIES.indexOf(intensity));
    const restS = [90, 60, 45][ii];
    const met = ex.name.startsWith("高抬腿") && ii === 0 ? 4.0 : ex.met * [0.85, 1, 1.2][ii];
    const workSec = ex.timed ? reps : reps * 3;
    duration = (sets * (workSec + restS)) / 60;
    kcal = (met * 3.5 * kg / 200) * duration;
    if (load.trim()) extra.push({ label: "負重", value: `${load.trim()} kg` });
    extra.push({ label: "代謝當量", value: fmt1(met) });
    extra.push({ label: "組間休息", value: `${restS} 秒` });
  }
  const kcalR = Math.round(kcal);

  let controls: ReactNode = null;
  if (ex.kind === "treadmill") {
    controls = (
      <Stack gap={8}>
        <Stepper label="速度（公里／小時）" value={speed} step={0.5} min={1} max={25} onChange={(v: number) => { setSpeed(v); touch(); }} />
        <Stepper label="斜度（%）" value={incline} step={0.5} min={0} max={15} onChange={(v: number) => { setIncline(v); touch(); }} />
        <Stepper label="時間（分）" value={mins} step={1} min={1} max={240} onChange={(v: number) => { setMins(v); touch(); }} />
      </Stack>
    );
  } else if (ex.kind === "outdoor") {
    controls = (
      <Stack gap={8}>
        <Stepper label="距離（公里）" value={km} step={0.5} min={0.5} max={60} onChange={(v: number) => { setKm(v); touch(); }} />
        <Stepper label="時間（分）" value={mins} step={1} min={1} max={400} onChange={(v: number) => { setMins(v); touch(); }} />
      </Stack>
    );
  } else if (ex.kind === "rower") {
    controls = (
      <Stack gap={8}>
        <Segmented options={[{ value: "time", label: "距離及完成時間" }, { value: "split", label: "500 米配速" }]} value={rowInput} onChange={(v: string) => { setRowInput(v); touch(); }} />
        {rowInput === "time" && <Segmented options={ROW_PRESETS} value={rowMode} onChange={(v: string) => { setRowMode(v); if (v !== "custom") setRowDist(parseInt(v, 10)); touch(); }} />}
        {rowInput === "time" && <Stepper label="目標（米）" value={rowDist} step={100} min={100} max={42195} onChange={(v: number) => { setRowDist(v); setRowMode(ROW_PRESETS.some((o: { value: string; label: string }) => o.value === String(v)) ? String(v) : "custom"); touch(); }} />}
        {rowInput === "time" && <Stepper label="完成時間（分）" value={rowMin} step={1} min={0} max={300} onChange={(v: number) => { setRowMin(v); touch(); }} />}
        {rowInput === "time" && <Stepper label="完成時間（秒）" value={rowSec} step={1} min={0} max={59} onChange={(v: number) => { setRowSec(v); touch(); }} />}
        {rowInput === "split" && <Stepper label="每 500 米（分）" value={splitMin} step={1} min={1} max={6} onChange={(v: number) => { setSplitMin(v); touch(); }} />}
        {rowInput === "split" && <Stepper label="每 500 米（秒）" value={splitSec} step={1} min={0} max={59} onChange={(v: number) => { setSplitSec(v); touch(); }} />}
        {rowInput === "split" && <Stepper label="時間（分）" value={mins} step={1} min={1} max={240} onChange={(v: number) => { setMins(v); touch(); }} />}
      </Stack>
    );
  } else if (ex.kind === "bike") {
    controls = (
      <Stack gap={8}>
        <Stepper label="阻力（級）" value={level} step={1} min={1} max={20} onChange={(v: number) => { setLevel(v); touch(); }} />
        <Stepper label="距離（公里）" value={bikeKm} step={0.5} min={0} max={200} onChange={(v: number) => { setBikeKm(v); touch(); }} />
        <Stepper label="時間（分）" value={mins} step={1} min={1} max={300} onChange={(v: number) => { setMins(v); touch(); }} />
        <Input label="平均功率（瓦，可略）" type="number" value={bikeW} onChange={(v: string) => { setBikeW(v); touch(); }} placeholder="150" />
        <Input label="踏頻（每分鐘轉數，可略）" type="number" value={rpm} onChange={(v: string) => { setRpm(v); touch(); }} placeholder="85" />
      </Stack>
    );
  } else if (ex.kind === "cardio") {
    controls = (
      <Stack gap={8}>
        <Stepper label="時間（分）" value={mins} step={1} min={1} max={240} onChange={(v: number) => { setMins(v); touch(); }} />
        <Segmented options={INTENSITIES} value={intensity} onChange={(v: Intensity) => { setIntensity(v); touch(); }} />
      </Stack>
    );
  } else {
    controls = (
      <Stack gap={8}>
        <Stepper label="組數" value={sets} step={1} min={1} max={20} onChange={(v: number) => { setSets(v); touch(); }} />
        <Stepper label={`每組（${unit}）`} value={reps} step={ex.timed ? 10 : 1} min={1} max={600} onChange={(v: number) => { setReps(v); touch(); }} />
        <Input label="重量 kg（可略）" type="number" value={load} onChange={(v: string) => { setLoad(v); touch(); }} placeholder="16" />
        <Segmented options={INTENSITIES} value={intensity} onChange={(v: Intensity) => { setIntensity(v); touch(); }} />
      </Stack>
    );
  }

  // ===== 紀錄統計 =====
  const today = londonToday();
  const todayN = dayNum(today);
  const weekStart = mondayOf(todayN);
  const monthKey = today.slice(0, 7);
  const logSorted = [...WORKOUT_LOG].sort((a: LogEntry, b: LogEntry) => (a.date + a.start < b.date + b.start ? 1 : -1));
  const weekT = sumLog(WORKOUT_LOG.filter((e: LogEntry) => { const d = dayNum(e.date); return d >= weekStart && d <= todayN; }));
  const monthT = sumLog(WORKOUT_LOG.filter((e: LogEntry) => e.date.startsWith(monthKey)));
  const dayT = sumLog(WORKOUT_LOG.filter((e: LogEntry) => e.date === today));
  const monthName = `${parseInt(monthKey.slice(5, 7), 10)}月`;
  const heroCards: HeroCard[] = [
    {
      kicker: "本週運動", value: `${Math.round(weekT.min)}`, unit: "分鐘", color: PASTEL[0], glyph: "run",
      detail: `${weekT.n} 次・${weekT.km.toFixed(1)} 公里・今日 ${dayT.n} 次`,
      stats: [{ value: `${Math.round(weekT.kcal)}`, label: "本週 kcal" }, { value: `${Math.round(dayT.kcal)}`, label: "今日 kcal" }],
    },
    {
      kicker: `${monthName}累計`, value: `${Math.round(monthT.min)}`, unit: "分鐘", color: PASTEL[1], glyph: "calendar",
      detail: `${monthT.n} 次・${monthT.km.toFixed(1)} 公里`,
      stats: [{ value: `${Math.round(monthT.kcal)}`, label: `${monthName} kcal` }, { value: `${monthT.n}`, label: `${monthName}次數` }],
    },
  ];
  if (BODY_LATEST) {
    const stats: HeroStat[] = [];
    if (BODY_PREV) stats.push({ value: signed(lbToKg(BODY_LATEST.weightLb) - lbToKg(BODY_PREV.weightLb), 1), label: `kg，較${dateLabel(BODY_PREV.date)}` });
    if (BODY_LATEST.fatPct !== undefined) stats.push({ value: `${BODY_LATEST.fatPct}%`, label: `體脂率${BODY_LATEST.status?.fat ? `・${BODY_LATEST.status.fat}` : ""}` });
    heroCards.push({
      kicker: "體重（早上空腹）", value: `${lbToKg(BODY_LATEST.weightLb)}`, unit: "kg", color: PASTEL[2], glyph: "scale",
      detail: `${BODY_LATEST.weightLb.toFixed(1)} lb・${dateLabel(BODY_LATEST.date)}${BODY_LATEST.time ? ` ${BODY_LATEST.time}` : ""}`,
      stats,
    });
  }

  const firstDate = logSorted.length > 0 ? logSorted[logSorted.length - 1].date : today;
  const months: string[] = [];
  {
    let y = parseInt(firstDate.slice(0, 4), 10);
    let mo = parseInt(firstDate.slice(5, 7), 10);
    const ty = parseInt(today.slice(0, 4), 10);
    const tm = parseInt(today.slice(5, 7), 10);
    while (y < ty || (y === ty && mo <= tm)) {
      months.push(`${y}-${mo < 10 ? "0" : ""}${mo}`);
      mo += 1;
      if (mo > 12) { mo = 1; y += 1; }
    }
  }
  const monthVal = (m: string): number => {
    const list = WORKOUT_LOG.filter((e: LogEntry) => e.date.startsWith(m));
    const t = sumLog(list);
    if (monthMetric === "n") return t.n;
    if (monthMetric === "min") return Math.round(t.min);
    if (monthMetric === "km") return Math.round(t.km * 10) / 10;
    if (monthMetric === "hr") {
      const hrs = list.filter((e: LogEntry) => e.hrAvg !== undefined).map((e: LogEntry) => e.hrAvg as number);
      return hrs.length > 0 ? Math.round(hrs.reduce((a: number, b: number) => a + b, 0) / hrs.length) : 0;
    }
    return Math.round(t.kcal);
  };
  const monthPoints = months.map((m: string) => ({ label: `${parseInt(m.slice(5, 7), 10)}月`, value: monthVal(m), display: `${monthVal(m)}` }));

  const weeks: number[] = [];
  for (let w = mondayOf(dayNum(firstDate)); w <= weekStart; w += 7) weeks.push(w);
  const lastW = weeks.length - 1;
  const wStep = Math.max(1, Math.ceil(lastW / 5));
  const weekPoints = weeks.map((w: number, i: number) => ({
    label: i === 0 || i === lastW || (i % wStep === 0 && lastW - i >= wStep / 2) ? shortDate(w) : "",
    value: Math.round(sumLog(WORKOUT_LOG.filter((e: LogEntry) => { const d = dayNum(e.date); return d >= w && d < w + 7; })).min),
  }));
  const weekCeil = Math.max(60, Math.ceil(Math.max(0, ...weekPoints.map((p: { value: number }) => p.value)) / 30) * 30);

  const zoneRows = ZONES.map((z: { id: string; label: string; range: string }, i: number) => {
    const list = WORKOUT_LOG.filter((e: LogEntry) => zoneIndex(e.hrAvg) === i);
    return { id: z.id, label: z.label, range: z.range, min: Math.round(sumLog(list).min), n: list.length };
  });
  const noHr = WORKOUT_LOG.filter((e: LogEntry) => e.hrAvg === undefined).length;

  const histAll = logSorted.filter((e: LogEntry) => histFilter === "全部" || typeGroup(e.name) === histFilter);
  const histCount = (g: string): number => logSorted.filter((e: LogEntry) => g === "全部" || typeGroup(e.name) === g).length;

  const dayList: string[] = Array.from(new Set(logSorted.map((e: LogEntry) => e.date)));
  const dIdx = Math.max(0, Math.min(dayPick, dayList.length - 1));
  const dSel = dayList[dIdx] ?? today;
  const dRows = WORKOUT_LOG.filter((e: LogEntry) => e.date === dSel).sort((a: LogEntry, b: LogEntry) => (a.start < b.start ? -1 : 1));
  const dT = sumLog(dRows);
  const nextS = suggestNext(dSel);
  const nextDate = dateLabel(new Date((dayNum(dSel) + 1) * 86400000).toISOString().slice(0, 10));
  const rDay = replayDay !== "" ? replayDay : (dayList[0] ?? today);
  const tabInfo = TABS.find((t: { id: string }) => t.id === tab) ?? TABS[0];
  const BAND: Record<string, { title: string; sub: string; stat: string }> = {
    today: { title: "今日總覽", sub: dayList.length > 0 ? dateLabel(dSel) : "未有紀錄", stat: `${dT.n} 項・${Math.round(dT.min)} 分鐘・${Math.round(dT.kcal)} kcal` },
    week: { title: "本週", sub: `截至 ${dateLabel(today)}`, stat: `${Math.round(weekT.min)} 分鐘・${weekT.n} 次・${Math.round(weekT.kcal)} kcal` },
    log: { title: "運動紀錄", sub: "列表或一日重播", stat: `共 ${logSorted.length} 次` },
    body: { title: "身體組成", sub: `${BODY_SOURCE}・只比較早上空腹讀數`, stat: BODY_LATEST ? `${lbToKg(BODY_LATEST.weightLb)} kg` : "" },
    guide: { title: "動作圖鑑", sub: "按動作看肌群、建議組數及熱量", stat: `${MOVES.length} 個動作` },
  };
  const band = BAND[tabInfo.id] ?? BAND.today;

  const guideSubList = guideSubs(guideGroup);
  const guideMoves = MOVES.map((m: Move, i: number) => ({ m, i })).filter((x: { m: Move; i: number }) => x.m[0] === guideGroup && (guideSubList.length === 0 || guideSub === "全部" || x.m[1] === guideSub));

  useEffect(() => {
    const id = setTimeout(() => {
      try { const el = document.getElementById("tr-panel"); if (el) setTop(Math.round(el.getBoundingClientRect().top + window.scrollY)); } catch { /* 量度失敗時用預設值 */ }
    }, 60);
    return () => clearTimeout(id);
  }, [tab, vp.w, vp.h]);
  // 一屏模式（iPad 橫向及桌面）：分頁內容高度 = 視窗高度 − 分頁頂部位置
  const inner = Math.max(440, vp.h - top - 14 - 24 - 50);
  const colsTpl = (land: string, portrait: string): string | undefined => (vp.bp === "phone" ? "minmax(0, 1fr)" : vp.bp === "portrait" ? portrait : land);
  const cmpRows = BODY_LATEST && BODY_PREV ? bodyCompare(BODY_PREV, BODY_LATEST) : [];
  const cmpH = 50 + 31 * (cmpRows.length + 1);
  const histH = fit ? Math.max(130, inner - cmpH - 14 - 58) : 240;
  const trendH = fit ? Math.max(90, Math.floor((inner - 14) / 2) - 92) : 130;

  const pickTab = (id: string) => {
    setTab(id);
    setOpenMove(-1);
    try { window.scrollTo({ top: 0 }); } catch { /* 無法捲動時不作處理 */ }
  };

  return (
    <Page title="我的運動記事簿" lang="zh-Hant" width="full" palette={PASTEL}>
      <TabBar value={tab} onPick={pickTab} aside={<BandChip key={`chip-${tab}`} color={tabInfo.color} sub={band.sub} stat={band.stat} />} />
      {vp.bp !== "land" && vp.bp !== "desk" && (
        <div key={`band-${tab}`}>
          <TabBand color={tabInfo.color} glyph={tabInfo.glyph} title={band.title} sub={band.sub} stat={band.stat} />
        </div>
      )}
      <div key={`panel-${tab}`} id="tr-panel">
      <TabPanel color={tabInfo.color}>

      {tab === "today" && dayList.length > 0 && (
        <Stack gap={10}>
          {!fit && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DayNav label={dateLabel(dSel)} canPrev={dIdx < dayList.length - 1} canNext={dIdx > 0} onPrev={() => setDayPick(dIdx + 1)} onNext={() => setDayPick(dIdx - 1)} />
            </div>
          )}
          <TodaySlider
            h={fit ? inner - 56 : undefined}
            lead={fit ? <DayNav label={dateLabel(dSel)} canPrev={dIdx < dayList.length - 1} canNext={dIdx > 0} onPrev={() => setDayPick(dIdx + 1)} onNext={() => setDayPick(dIdx - 1)} /> : undefined}
            labels={["今日", "下次建議"]}
            colors={[PASTEL[5], PASTEL[2]]}
            slides={[
              <TodayCard key={`day-${dSel}`} cols={fit ? "minmax(0, 1.3fr) minmax(0, 1fr)" : undefined}>
                <Stack gap={10}>
                  <DayStats items={[{ value: `${dT.n}`, label: "項目" }, { value: `${Math.round(dT.min)}`, label: "分鐘" }, { value: dT.km.toFixed(1), label: "公里" }, { value: `${Math.round(dT.kcal)}`, label: "kcal" }]} />
                  <Scroller h={fit ? inner - 166 : 330}>
                    <DayCards rows={dRows} />
                  </Scroller>
                </Stack>
                <DayMuscleMap hits={muscleHits(dRows)} />
              </TodayCard>,
              <NextCard key={`next-${dSel}`} s={nextS} forDate={nextDate} />,
            ]}
          />
        </Stack>
      )}

      {tab === "week" && (
        <Cols min={460} tpl={colsTpl("minmax(0, 1fr) minmax(0, 1fr)", "minmax(0, 1fr)")}>
          <Stack>
            <HeroCards cards={heroCards.slice(0, 2)} />
            <CardBox title="每週運動時間" aside="分鐘">
              <Lollipop points={weekPoints} ceil={weekCeil} unit="分鐘" />
            </CardBox>
          </Stack>
          <Stack>
            <CardBox title="每月總計" aside={MONTH_UNIT[monthMetric]}>
              <Segmented
                options={[{ value: "kcal", label: "熱量" }, { value: "min", label: "時間" }, { value: "km", label: "距離" }, { value: "n", label: "次數" }, { value: "hr", label: "心率" }]}
                value={monthMetric}
                onChange={(v: string) => setMonthMetric(v)}
              />
              <MonthPills key={monthMetric} points={monthPoints} />
            </CardBox>
            <CardBox title="心率區間" aside={`按每次平均心率${noHr > 0 ? `；${noHr} 次沒有心率` : ""}`}>
              <ZoneBars rows={zoneRows} />
            </CardBox>
          </Stack>
        </Cols>
      )}

      {tab === "log" && (
        <Stack gap={10}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <Segmented options={[{ value: "list", label: "列表" }, { value: "replay", label: "一日重播" }]} value={logView} onChange={(v: string) => setLogView(v)} />
            {logView === "list" && (
              <Segmented
                options={["全部", "跑步", "步行", "器械"].map((g: string) => ({ value: g, label: g, count: histCount(g) }))}
                value={histFilter}
                onChange={(v: string) => setHistFilter(v)}
              />
            )}
            {logView === "replay" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <Select options={dayList.slice(0, 14).map((d: string) => ({ value: d, label: dateLabel(d) }))} value={rDay} onChange={(v: string) => setReplayDay(v)} />
                <Button label="重播" onClick={() => setReplayRun(replayRun + 1)} />
              </div>
            )}
          </div>
          {logView === "list" && (
            <Scroller h={fit ? inner - 58 : 540}>
              <Timeline key={histFilter} rows={histAll} />
            </Scroller>
          )}
          {logView === "replay" && (
            <CardBox title={dateLabel(rDay)} aside="按記錄時間逐項出現">
              <Replay date={rDay} run={replayRun} />
            </CardBox>
          )}
        </Stack>
      )}

      {tab === "body" && BODY_LATEST && (
        <Cols min={360} gap={14} tpl={colsTpl("minmax(0, 1fr) minmax(0, 1.12fr) minmax(0, 1fr)", "minmax(0, 1fr) minmax(0, 1fr)")}>
          <Stack gap={12}>
            <HeroCards cards={heroCards.slice(2)} />
            <CardBox title="最新讀數" aside={`${dateLabel(BODY_LATEST.date)}${BODY_LATEST.time ? ` ${BODY_LATEST.time}` : ""}`}>
              <BodyBars rows={bodyBars(BODY_LATEST)} />
            </CardBox>
            <BodyTiles tiles={bodyTiles(BODY_LATEST).filter((t: BodyTile) => BODY_TILE_KEEP.includes(t.label))} />
          </Stack>
          <Stack gap={14}>
            {BODY_PREV && (
              <CardBox title={`與${dateLabel(BODY_PREV.date)}比較`}>
                <CompactTable columns={["指標", bodyDate(BODY_PREV.date), bodyDate(BODY_LATEST.date), "變化"]} rows={cmpRows} />
              </CardBox>
            )}
            <CardBox title="歷史讀數" aside={`${BODY_HISTORY_ROWS.length} 次・框內捲動`}>
              <Scroller h={histH}>
                <CompactTable columns={["日期", "體重", "體脂", "內臟", "肌肉", "代謝"]} rows={BODY_HISTORY_ROWS} />
              </Scroller>
            </CardBox>
          </Stack>
          <div style={{ display: "grid", gridTemplateColumns: vp.bp === "portrait" ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)", gridColumn: vp.bp === "portrait" ? "1 / -1" : undefined, gap: 14, alignItems: "start", minWidth: 0 }}>
            {BODY_ASC.length > 1 && (
              <CardBox title="體重趨勢" aside="kg">
                <MiniTrend points={BODY_W_POINTS} color={PASTEL[4]} unit=" kg" h={trendH} />
              </CardBox>
            )}
            {BODY_ASC.length > 1 && (
              <CardBox title="體脂率趨勢" aside="%">
                <MiniTrend points={BODY_F_POINTS} color={PASTEL[5]} unit="%" h={trendH} />
              </CardBox>
            )}
          </div>
        </Cols>
      )}

      {tab === "guide" && (
        <Cols min={440} gap={14} tpl={colsTpl("minmax(0, 1.15fr) minmax(0, 1fr)", "minmax(0, 1fr)")}>
          <CardBox title="動作圖鑑" aside="按動作開啟詳情">
            <GuideTiles value={guideGroup} onPick={(v: string) => { setGuideGroup(v); setGuideSub(guideSubs(v)[0] ?? "全部"); }} />
            {guideGroup === "伸展" && (
              <Callout tone="info">伸展能改善柔軟度，這一點證據清晰；至於「抗衰老」及「局部減脂」等說法，則缺乏科學支持。</Callout>
            )}
            {guideSubList.length > 0 && (
              <Segmented
                options={[...guideSubList, "全部"].map((s: string) => ({ value: s, label: s }))}
                value={guideSub}
                onChange={(v: string) => setGuideSub(v)}
              />
            )}
            <Scroller h={fit ? inner - (guideSubList.length > 0 ? 248 : 196) : 430}>
              <GuideGrid key={`${guideGroup}-${guideSub}`} moves={guideMoves} selected={calcKey} onPick={(key: string) => { setOpenMove(parseInt(key.slice(1), 10)); }} />
            </Scroller>
          </CardBox>
          <div id="calc">
            <CardBox title="熱量計算機" aside={`估算值，按體重 ${BODY_WEIGHT_KG} kg`}>
              <CatPills value={calcCat(ex)} options={CALC_CATS} onPick={(g: string) => { setCalcQ(""); const first = CALC_ITEMS.find((c: CalcItem) => calcCat(c) === g); if (first) pickCalc(first.key); }} />
              <Scroller h={fit ? inner - 150 : 4000}>
              <Stack gap={12}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 8 }}>
                <Input label="搜尋動作（中文或英文）" value={calcQ} onChange={(v: string) => setCalcQ(v)} placeholder="例如：划艇、擺盪" />
                <Select label="動作" options={calcOpts} value={calcKey} onChange={(v: string) => pickCalc(v)} placeholder={calcOpts.length > 0 ? "選擇動作" : "沒有相符動作"} />
              </div>
              {controls}
              <KcalHero kcal={kcalR} name={`估算消耗：${ex.name}`} minutes={fmt1(duration)} />
              <Properties items={[
                { label: "估算熱量", value: `${kcalR} kcal` },
                { label: ex.kind === "strength" ? "時長（含休息）" : "時間", value: `${fmt1(duration)} 分鐘` },
                ...extra,
              ]} />
              </Stack>
              </Scroller>
            </CardBox>
          </div>
          {openMove >= 0 && MOVES[openMove] && (
            <MoveSheet
              m={MOVES[openMove]}
              onClose={() => setOpenMove(-1)}
              onCalc={() => {
                pickCalc(`m${openMove}`);
                setCalcQ("");
                setOpenMove(-1);
                setTimeout(() => { try { document.getElementById("calc")?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch { /* 無法捲動時不作處理 */ } }, 80);
              }}
            />
          )}
        </Cols>
      )}

      </TabPanel>
      <MinnyFooter />
      </div>
    </Page>
  );
}
