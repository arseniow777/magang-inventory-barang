import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconNumber2 } from "@tabler/icons-react";
import CreateHeader from "./create-header";
import { useLocations } from "@/hooks/useItemQueries";

interface SecondFieldProps {
  formData: {
    name: string;
    quantity: number;
    category: string;
    procurement_year: string;
    condition: string;
    location_id: string;
  };
  onFieldChange: (field: string, value: string | number) => void;
}

const categories = ["Perabotan", "Elektronik", "Operasional"];

const years = [
  { label: "YYYY", value: "" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
];

const conditions = [
  { label: "Baru", value: "new" },
  { label: "Baik", value: "good" },
  { label: "Terpakai", value: "used" },
  { label: "Rusak", value: "damaged" },
  { label: "Tidak berfungsi", value: "broken" },
];

export function SecondField({ formData, onFieldChange }: SecondFieldProps) {
  const { data: locations = [], isLoading: loadingLocations } = useLocations();

  if (!formData) {
    return null;
  }

  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <CreateHeader
              title="Data barang"
              description="isi data barang yang sesuai"
              icon={IconNumber2}
            />

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="item-name">Nama barang</FieldLabel>
                <Input
                  id="item-name"
                  placeholder="ex: Meja Informa"
                  value={formData.name}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="item-quantity">Kuantitas</FieldLabel>
                <Input
                  id="item-quantity"
                  type="number"
                  placeholder="ex: 29"
                  min="1"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    onFieldChange("quantity", parseInt(e.target.value) || 0)
                  }
                  required
                />
                <FieldDescription>
                  Masukan kuantitas barang dalam angka. Setiap unit akan
                  otomatis di-generate dengan unit code.
                </FieldDescription>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="item-category">Kategori</FieldLabel>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      value && onFieldChange("category", value)
                    }
                    required
                  >
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="item-year">Tahun pengadaan</FieldLabel>
                  <Select
                    value={formData.procurement_year}
                    onValueChange={(value) =>
                      value && onFieldChange("procurement_year", value)
                    }
                  >
                    <SelectTrigger id="item-year">
                      <SelectValue placeholder="Pilih tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {years.map((year) => (
                          <SelectItem
                            key={year.value}
                            value={year.value}
                            disabled={year.value === ""}
                          >
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="item-condition">Kondisi barang</FieldLabel>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    value && onFieldChange("condition", value)
                  }
                >
                  <SelectTrigger id="item-condition">
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {conditions.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLabel>Lokasi barang</FieldLabel>
            <FieldDescription>
              Jika tidak ada pilihan lokasi barang maka pada tab lokasi
              tambahkan lokasi barang terlebih dahulu
            </FieldDescription>
            <Field>
              <Select
                value={formData.location_id}
                onValueChange={(value) =>
                  value && onFieldChange("location_id", value)
                }
              >
                <SelectTrigger id="item-location">
                  <SelectValue
                    placeholder={
                      loadingLocations ? "Memuat lokasi..." : "Pilih lokasi"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.building_name}
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
