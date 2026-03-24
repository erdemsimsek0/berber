export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: { Row: { id: string; role: "customer" | "business_owner" | "business_staff" | "super_admin"; full_name: string | null; phone: string | null; created_at: string } };
      businesses: { Row: { id: string; owner_user_id: string; slug: string; name: string; description: string | null; city: string; district: string; logo_url: string | null; is_active: boolean; created_at: string } };
      branches: { Row: { id: string; business_id: string; name: string; address: string; phone: string | null; created_at: string } };
      services: { Row: { id: string; business_id: string; branch_id: string | null; name: string; duration_min: number; price_try: number; is_active: boolean; created_at: string } };
      staff: { Row: { id: string; business_id: string; branch_id: string | null; user_id: string | null; full_name: string; phone: string | null; is_active: boolean; created_at: string } };
      customers: { Row: { id: string; business_id: string; user_id: string | null; full_name: string; phone: string; email: string | null; created_at: string } };
      appointments: { Row: { id: string; business_id: string; branch_id: string; service_id: string; staff_id: string | null; customer_id: string; start_at: string; end_at: string; status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"; notes: string | null; created_at: string } };
      reviews: { Row: { id: string; business_id: string; appointment_id: string; customer_id: string; rating: number; comment: string | null; created_at: string } };
      coupons: { Row: { id: string; business_id: string; code: string; discount_type: "percent" | "fixed"; discount_value: number; expires_at: string | null; active: boolean; created_at: string } };
      subscriptions: { Row: { id: string; business_id: string; plan_code: string; status: "trialing" | "active" | "past_due" | "cancelled"; started_at: string; ended_at: string | null; created_at: string } };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
