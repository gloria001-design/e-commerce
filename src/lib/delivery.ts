import { FREE_SHIPPING_AT } from "@/lib/catalog";

/** Region values the backend's delivery endpoint accepts (Swagger "region" enum), with display names. */
export const REGIONS = [
  ["Abia", "Abia"], ["Adamawa", "Adamawa"], ["AkwaIbom", "Akwa Ibom"], ["Anambra", "Anambra"], ["Bauchi", "Bauchi"], ["Bayelsa", "Bayelsa"],
  ["Benue", "Benue"], ["Borno", "Borno"], ["CrossRiver", "Cross River"], ["Delta", "Delta"], ["Ebonyi", "Ebonyi"], ["Edo", "Edo"],
  ["Ekiti", "Ekiti"], ["Enugu", "Enugu"], ["FCT", "Abuja (FCT)"], ["Gombe", "Gombe"], ["Imo", "Imo"], ["Jigawa", "Jigawa"],
  ["Kaduna", "Kaduna"], ["Kano", "Kano"], ["Katsina", "Katsina"], ["Kebbi", "Kebbi"], ["Kogi", "Kogi"], ["Kwara", "Kwara"],
  ["Lagos", "Lagos"], ["Nasarawa", "Nasarawa"], ["Niger", "Niger"], ["Ogun", "Ogun"], ["Ondo", "Ondo"], ["Osun", "Osun"],
  ["Oyo", "Oyo"], ["Plateau", "Plateau"], ["Rivers", "Rivers"], ["Sokoto", "Sokoto"], ["Taraba", "Taraba"], ["Yobe", "Yobe"], ["Zamfara", "Zamfara"],
] as const;
export type RegionCode = (typeof REGIONS)[number][0];

/** Suggested areas per region for the checkout dropdown; regions not listed fall back to a free-text area. */
export const zoneFor = (code: string) => ZONES.find((z) => z.code === code);

/**
 * Delivery zones. This table only drives the fee/arrival ESTIMATE on the product page: the backend's
 * delivery endpoint stores no fee (it is currently 0) and always uses door delivery. Fees are in major
 * units (same as money()), days are [min, max] working days.
 */
export type Zone = { code: RegionCode; region: string; areas: string[]; doorFee: number; doorDays: [number, number]; pickupFee: number; pickupDays: [number, number] };

export const ZONES: Zone[] = [
  { code: "Lagos", region: "Lagos", areas: ["Ikeja", "Lekki", "Victoria Island", "Yaba", "Surulere", "Ajah", "Ikorodu"], doorFee: 4, doorDays: [1, 2], pickupFee: 2, pickupDays: [1, 3] },
  { code: "FCT", region: "Abuja (FCT)", areas: ["Wuse", "Garki", "Maitama", "Gwarinpa", "Kubwa", "Lugbe"], doorFee: 5, doorDays: [2, 3], pickupFee: 2.5, pickupDays: [2, 4] },
  { code: "Rivers", region: "Rivers", areas: ["Port Harcourt", "Obio-Akpor", "Eleme"], doorFee: 6, doorDays: [2, 4], pickupFee: 3, pickupDays: [3, 5] },
  { code: "Oyo", region: "Oyo", areas: ["Ibadan", "Ogbomosho"], doorFee: 6, doorDays: [2, 4], pickupFee: 3, pickupDays: [3, 5] },
  { code: "Enugu", region: "Enugu", areas: ["Enugu", "Nsukka"], doorFee: 7, doorDays: [3, 5], pickupFee: 3.5, pickupDays: [3, 6] },
  { code: "Kano", region: "Kano", areas: ["Kano", "Nassarawa"], doorFee: 8, doorDays: [3, 6], pickupFee: 4, pickupDays: [4, 7] },
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
