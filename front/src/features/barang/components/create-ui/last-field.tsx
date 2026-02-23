import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconNumber3 } from "@tabler/icons-react";
import CreateHeader from "./create-header";
import { usePICUsers } from "@/hooks/useItemQueries";

interface LastFieldProps {
  formData: { pic_id: string };
  onFieldChange: (field: string, value: string) => void;
}

export function LastField({ formData, onFieldChange }: LastFieldProps) {
  const { data: users = [], isLoading: loadingUsers } = usePICUsers();

  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <CreateHeader
              title="PIC"
              description="Person in charge"
              icon={IconNumber3}
            />
          </FieldSet>
          <FieldSet>
            <FieldLabel>Person in Charge (PIC)</FieldLabel>
            <FieldDescription>
              Silahkan pilih orang yang bertanggung jawab atas barang ini, jika
              tidak ada maka tambahkan datanya di bagian pengguna
            </FieldDescription>
            <Field>
              <Select
                value={formData.pic_id}
                onValueChange={(value) =>
                  value && onFieldChange("pic_id", value)
                }
              >
                <SelectTrigger id="pic-select">
                  <SelectValue
                    placeholder={
                      loadingUsers ? "Memuat pengguna..." : "Pilih PIC"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}
