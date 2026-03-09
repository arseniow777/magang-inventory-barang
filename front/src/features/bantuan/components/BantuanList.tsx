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
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TabsLine } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { IconMessage2 } from "@tabler/icons-react";

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
      "Sistem ini dapat diakses oleh dua peran utama dengan wewenang yang berbeda. PIC (Petugas) bertugas untuk membuat permintaan dan melaporkan perubahan status barang, sementara Admin memiliki kendali penuh untuk mengelola data master, menyetujui permintaan, serta mengatur akun pengguna. Sementara user biasa hanya dapat melihat data barang dan lokasi tanpa akses untuk melakukan perubahan.",
  },
  {
    category: "umum",
    question: "Apa saja fitur unggulan yang tersedia di dalam sistem?",
    answer:
      "Kami menyediakan fitur komprehensif yang mencakup manajemen data master barang dan unit, pelacakan lokasi penyimpanan, sistem pengajuan permintaan status barang, serta fitur keamanan seperti riwayat audit (log aktivitas) dan pelacakan barang berbasis QR Code. Selain itu sistem ini juga terintegrasi dengan telegram untuk memberikan notifikasi real-time kepada pengguna terkait status permintaan dan perubahan data barang.",
  },
  {
    category: "umum",
    question:
      "Bagaimana cara mendapatkan bantuan jika saya mengalami kendala teknis?",
    answer:
      "Jika Anda menemukan kendala saat menggunakan sistem, silakan hubungi Admin Sistem kami melalui tombol yang tertera pada halaman Bantuan. user juga dapat mengirimkan pesan langsung kepada admin melalui fitur telegram.",
  },
  {
    category: "akses",
    question: "Bagaimana langkah-langkah untuk masuk (login) ke dalam sistem?",
    answer:
      "Silakan buka halaman login, masukkan username dan kata sandi yang telah terdaftar, lalu klik tombol Login. Jika data yang dimasukkan sesuai, Anda dapat melakukan scan barcode untuk menghubungkan akun anda dengan telegram, setelah itu anda akan langsung diarahkan ke halaman dashboard utama.",
  },
  {
    category: "akses",
    question: "Apa yang harus saya lakukan jika lupa kata sandi?",
    answer:
      "Anda dapat menekan tombol 'Lupa Kata Sandi' pada halaman login, kemudian anda akan diarahkan menuju akun telegram untuk melakukan reset password melalui bot telegram, pastikan untuk mengikuti instruksi yang diberikan oleh bot untuk menyelesaikan proses reset password.",
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
      "Hanya pengguna dengan peran Admin yang dapat menambahkan barang melalui menu Barang, kemudian memilih Tambah Barang. Pastikan Anda mengisi detail informasi seperti nama, lokasi, kategori, serta mengunggah foto barang jika diperlukan sebelum menyimpan data. Pastikan juga untuk menambahkan daftar lokasi terlebih dahulu sebelum menambahkan barang",
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
      "Kondisi barang dibagi menjadi tiga kategori utama: Baik untuk unit yang tidak memiliki kerusakan, Rusak untuk unit dengan kendala minor namun masih berfungsi, dan Tidak Berfungsi untuk unit yang sudah tidak dapat digunakan lagi.",
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
    question:
      "Bagaimana prosedur pengembalian barang yang telah selesai dipinjam?",
    answer:
      "Untuk mengembalikan barang, silakan akses menu permintaan, cari data peminjaman yang aktif, lalu klik tombol Kembalikan. Setelah Anda mengonfirmasi lokasi pengembalian, status barang akan otomatis kembali menjadi Tersedia.",
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
  {
    category: "telegram",
    question: "Bagaimana cara menghubungkan akun dengan Telegram?",
    answer:
      "Setelah berhasil login, Anda akan diarahkan untuk melakukan scan QR Code menggunakan aplikasi Telegram. Pastikan Anda sudah memiliki aplikasi Telegram di smartphone dan ikuti instruksi yang diberikan untuk menyelesaikan proses penghubungan akun.",
  },
  {
    category: "telegram",
    question: "Apa saja notifikasi yang akan saya terima melalui Telegram?",
    answer:
      "Anda akan menerima notifikasi real-time terkait status permintaan yang Anda ajukan, perubahan data barang yang relevan dengan aktivitas Anda, serta pengumuman penting dari admin untuk memastikan Anda selalu mendapatkan informasi terbaru.",
  },
  {
    category: "telegram",
    question:
      "Apakah saya bisa mengirim pesan langsung ke admin melalui Telegram?",
    answer:
      "Ya, Anda dapat mengirim pesan langsung kepada admin melalui fitur Telegram yang tersedia di dalam aplikasi. Pesan Anda akan diteruskan ke admin dan mereka akan merespons secepat mungkin untuk membantu menyelesaikan masalah atau menjawab pertanyaan Anda.",
  },
  {
    category: "telegram",
    question: "Bagaimana jika saya tidak menerima notifikasi di Telegram?",
    answer:
      "Pastikan Anda sudah menghubungkan akun dengan Telegram dan memeriksa pengaturan notifikasi di aplikasi Telegram untuk memastikan bahwa notifikasi dari sistem kami tidak diblokir atau masuk ke folder spam.",
  },
  {
    category: "telegram",
    question: "Apa saja menu yang dapat diaskses melalui Telegram?",
    answer:
      "Melalui Telegram, Anda dapat mengakses menu utama seperti melihat profil pengguna, request terakhir, berita acara terakhir, return barang, ganti password, hubungi admin, disconnect akun, akses website, serta user dapat melakukan checking barang dengan mengetikan nama barang pada telegram bot, setelah itu bot akan memberikan informasi terkait barang tersebut seperti jumlah unit, kondisi, dan lokasi penyimpanan.",
  },
];

const tabs = [
  { value: "all", label: "Semua" },
  { value: "umum", label: "Umum" },
  { value: "akses", label: "Akses" },
  { value: "barang", label: "Barang" },
  { value: "permintaan", label: "Permintaan" },
  { value: "lokasi", label: "Lokasi" },
  { value: "telegram", label: "Telegram" },
];

export default function BantuanList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return faqData;
    return faqData.filter((f) => f.category === activeCategory);
  }, [activeCategory]);

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
              Silahkan hubungi admin melalui Telegram dengan memilih menu{" "}
              <span className="font-semibold text-foreground">
                Hubungi Admin
              </span>{" "}
              pada bot dan ikuti alurnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
