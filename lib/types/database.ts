export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
type AppRole = "customer" | "business_owner" | "business_staff" | "super_admin";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
type DiscountType = "percent" | "fixed";
type SubscriptionStatus = "trialing" | "active" | "past_due" | "cancelled";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; role: AppRole; full_name: string | null; phone: string | null; created_at: string };
      };
      businesses: {
        Row: {
          id: string;
          owner_user_id: string;
          slug: string;
          name: string;
          description: string | null;
          city: string;
          district: string;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      branches: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          address: string;
          phone: string | null;
          created_at: string;
        };
      };
      staff: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          user_id: string | null;
          full_name: string;
          phone: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          name: string;
          duration_min: number;
          price_try: number;
          is_active: boolean;
          created_at: string;
        };
      };
      staff_services: {
        Row: { staff_id: string; service_id: string; created_at: string };
      };
      working_hours: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          staff_id: string | null;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at: string;
        };
      };
      blocked_times: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string | null;
          staff_id: string | null;
          start_at: string;
          end_at: string;
          reason: string | null;
          created_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          user_id: string | null;
          full_name: string;
          phone: string;
          email: string | null;
          created_at: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          branch_id: string;
          service_id: string;
          staff_id: string | null;
          customer_id: string;
          start_at: string;
          end_at: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          appointment_id: string;
          business_id: string;
          amount_try: number;
          status: PaymentStatus;
          provider: string | null;
          provider_ref: string | null;
          created_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          business_id: string;
          appointment_id: string;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          business_id: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          expires_at: string | null;
          active: boolean;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          business_id: string | null;
          user_id: string | null;
          channel: string;
          title: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          business_id: string;
          plan_code: string;
          status: SubscriptionStatus;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
