export interface CreateBarangRequest {
  name: string;
  category: string;
  procurement_year: number;
  quantity: number;
  location_id: number;
}

export interface Location {
  id: number;
  location_code: string;
  building_name: string;
  floor: number;
  address: string;
}

export interface Category {
  value: string;
  label: string;
}
