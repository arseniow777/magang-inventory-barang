export interface RequestData {
  id: number;
  request_code: string;
  request_type: "borrow" | "transfer" | "sell" | "demolish";
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  approved_at: string | null;
  created_at: string;
  destination_location: {
    building_name: string;
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

export type RequestStatus = "pending" | "approved" | "rejected" | "completed";
export type RequestType = "borrow" | "transfer" | "sell" | "demolish";
