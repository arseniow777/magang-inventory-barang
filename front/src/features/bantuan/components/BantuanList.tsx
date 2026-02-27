import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { TabsLine } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { IconMessage2 } from "@tabler/icons-react";
import { toast } from "sonner";

import { useContactAdmin } from "../hooks/useContactAdmin";

const faqData = [
  {
    category: "umum",
    question: "Apa yang dimaksud dengan sistem Inventory Barang Management?",
    answer:
      "Sistem ini merupakan aplikasi terpadu yang dirancang khusus untuk memudahkan organisasi dalam mengelola seluruh aset barang, mulai dari pemantauan stok, lokasi penyimpanan, hingga proses administrasi seperti peminjaman, transfer, penjualan, maupun pemusnahan barang secara efisien.",
  },
  {
    category: "umum",
    question: "Siapa saja yang memiliki akses untuk menggunakan sistem ini?",
    answer:
      "Sistem ini dapat diakses oleh dua peran utama dengan wewenang yang berbeda. PIC (Petugas) bertugas untuk membuat permintaan dan melaporkan perubahan status barang, sementara Admin memiliki kendali penuh untuk mengelola data master, menyetujui permintaan, serta mengatur akun pengguna.",
  },
  {
    category: "umum",
    question: "Apa saja fitur unggulan yang tersedia di dalam sistem?",
    answer:
      "Kami menyediakan fitur komprehensif yang mencakup manajemen data master barang dan unit, pelacakan lokasi penyimpanan, sistem pengajuan permintaan status barang, serta fitur keamanan seperti riwayat audit (log aktivitas) dan pelacakan barang berbasis QR Code.",
  },
  {
    category: "umum",
    question:
      "Bagaimana cara mendapatkan bantuan jika saya mengalami kendala teknis?",
    answer:
      "Jika Anda menemukan kendala saat menggunakan sistem, silakan hubungi Admin Sistem atau Tim IT kami melalui kontak yang tertera pada halaman Informasi Kontak di dalam menu Bantuan.",
  },
  {
    category: "akses",
    question: "Bagaimana langkah-langkah untuk masuk (login) ke dalam sistem?",
    answer:
      "Silakan buka halaman login, masukkan username dan kata sandi yang telah terdaftar, lalu klik tombol Login. Jika data yang dimasukkan sesuai, Anda akan langsung diarahkan ke halaman dashboard utama.",
  },
  {
    category: "akses",
    question: "Apa yang harus saya lakukan jika lupa kata sandi?",
    answer:
      "Demi keamanan, silakan hubungi Admin Sistem untuk mengajukan permohonan reset password. Setelah identitas Anda diverifikasi, Admin akan mengatur ulang kata sandi Anda agar Anda dapat kembali mengakses sistem.",
  },
  {
    category: "akses",
    question: "Apakah saya diperbolehkan mengubah kata sandi secara mandiri?",
    answer:
      "Saat ini, setiap perubahan kata sandi harus melalui proses persetujuan Admin. Anda dapat mengajukan permintaan reset melalui sistem dan menunggu konfirmasi dari pihak Admin sebelum kata sandi baru dapat digunakan.",
  },
  {
    category: "akses",
    question: "Bolehkah saya mengakses akun dari perangkat yang berbeda-beda?",
    answer:
      "Tentu saja, sistem kami mendukung akses dari berbagai perangkat. Namun, demi menjaga keamanan data perusahaan, kami sangat menyarankan Anda untuk selalu melakukan logout setelah selesai bekerja, terutama jika menggunakan perangkat bersama.",
  },
  {
    category: "barang",
    question:
      "Bagaimana prosedur untuk menambahkan barang baru ke dalam sistem?",
    answer:
      "Hanya pengguna dengan peran Admin yang dapat menambahkan barang melalui menu Barang, kemudian memilih Tambah Barang. Pastikan Anda mengisi detail informasi seperti nama, kode model, kategori, serta mengunggah foto barang jika diperlukan sebelum menyimpan data.",
  },
  {
    category: "barang",
    question: "Apa perbedaan antara Master Barang dan Unit Barang?",
    answer:
      "Master Barang adalah identitas umum barang (misalnya: Laptop), sedangkan Unit Barang adalah satuan fisiknya (misalnya: LAPTOP-001, LAPTOP-002). Anda dapat menambah unit baru di bawah Master Barang yang relevan untuk mencatat kode unit, kondisi, dan lokasi penyimpanannya secara spesifik.",
  },
  {
    category: "barang",
    question: "Apa saja kategori kondisi barang yang tersedia di sistem?",
    answer:
      "Kondisi barang dibagi menjadi tiga kategori utama: Baik untuk unit yang siap pakai, Rusak untuk unit dengan kendala minor namun masih berfungsi, dan Rusak Berat untuk unit yang sudah tidak dapat digunakan lagi.",
  },
  {
    category: "barang",
    question: "Dapatkah data barang yang sudah ada dihapus dari sistem?",
    answer:
      "Admin memiliki kewenangan untuk menghapus data barang, namun dengan catatan bahwa barang tersebut sudah tidak memiliki unit aktif atau tidak terkait dengan riwayat transaksi apa pun guna menjaga integritas data audit.",
  },
  {
    category: "permintaan",
    question: "Apa yang dimaksud dengan fitur Permintaan dalam sistem ini?",
    answer:
      "Fitur ini digunakan untuk mendokumentasikan setiap perubahan status unit barang, seperti Peminjaman (sementara), Transfer (perpindahan lokasi permanen), Penjualan (aset keluar organisasi), hingga Pemusnahan (untuk barang yang sudah tidak layak).",
  },
  {
    category: "permintaan",
    question: "Bagaimana cara mengajukan permintaan baru?",
    answer:
      "Pengguna dengan peran PIC dapat masuk ke menu Permintaan, pilih Buat Permintaan Baru, lalu tentukan tipe permintaan dan unit barang yang dimaksud. Jangan lupa untuk mencantumkan lokasi tujuan atau alasan permintaan sebelum mengirimnya untuk disetujui.",
  },
  {
    category: "permintaan",
    question: "Berapa lama waktu yang dibutuhkan hingga permintaan disetujui?",
    answer:
      "Proses verifikasi oleh Admin biasanya memakan waktu 1 hingga 2 hari kerja. Anda dapat memantau perkembangan status permintaan Anda secara berkala melalui menu Permintaan Saya atau melalui notifikasi sistem.",
  },
  {
    category: "permintaan",
    question:
      "Bagaimana prosedur pengembalian barang yang telah selesai dipinjam?",
    answer:
      "Untuk mengembalikan barang, silakan akses menu Permintaan Saya, cari data peminjaman yang aktif, lalu klik tombol Kembalikan. Setelah Anda mengonfirmasi lokasi pengembalian, status barang akan otomatis kembali menjadi Tersedia.",
  },
  {
    category: "lokasi",
    question: "Mengapa pengaturan lokasi penyimpanan sangat penting?",
    answer:
      "Lokasi membantu kami melacak posisi setiap unit barang secara akurat berdasarkan gedung, lantai, dan alamat detail, sehingga memudahkan proses pencarian dan distribusi aset.",
  },
  {
    category: "lokasi",
    question: "Apakah satu jenis barang bisa disimpan di lokasi yang berbeda?",
    answer:
      "Ya, satu Master Barang dapat memiliki banyak unit yang tersebar di berbagai lokasi. Anda dapat melihat distribusi lengkap unit-unit tersebut melalui halaman detail barang.",
  },
  {
    category: "lokasi",
    question: "Bagaimana cara melacak lokasi barang menggunakan QR Code?",
    answer:
      "Setiap unit barang telah dilengkapi dengan QR Code unik. Anda cukup memindai kode tersebut menggunakan aplikasi scanner di smartphone untuk mendapatkan informasi detail mengenai unit barang beserta lokasi penyimpanannya saat ini.",
  },
];

const tabs = [
  { value: "all", label: "Semua" },
  { value: "umum", label: "Pertanyaan Umum" },
  { value: "akses", label: "Akses & Keamanan" },
  { value: "barang", label: "Manajemen Barang" },
  { value: "permintaan", label: "Permintaan" },
  { value: "lokasi", label: "Lokasi & Inventaris" },
];

export default function BantuanList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useContactAdmin();

  const filtered = useMemo(() => {
    if (activeCategory === "all") return faqData;
    return faqData.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

  const handleSend = () => {
    if (!message.trim()) return;
    mutate(message, {
      onSuccess: () => {
        setOpen(false);
        setMessage("");
        toast.success("Pesan berhasil dikirim ke admin");
      },
      onError: () => {
        toast.error("Gagal mengirim pesan, coba lagi");
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <TabsLine
          tabs={tabs}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <IconMessage2 />
          Hubungi Admin
        </Button>
      </div>

      <Accordion className="w-full">
        {filtered.map((item, index) => (
          <AccordionItem key={index} value={`${item.category}-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hubungi Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Tulis pesan Anda dan admin akan segera merespons melalui sistem
              notifikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Tulis pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessage("")}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSend}
              disabled={isPending || !message.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Mengirim..." : "Kirim"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
