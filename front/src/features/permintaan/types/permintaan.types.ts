export interface RequestData {
  id: number;
  request_code: string;
  request_type: "borrow" | "transfer" | "sell" | "demolish";
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  approved_at: string | null;
  created_at: string;
  destination_location: {
    id: number;
    building_name: string;
    floor: number;
  } | null;
  pic: {
    id: number;
    name: string;
    username: string;
  };
  admin: {
    id: number;
    name: string;
  } | null;
  _count: {
    request_items: number;
  };
}

export interface RequestItemData {
  id: number;
  unit: {
    id: number;
    unit_code: string;
    condition: string;
    status: string;
    item: {
      id: number;
      name: string;
      photos: { photo_url: string }[];
    };
    location: {
      id: number;
      building_name: string;
      floor: number;
    } | null;
  };
}

export interface RequestDetailData extends RequestData {
  request_items: RequestItemData[];
}

export type RequestStatus = "pending" | "approved" | "rejected" | "completed";
export type RequestType = "borrow" | "transfer" | "sell" | "demolish";
