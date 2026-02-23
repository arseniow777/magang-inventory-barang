export interface ReportData {
  id: number;
  report_number: string;
  report_type: string;
  issued_date: string;
  file_path: string;
  created_at: string;
  is_approved: boolean;
  approved_by_id: number | null;
  approved_at: string | null;
  request_id: number;
  issued_by_id: number;
  request?: {
    request_code: string;
    request_type: string;
    pic: {
      name: string;
    };
    destination_location: {
      building_name: string;
    };
  };
  issued_by?: {
    name: string;
  };
  approved_by?: {
    name: string;
  } | null;
}

export type ReportType = "BORROW" | "RETURN" | "DAMAGE" | "LOST";
