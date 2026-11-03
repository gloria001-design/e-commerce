export type Period = "Today" | "This Week" | "This Month";

export const revenue: Record<Period, { total: string; delta: string; prev: string; bars: number[]; labels: string[] }> = {
  Today: { total: "$14,820.50", delta: "+18.4%", prev: "$12,518.20 last week", bars: [30, 45, 38, 60, 52, 78, 100], labels: ["M", "T", "W", "T", "F", "S", "S"] },
  "This Week": { total: "$96,410.00", delta: "+9.1%", prev: "$88,360.00 last week", bars: [55, 62, 48, 70, 66, 85, 100], labels: ["M", "T", "W", "T", "F", "S", "S"] },
  "This Month": { total: "$402,980.75", delta: "+12.7%", prev: "$357,500.00 last month", bars: [40, 58, 72, 100], labels: ["W1", "W2", "W3", "W4"] },
};

export const recentOrders = [
  { id: "4092", ago: "3 mins ago", name: "Marcus Vance", items: "Matte Aroma Lamp × 1, Refill Oil × 2", total: "$184.00", pay: "Apple Pay", status: "Processing" },
  { id: "4091", ago: "22 mins ago", name: "Evelyn Chen", items: "Orb Table Light (Brass) × 1", total: "$240.00", pay: "Visa •• 8912", status: "Paid" },
  { id: "4090", ago: "1 hr ago", name: "Devon Carter", items: "Ceramic Pourer Set × 1", total: "$68.50", pay: "Mastercard •• 4022", status: "Delivered" },
] as const;
