import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsLineProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TabsLine({
  categories,
  activeCategory,
  onCategoryChange,
}: TabsLineProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange}>
      <TabsList variant="line">
        <TabsTrigger value="all">Semua</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
