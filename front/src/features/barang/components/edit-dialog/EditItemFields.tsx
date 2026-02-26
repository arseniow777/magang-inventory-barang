import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export interface EditFormData {
  name: string;
  category: string;
  procurement_year: string;
}

interface EditItemFieldsProps {
  form: EditFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EditItemFields({ form, onChange }: EditItemFieldsProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Nama Barang</FieldLabel>
        <Input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Nama barang"
        />
      </Field>
      <Field>
        <FieldLabel>Kategori</FieldLabel>
        <Input
          name="category"
          value={form.category}
          onChange={onChange}
          placeholder="Kategori"
        />
      </Field>
      <Field>
        <FieldLabel>Tahun Pengadaan</FieldLabel>
        <Input
          name="procurement_year"
          type="number"
          value={form.procurement_year}
          onChange={onChange}
          placeholder="Contoh: 2024"
        />
      </Field>
    </FieldGroup>
  );
}
