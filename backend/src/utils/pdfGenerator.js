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
        borrow: "BORROWING",
        transfer: "TRANSFER",
        sell: "SALE",
        demolish: "DEMOLITION"
      };

      doc.fontSize(16).font("Helvetica-Bold").text("OFFICIAL HANDOVER REPORT", { align: "center" });
      doc.fontSize(12).font("Helvetica").text(`Number: ${reportNumber}`, { align: "center" });
      doc.moveDown(2);

      doc.fontSize(11).font("Helvetica").text(
        `On this day, ${new Date(request.approved_at).toLocaleDateString("en-US", { 
          weekday: "long", year: "numeric", month: "long", day: "numeric" 
        })}, an inventory handover has been conducted with the following details:`,
        { align: "justify" }
      );
      doc.moveDown(1);

      doc.fontSize(12).font("Helvetica-Bold").text("I. APPLICANT DATA");
      doc.fontSize(10).font("Helvetica");
      doc.text(`Name: ${request.pic.name}`);
      doc.text(`Employee ID: ${request.pic.employee_id}`);
      doc.text(`Role: ${request.pic.role.toUpperCase()}`);
      doc.moveDown(1);

      doc.fontSize(12).font("Helvetica-Bold").text("II. REQUEST INFORMATION");
      doc.fontSize(10).font("Helvetica");
      doc.text(`Type: ${typeMap[request.request_type]}`);
      doc.text(`Request Number: ${request.request_code}`);
      doc.text(`Request Date: ${new Date(request.created_at).toLocaleDateString("en-US")}`);
      doc.text(`Approval Date: ${new Date(request.approved_at).toLocaleDateString("en-US")}`);
      if (request.destination_location) {
        doc.text(`Destination: ${request.destination_location.building_name} - Floor ${request.destination_location.floor}`);
      }
      doc.moveDown(1);

      doc.fontSize(12).font("Helvetica-Bold").text("III. ITEM DETAILS");
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const colWidths = [30, 120, 80, 100, 60, 80];
      const headers = ["No", "Item Name", "Model Code", "Unit Code", "Condition", "Origin Location"];

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
          `${item.unit.location.building_name} Fl.${item.unit.location.floor}`
        ];

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPos, { width: colWidths[i], align: "left" });
          xPos += colWidths[i];
        });

        yPos += 20;
      });

      doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
      yPos += 15;

      doc.fontSize(12).font("Helvetica-Bold").text("IV. NOTES", 50, yPos);
      yPos += 20;
      doc.fontSize(10).font("Helvetica").text(`Reason: ${request.reason}`, 50, yPos, { align: "justify" });
      yPos += 40;

      doc.fontSize(10).font("Helvetica").text(
        "This official report is made to be used as necessary.",
        50,
        yPos,
        { align: "justify" }
      );
      yPos += 40;

      doc.fontSize(10).font("Helvetica-Bold").text("Approved by,", 400, yPos);
      yPos += 60;
      doc.fontSize(10).font("Helvetica-Bold").text(request.admin.name, 400, yPos);
      doc.fontSize(9).font("Helvetica").text(`(${request.admin.role.toUpperCase()})`, 400, yPos + 15);

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