import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconCirclePlus,
  IconUsersGroup,
  IconBox,
  IconBuildingCommunity,
} from "@tabler/icons-react";

export function AddDataButton() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const menuItems = [
    {
      label: "Tambah Pengguna",
      icon: <IconUsersGroup className="h-4 w-4" />,
      path: "/dashboard/pengguna/tambahPengguna",
    },
    {
      label: "Tambah Barang",
      icon: <IconBox className="h-4 w-4" />,
      path: "/dashboard/barang/create",
    },
    {
      label: "Tambah Lokasi",
      icon: <IconBuildingCommunity className="h-4 w-4" />,
      path: "/dashboard/lokasi/tambah",
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            <IconCirclePlus className="h-4 w-4" />
            <span>Tambahkan data</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
