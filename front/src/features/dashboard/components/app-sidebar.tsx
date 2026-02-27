import * as React from "react";

import { NavProjects } from "@/features/dashboard/components/nav-projects";
import { NavSecondary } from "@/features/dashboard/components/nav-secondary";
import { NavUser } from "@/features/dashboard/components/nav-user";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  IconKey,
  IconArrowsTransferDown,
} from "@tabler/icons-react";

import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { useAuthUser, getRoleDisplay } from "@/hooks/useAuthUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: authUser } = useAuthUser();
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("isGuest") === "true";

  const defaultUser = {
    name: isGuest ? "Tamu" : "Loading...",
    role: isGuest ? "Tamu" : "Loading...",
    avatar: "/avatars/shadcn.jpg",
  };

  const userData = authUser
    ? {
        name: authUser.name,
        role: getRoleDisplay(authUser.role),
        avatar: "/avatars/shadcn.jpg",
      }
    : defaultUser;

  const isAdmin = authUser?.role === "admin";

  const data = React.useMemo(
    () => ({
      user: userData,
      umum: [
        ...(!isGuest && isAdmin
          ? [{ name: "Beranda", url: "/dashboard", icon: <IconLayoutGrid /> }]
          : []),
        {
          name: "Barang",
          url: "/dashboard/barang",
          icon: <IconBox />,
        },
      ],
      administratif: isGuest
        ? []
        : [
            {
              name: "Daftar permintaan",
              url: "/dashboard/permintaan",
              icon: <IconMailbox />,
            },
            ...(isAdmin
              ? [
                  {
                    name: "Reset Password",
                    url: "/dashboard/reset-password",
                    icon: <IconKey />,
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
                ]
              : [
                  {
                    name: "Transfer Barang",
                    url: "/dashboard/transfer",
                    icon: <IconArrowsTransferDown />,
                  },
                ]),
          ],
      secondary: isGuest
        ? [
            {
              title: "Bantuan",
              url: "#",
              icon: <IconHelp />,
            },
          ]
        : [
            // {
            //   title: "Cari cepat",
            //   url: "#",
            //   icon: <IconSearch />,
            // },
            ...(isAdmin
              ? [
                  {
                    title: "Audit log",
                    url: "/dashboard/audit",
                    icon: <IconHistory />,
                  },
                  // {
                  //   title: "Tambahkan data",
                  //   url: "#",
                  //   icon: <IconCirclePlus />,
                  // },
                ]
              : []),
            {
              title: "Bantuan",
              url: "#",
              icon: <IconHelp />,
            },
          ],
    }),
    [userData, isAdmin, isGuest],
  );

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
        {!isGuest && (
          <>
            <Separator className="hidden group-data-[collapsible=icon]:block" />
            <NavProjects title="Administratif" sections={data.administratif} />
          </>
        )}
        <NavSecondary items={data.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isGuest ? (
          <div className="p-2">
            <Button
              className="w-full"
              onClick={() => {
                localStorage.removeItem("isGuest");
                navigate("/login");
              }}
            >
              Masuk / Daftar
            </Button>
          </div>
        ) : (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
