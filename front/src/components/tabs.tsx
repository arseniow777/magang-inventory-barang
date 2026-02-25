import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tab {
  value: string;
  label: string;
}

interface TabsLineProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabsLine({ tabs, activeTab, onTabChange }: TabsLineProps) {
  return (
    <>
      {/* Mobile: Select */}
      <div className="lg:hidden">
        <Select value={activeTab} onValueChange={(v) => v && onTabChange(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {tabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden lg:block">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList variant="default">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
