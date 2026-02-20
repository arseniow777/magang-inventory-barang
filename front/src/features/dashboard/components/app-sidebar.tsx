import * as React from "react";

import { NavProjects } from "@/features/dashboard/components/nav-projects";
import { NavSecondary } from "@/features/dashboard/components/nav-secondary";
import { NavUser } from "@/features/dashboard/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  IconSearch,
  IconMailbox,
  IconLayoutGrid,
  IconBox,
  IconFileDescription,
  IconBuildingCommunity,
  IconUsersGroup,
  IconHistory,
  IconHelp,
  IconCirclePlus,
} from "@tabler/icons-react";

import { Calendar } from "@/components/ui/calendar";
import { useAuthUser, getRoleDisplay } from "@/hooks/useAuthUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: authUser } = useAuthUser();

  const defaultUser = {
    name: "Loading...",
    role: "Loading...",
    avatar: "/avatars/shadcn.jpg",
  };

  const userData = authUser
    ? {
        name: authUser.name,
        role: getRoleDisplay(authUser.role),
        avatar: "/avatars/shadcn.jpg",
      }
    : defaultUser;

  const data = {
    user: userData,
    umum: [
      {
        name: "Beranda",
        url: "/dashboard",
        icon: <IconLayoutGrid />,
      },
      {
        name: "Barang",
        url: "/dashboard/barang",
        icon: <IconBox />,
      },
    ],
    administratif: [
      {
        name: "Daftar permintaan",
        url: "/dashboard/permintaan",
        icon: <IconMailbox />,
      },
      {
        name: "Berita acara",
        url: "/dashboard/berita",
        icon: <IconFileDescription />,
      },
      {
        name: "Lokasi",
        url: "/dashboard/lokasi",
        icon: <IconBuildingCommunity />,
      },
      {
        name: "Pengguna",
        url: "/dashboard/pengguna",
        icon: <IconUsersGroup />,
      },
    ],
    secondary: [
      {
        title: "Cari cepat",
        url: "#",
        icon: <IconSearch />,
      },
      {
        title: "Audit log",
        url: "/dashboard/audit",
        icon: <IconHistory />,
      },
      {
        title: "Bantuan",
        url: "#",
        icon: <IconHelp />,
      },
      {
        title: "Tambahkan data",
        url: "#",
        icon: <IconCirclePlus />,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b p-0 h-16 flex items-center justify-center">
        <div className="flex items-center w-full justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-7 w-auto group-data-[collapsible=icon]:hidden"
          />
          <img
            src="/logo-icon.svg"
            alt="Logo Icon"
            className="hidden h-4 w-auto group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="items-center">
        <Calendar
          mode="single"
          className="group-data-[collapsible=icon]:hidden"
        />
        <Separator />
        <NavProjects title="Umum" sections={data.umum} />
        <Separator className="hidden group-data-[collapsible=icon]:block" />
        <NavProjects title="Administratif" sections={data.administratif} />
        <NavSecondary items={data.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
