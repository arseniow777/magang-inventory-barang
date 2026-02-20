import { ItemField } from "../components/item-field";
import { ThirdField } from "../components/third-field";
import { UploadField } from "../components/upload-field";

export default function CreatePage() {
  return (
    <div className="flex w-auto justify-evenly">
      <ItemField />
      <ThirdField />
      <UploadField />
    </div>
  );
}
