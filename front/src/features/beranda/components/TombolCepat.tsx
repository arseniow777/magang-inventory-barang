import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconUserPlus,
  IconMapPin,
  IconLogout,
} from "@tabler/icons-react";
import { useLogout } from "@/features/auth/hooks/useLogout";

const quickButtons = [
  {
    label: "Tambahkan Barang",
    icon: IconPlus,
    to: "/dashboard/barang/create",
  },
  {
    label: "Tambahkan Pengguna",
    icon: IconUserPlus,
    to: "/dashboard/pengguna/create",
  },
  {
    label: "Tambahkan Lokasi",
    icon: IconMapPin,
    to: "/dashboard/lokasi/create",
  },
  {
    label: "Log out",
    icon: IconLogout,
    to: null,
  },
];

export default function TombolCepat() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  return (
    <div className="bg-muted/50 rounded-xl p-4 pl-0 h-full flex flex-col gap-3">
      <h2 className="text-base font-semibold pl-4">Tombol Cepat</h2>
      <div className="flex flex-col pt-4 gap-2 flex-1">
        {quickButtons.map(({ label, icon: Icon, to }) => (
          <Button
            key={label}
            variant="quickAction"
            size="lg"
            className="w-11/12 h-auto min-h-10 md:min-h-12 xl:h-16 justify-start py-2 md:py-3 overflow-hidden"
            onClick={() => (to ? navigate(to) : logout())}
          >
            <Icon className="size-4 shrink-0 text-red-500" />
            <span className="text-xs md:text-sm xl:text-base truncate">
              {label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
