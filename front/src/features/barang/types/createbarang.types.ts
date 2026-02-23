export interface CreateBarangRequest {
  name: string;
  category: string;
  procurement_year: number;
  quantity: number;
  location_id: number;
}

export interface Location {
  id: number;
  code: number;
  name: string;
  description?: string;
}

export interface Category {
  value: string;
  label: string;
}
