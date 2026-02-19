"use client";

import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {sections.map((item) => (
          <SidebarMenuItem key={item.name}>
            <Link to={item.url}>
              <SidebarMenuButton
                className={`w-full transition-colors ${
                  isActive(item.url)
                    ? "bg-sidebar-border text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50"
                }`}
                title={item.name}
              >
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
