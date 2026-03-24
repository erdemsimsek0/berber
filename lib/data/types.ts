export type BusinessService = {
  id: string;
  name: string;
  duration_min: number;
  price_try: number;
};

export type BusinessBranch = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
};

export type BusinessStaff = {
  id: string;
  full_name: string;
  branch_id: string | null;
  is_active: boolean;
};

export type BusinessListItem = {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  description: string | null;
  rating: number;
  branches: BusinessBranch[];
  services: BusinessService[];
  staff: BusinessStaff[];
};
