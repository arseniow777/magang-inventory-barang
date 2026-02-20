export interface RequestData {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Done";
export type RequestType = "Peminjaman" | "Permintaan Barang" | "Pengembalian";
