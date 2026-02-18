import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateOfficialReport = async (request, reportNumber) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `${reportNumber}.pdf`;
      const uploadDir = path.join(__dirname, "../../uploads/official-reports");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const typeMap = {
        borrow: "PEMINJAMAN",
        transfer: "TRANSFER",
        sell: "PENJUALAN",
        demolish: "PEMUSNAHAN"
      };

      // Header
      doc.fontSize(14).font("Helvetica-Bold").text("BERITA ACARA SERAH TERIMA BARANG INVENTARIS", { align: "center" });
      doc.fontSize(11).font("Helvetica").text(`Nomor: ${reportNumber}`, { align: "center" });
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Pembuka
      const approvedDate = new Date(request.approved_at);
      const dateStr = approvedDate.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });

      doc.fontSize(11).font("Helvetica").text(
        `Pada hari ini, ${dateStr}, yang bertanda tangan di bawah ini telah melaksanakan serah terima barang inventaris milik perusahaan. Berita acara ini dibuat sebagai bukti sah pelaksanaan ${typeMap[request.request_type].toLowerCase()} barang sesuai dengan ketentuan yang berlaku.`,
        { align: "justify" }
      );
      doc.moveDown(1.5);

      // I. Data Pemohon
      doc.fontSize(11).font("Helvetica-Bold").text("I.  DATA PEMOHON");
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Nama Lengkap`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${request.pic.name}`);
      doc.text(`NIP / ID Karyawan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${request.pic.employee_id}`);
      doc.text(`Jabatan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${request.pic.role.toUpperCase()}`);
      doc.moveDown(1);

      // II. Informasi Permohonan
      doc.fontSize(11).font("Helvetica-Bold").text("II.  INFORMASI PERMOHONAN");
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Jenis Permohonan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${typeMap[request.request_type]}`);
      doc.text(`Nomor Permohonan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${request.request_code}`);
      doc.text(`Tanggal Permohonan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${new Date(request.created_at).toLocaleDateString("id-ID")}`);
      doc.text(`Tanggal Persetujuan`, 60, doc.y, { continued: true, width: 150 });
      doc.text(`: ${new Date(request.approved_at).toLocaleDateString("id-ID")}`);
      if (request.destination_location) {
        doc.text(`Lokasi Tujuan`, 60, doc.y, { continued: true, width: 150 });
        doc.text(`: ${request.destination_location.building_name} - Lantai ${request.destination_location.floor}`);
      }
      doc.moveDown(1);

      // III. Daftar Barang
      doc.fontSize(11).font("Helvetica-Bold").text("III.  DAFTAR BARANG YANG DISERAHTERIMAKAN");
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const colWidths = [30, 130, 80, 100, 60, 90];
      const headers = ["No.", "Nama Barang", "Kode Model", "Kode Unit", "Kondisi", "Lokasi Asal"];

      doc.fontSize(9).font("Helvetica-Bold");
      let xPos = 50;
      headers.forEach((header, i) => {
        doc.text(header, xPos, tableTop, { width: colWidths[i], align: "left" });
        xPos += colWidths[i];
      });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      doc.font("Helvetica").fontSize(8);
      let yPos = tableTop + 20;

      request.request_items.forEach((item, index) => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        xPos = 50;
        const rowData = [
          (index + 1).toString(),
          item.unit.item.name,
          item.unit.item.model_code,
          item.unit.unit_code,
          item.unit.condition,
          `${item.unit.location.building_name} Lt.${item.unit.location.floor}`
        ];

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPos, { width: colWidths[i], align: "left" });
          xPos += colWidths[i];
        });

        yPos += 20;
      });

      doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
      yPos += 20;

      // IV. Keterangan
      doc.fontSize(11).font("Helvetica-Bold").text("IV.  KETERANGAN", 50, yPos);
      yPos += 18;
      doc.fontSize(10).font("Helvetica").text(`Alasan/Keperluan: ${request.reason}`, 50, yPos, { align: "justify", width: 500 });
      yPos += 40;

      // Penutup
      doc.fontSize(10).font("Helvetica").text(
        "Demikian berita acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Apabila di kemudian hari terdapat kekeliruan dalam berita acara ini, akan dilakukan perbaikan sebagaimana mestinya.",
        50, yPos, { align: "justify", width: 500 }
      );
      yPos += 50;

      // Tanda Tangan
      doc.fontSize(10).font("Helvetica").text("Mengetahui & Menyetujui,", 370, yPos);
      doc.text("Pemohon,", 60, yPos);
      yPos += 60;
      doc.font("Helvetica-Bold").text(request.pic.name, 60, yPos);
      doc.fontSize(9).font("Helvetica").text(`(${request.pic.role.toUpperCase()})`, 60, yPos + 14);
      doc.fontSize(10).font("Helvetica-Bold").text(request.admin.name, 370, yPos);
      doc.fontSize(9).font("Helvetica").text(`(${request.admin.role.toUpperCase()})`, 370, yPos + 14);

      doc.end();

      stream.on("finish", () => {
        resolve(`/uploads/official-reports/${fileName}`);
      });

      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};