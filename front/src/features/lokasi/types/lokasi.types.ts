export interface LocationData {
  id: number;
  location_code: string;
  building_name: string;
  floor: number;
  address: string;
}

export interface CreateLocationData {
  building_name: string;
  floor: number;
  address: string;
}

export interface UpdateLocationData {
  building_name?: string;
  floor?: number;
  address?: string;
}
