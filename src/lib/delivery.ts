import { FREE_SHIPPING_AT } from "@/lib/catalog";

/**
 * Delivery zones. The backend has no delivery/address endpoint wired up, so this table drives the
 * estimator on the product page. Edit freely: fees are in major units (same as money()), days are
 * [min, max] working days. Swap getDeliveryOptions for an API call later; the UI only needs its return shape.
 */
export type Zone = { region: string; areas: string[]; doorFee: number; doorDays: [number, number]; pickupFee: number; pickupDays: [number, number] };

export const ZONES: Zone[] = [
  { region: "Lagos", areas: ["Ikeja", "Lekki", "Victoria Island", "Yaba", "Surulere", "Ajah", "Ikorodu"], doorFee: 4, doorDays: [1, 2], pickupFee: 2, pickupDays: [1, 3] },
  { region: "Abuja (FCT)", areas: ["Wuse", "Garki", "Maitama", "Gwarinpa", "Kubwa", "Lugbe"], doorFee: 5, doorDays: [2, 3], pickupFee: 2.5, pickupDays: [2, 4] },
  { region: "Rivers", areas: ["Port Harcourt", "Obio-Akpor", "Eleme"], doorFee: 6, doorDays: [2, 4], pickupFee: 3, pickupDays: [3, 5] },
  { region: "Oyo", areas: ["Ibadan", "Ogbomosho"], doorFee: 6, doorDays: [2, 4], pickupFee: 3, pickupDays: [3, 5] },
  { region: "Enugu", areas: ["Enugu", "Nsukka"], doorFee: 7, doorDays: [3, 5], pickupFee: 3.5, pickupDays: [3, 6] },
  { region: "Kano", areas: ["Kano", "Nassarawa"], doorFee: 8, doorDays: [3, 6], pickupFee: 4, pickupDays: [4, 7] },
];

export type DeliveryOption = { kind: "door" | "pickup"; label: string; fee: number; from: Date; to: Date };

/** Adds working days (Mon–Sat; Sundays skipped). */
function addDays(start: Date, n: number) {
  const d = new Date(start);
  while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n--; }
  return d;
}

export function getDeliveryOptions(region: string, orderTotal: number, now = new Date()): DeliveryOption[] {
  const z = ZONES.find((x) => x.region === region);
  if (!z) return [];
  const free = orderTotal >= FREE_SHIPPING_AT;
  return [
    { kind: "door", label: "Door delivery", fee: free ? 0 : z.doorFee, from: addDays(now, z.doorDays[0]), to: addDays(now, z.doorDays[1]) },
    { kind: "pickup", label: "Pickup station", fee: free ? 0 : z.pickupFee, from: addDays(now, z.pickupDays[0]), to: addDays(now, z.pickupDays[1]) },
  ];
}
