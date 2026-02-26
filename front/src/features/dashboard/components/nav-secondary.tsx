import * as React from "react";
import { useNavigate } from "react-router-dom";
// import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCirclePlus,
  IconUsersGroup,
  IconBox,
  IconBuildingCommunity,
} from "@tabler/icons-react";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const addDataMenuItems = [
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
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton render={<a href={item.url} />}>
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Add Data Dropdown */}
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
                {addDataMenuItems.map((item) => (
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
