"use client";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  title,
  sections,
}: {
  title: string;
  sections: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const isActive = (url: string) => location.pathname === url;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-5">{title}</SidebarGroupLabel>
      <SidebarMenu>
        {sections.map((sections) => (
          <SidebarMenuItem key={sections.name}>
            <Link to={sections.url} onClick={() => setOpenMobile(false)}>
              <SidebarMenuButton
                tooltip={sections.name}
                className={`w-full px-5 transition-colors ${
                  isActive(sections.url)
                    ? "bg-sidebar-border text-sidebar-accent-foreground border"
                    : "hover:border hover:bg-sidebar-border"
                }`}
              >
                <span className="mr-2">{sections.icon}</span>
                <span>{sections.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
