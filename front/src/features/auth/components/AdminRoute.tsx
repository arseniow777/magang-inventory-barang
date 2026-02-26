import { Navigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Spinner } from "@/components/ui/spinner";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuthUser();
  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  if (!user || user.role !== "admin")
    return <Navigate to="/dashboard/barang" replace />;
  return <>{children}</>;
}
