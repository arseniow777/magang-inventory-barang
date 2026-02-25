// enums
export type Role = "pic" | "admin";
export type ItemCondition = "good" | "damaged" | "broken";
export type ItemStatus =
  | "available"
  | "borrowed"
  | "transferred"
  | "sold"
  | "demolished";

// users
export interface User {
  id: number;
  employee_id: string;
  username: string;
  name: string;
  role: Role;
  phone_number?: string;
  password_hash?: string;
  is_active: boolean;
  telegram_id?: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// masters
export interface ItemMasters {
  id: number;
  name: string;
  model_code: string;
  category: string;
  procurement_year: number;
  created_at: string;
  photos?: ItemPhotos[];
  _count?: {
    units: number;
  };
}

export interface CreateItemMastersDTO {
  name: string;
  model_code: string;
  category: string;
  procurement_year: number;
}

export interface UpdateItemMastersDTO {
  name?: string;
  model_code?: string;
  category?: string;
  procurement_year?: number;
}

// units
export interface ItemUnits {
  id: number;
  unit_code: string;
  condition: ItemCondition;
  status: ItemStatus;
  item_id: number;
  location_id: number;
}

export interface ItemUnitsWithLocation extends ItemUnits {
  location: {
    id: number;
    location_code: string;
    building_name: string;
    floor: number;
    address: string;
  };
}

// detail (returned by GET /items/:id — includes photos + units with location)
export interface ItemMasterDetail extends ItemMasters {
  units: ItemUnitsWithLocation[];
}

export interface CreateItemUnitsDTO {
  unit_code: string;
  condition?: ItemCondition;
  status?: ItemStatus;
  item_id: number;
  location_id: number;
}

export interface UpdateItemUnitsDTO {
  unit_code?: string;
  condition?: ItemCondition;
  status?: ItemStatus;
  item_id?: number;
  location_id?: number;
}

// photos
export interface ItemPhotos {
  id: number;
  file_path: string;
  uploaded_at: string;
  item_id: number;
}

export interface CreateItemPhotosDTO {
  file_path: string;
  item_id: number;
}
