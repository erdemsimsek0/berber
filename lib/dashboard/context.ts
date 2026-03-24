export const DEFAULT_BUSINESS_ID = "10000000-0000-0000-0000-000000000001";

export function getCurrentBusinessId() {
  return process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID || DEFAULT_BUSINESS_ID;
}
