import * as React from "react";
import { useNavigate } from "react-router-dom";

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
import { useAuthUser } from "@/hooks/useAuthUser";

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

  // auth
  const { data: authUser } = useAuthUser();
  const isGuest = localStorage.getItem("isGuest") === "true";
  const isAdmin = authUser?.role === "admin";

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
              <a href={item.url}>
                <SidebarMenuButton className="px-5" tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </a>
            </SidebarMenuItem>
          ))}
          {!isGuest && isAdmin && (
            <SidebarMenuItem className="px-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<SidebarMenuButton tooltip="Tambahkan data" />}
                >
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
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
