import { IconNumber1 } from "@tabler/icons-react";
import type { ElementType } from "react";

type CreateHeaderProps = {
  title: string;
  description: string;
  icon?: ElementType;
};
export default function CreateHeader({
  title,
  description,
  icon: Icon = IconNumber1,
}: CreateHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary w-fit rounded-full border border-accent-foreground/20 text-white">
        <Icon />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3 h-auto">
          <p className="font-bold text-lg">{title}</p>
          <div className="flex-1 h-px border border-dashed" />
        </div>
        <p className="text-muted-foreground/50">{description}</p>
      </div>
    </div>
  );
}
