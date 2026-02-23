import { IconNumber1 } from "@tabler/icons-react";
import { Pattern } from "./upload";
import CreateHeader from "./create-header";

interface FirstFieldProps {
  formData: { photos: File[] };
  onFieldChange: (field: string, value: File[]) => void;
}

export function FirstField({ onFieldChange }: FirstFieldProps) {
  return (
    <div className="w-full">
      <CreateHeader
        title="Upload foto"
        description="Unggah foto barang maks 3 foto"
        icon={IconNumber1}
      />

      {/* Upload Pattern */}
      <Pattern
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        accept="image/*"
        multiple={true}
        simulateUpload={false}
        onFilesChange={(files) =>
          onFieldChange(
            "photos",
            files
              .map((f) => f.file)
              .filter((f): f is File => f instanceof File),
          )
        }
      />
    </div>
  );
}
