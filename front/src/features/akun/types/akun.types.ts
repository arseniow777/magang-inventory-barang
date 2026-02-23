export interface Akun{
    id: number;
    username: string;
    name: string;
    role: "admin" | "pic";
    employee_id: number | null;
    phone_number: string | null;
    is_active: boolean;
}