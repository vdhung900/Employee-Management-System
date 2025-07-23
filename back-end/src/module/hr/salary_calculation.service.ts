import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {SalarySlip, SalarySlipDocument} from '../../schemas/salarySlip.schema';
import { Employees } from '../../schemas/employees.schema';
import { AttendanceRecords } from '../../schemas/attendanceRecords.schema';
import { SalaryCoefficient } from '../../schemas/salaryCoefficents.schema';
import { SalaryRank } from '../../schemas/salaryRank.schema';
import { Benefits } from '../../schemas/benefits.schema';
import puppeteer from "puppeteer";
import * as path from "node:path";
import * as fs from "node:fs";
import * as Mustache from "mustache";
import {SalaryPreviewDto} from "./dto/salaryPreview.dto";
import {formatNumber, numberToVietnameseCurrency} from "../../utils/format";
import * as crypto from 'crypto';
import {PDFDocument} from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
import {base64ToMulterFile} from "../../utils/transfer";
import {UploadService} from "../minio/minio.service";
import {Documents, DocumentsDocument} from "../../schemas/documents.schema";
import {Requests, RequestsDocument} from "../../schemas/requests.schema";
import {STATUS} from "../../enum/status.enum";

@Injectable()
export class SalaryCalculationService {
  private readonly logger = new Logger(SalaryCalculationService.name);
  private readonly BATCH_SIZE = 100;

  constructor(
    @InjectModel(SalarySlip.name) private salarySlipModel: Model<SalarySlipDocument>,
    @InjectModel(Employees.name) private employeeModel: Model<Employees>,
    @InjectModel(AttendanceRecords.name) private attendanceModel: Model<AttendanceRecords>,
    @InjectModel(SalaryCoefficient.name) private coefModel: Model<SalaryCoefficient>,
    @InjectModel(SalaryRank.name) private rankModel: Model<SalaryRank>,
    @InjectModel(Benefits.name) private benefitModel: Model<Benefits>,
    @InjectModel(Documents.name) private documentModel: Model<DocumentsDocument>,
    @InjectModel(Requests.name) private requestModel: Model<RequestsDocument>,
    private readonly uploadService: UploadService
  ) {}

  @Cron('0 59 23 L * *') // 23:59 ngày cuối cùng mỗi tháng
  async handleSalaryCalculation() {
    this.logger.log('Bắt đầu tính lương tự động cuối tháng...');
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Lấy toàn bộ nhân viên còn làm việc
    const employees = await this.employeeModel.find({}).exec();
    for (let i = 0; i < employees.length; i += this.BATCH_SIZE) {
      const batch = employees.slice(i, i + this.BATCH_SIZE);
      try {
        // Gom trước các id cần thiết
        const empIds = batch.map(e => e._id);
        // Lấy hệ số lương cho batch
        const coefs = await this.coefModel.find({ _id: { $in: batch.map(e => e.salaryCoefficientId) } });
        // Lấy bậc lương cho batch
        const rankIds = coefs.map(c => c.salary_rankId);
        const ranks = await this.rankModel.find({ _id: { $in: rankIds } });
        // Lấy chấm công cho batch
        const attendances = await this.attendanceModel.find({
          employeeId: { $in: empIds },
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0, 23, 59, 59),
          },
        });
        // Map dữ liệu cho dễ truy xuất
        const coefMap = new Map(coefs.map(c => [String(c._id), c]));
        const rankMap = new Map(ranks.map(r => [String(r._id), r]));
        const attMap = new Map();
        for (const att of attendances) {
          const key = att.employeeId.toString();
          if (!attMap.has(key)) attMap.set(key, []);
          attMap.get(key).push(att);
        }
        // Tính lương song song trong batch
        await Promise.all(batch.map(emp => this.calculateSalaryForEmployee(emp, coefMap, rankMap, attMap, month, year)));
      } catch (err) {
        this.logger.error(`Lỗi khi tính lương batch ${i} - ${i + this.BATCH_SIZE}:`, err);
      }
    }
    this.logger.log('Tính lương tự động hoàn tất!');
  }

  // Hàm tính lương cho 1 nhân viên
  private async calculateSalaryForEmployee(
    emp: any,
    coefMap: Map<string, any>,
    rankMap: Map<string, any>,
    attMap: Map<string, any[]>,
    month: number,
    year: number
  ) {
    try {
      const coef = coefMap.get(emp.salaryCoefficientId?.toString());
      if (!coef) return;
      const rank = rankMap.get(coef.salary_rankId?.toString());
      if (!rank) return;
      const baseSalary = rank.salary_base;
      const salaryCoefficient = coef.salary_coefficient;
      let totalBaseSalary = Math.round(baseSalary * salaryCoefficient);
      // Lấy attendance records trong tháng
      const attendances = attMap.get(emp._id.toString()) || [];
      // Tính nghỉ không phép
      const unpaidLeaveCount = attendances.filter(a => a.isPaid === false).length;
      const unpaidLeave = Math.round((totalBaseSalary / 22) * unpaidLeaveCount);

      // Phạt đi muộn/về sớm
      let cntLatePenalty = 0;
      for (const a of attendances) {
        if (a.status === STATUS.LATE) {
          cntLatePenalty++;
        }
      }
      const latePenalty = cntLatePenalty * 20000;

      // Hàm tính tổng số giờ OT từ mảng overtimeRange
      function getTotalOtHours(overtimeRange: string[]): number {
        let total = 0;
        for (const range of (overtimeRange || [])) {
          const [start, end] = range.split('-');
          if (start && end) {
            const [sh, sm] = start.split(':').map(Number);
            const [eh, em] = end.split(':').map(Number);
            const startMinutes = sh * 60 + sm;
            const endMinutes = eh * 60 + em;
            total += (endMinutes - startMinutes) / 60;
          }
        }
        return total;
      }

      // Tính OT ngày thường và cuối tuần
      let otWeekday = 0, otWeekend = 0;
      let otWeekdayHour = 0, otWeekendHour = 0;
      let totalOtHour = 0;
      for (const a of attendances) {
        if (a.status === 'overtime' || a.isOvertime) {
          const otHours = Math.round(getTotalOtHours(a.overtimeRange));
          totalOtHour += otHours;
          const date = new Date(a.date);
          const day = date.getDay();
          if (day === 0 || day === 6) {
            otWeekend += Math.round((totalBaseSalary / 166) * 2 * otHours); // 200%
            otWeekendHour += otHours;
          } else {
            otWeekday += Math.round((totalBaseSalary / 166) * 1.5 * otHours); // 150%
            otWeekdayHour += otHours;
          }
        }
      }
      const totalOtAmount = Math.round(otWeekday + otWeekend);

      // === LẤY BENEFIT THEO EMPLOYEE HOẶC DEPARTMENT ===
      // Lưu ý: cần khai báo benefitModel ở constructor và import model Benefit
      const benefits = await (this as any).benefitModel.find({
        departments: emp.departmentId
      });
      
      // Tổng tiền thưởng benefit (không loại bỏ trùng)
      const totalBenefit = Math.round(benefits.reduce((sum, b) => sum + (b.amount || 0), 0));

      // Tổng các khoản trước bảo hiểm
      const totalTaxableIncome = Math.round(totalBaseSalary - unpaidLeave - latePenalty + totalOtAmount + totalBenefit);

      // Bảo hiểm xã hôij
      const socialInsurance = Math.round(totalBaseSalary * 0.08);
      // Bảo hiểm y tế
      const healthInsurance = Math.round(totalBaseSalary * 0.015);
      // Bảo hiểm thất nghiệp
      const unemploymentInsurance = Math.round(totalBaseSalary * 0.01);
      // Tiền bảo hiểm
      const totalInsurance = Math.round(socialInsurance + healthInsurance + unemploymentInsurance);

      // Lấy số người phụ thuộc
      const numDependents = emp.childDependents ? Number(emp.childDependents) : 0;
      // Giảm trừ gia cảnh và người phụ thuộc
      const totalFamilyDeduction = Math.round(11000000 + numDependents * 4400000);

      // Thu nhập chịu thuế
      const taxableIncome = Math.round(totalTaxableIncome - totalFamilyDeduction - totalInsurance);

      // Thuế TNCN (áp dụng biểu thuế lũy tiến từng phần)
      let personalIncomeTax = 0;
      if (taxableIncome > 0) {
        if (taxableIncome <= 5000000) personalIncomeTax = Math.round(taxableIncome * 0.05);
        else if (taxableIncome <= 10000000) personalIncomeTax = Math.round(250000 + (taxableIncome - 5000000) * 0.1);
        else if (taxableIncome <= 18000000) personalIncomeTax = Math.round(750000 + (taxableIncome - 10000000) * 0.15);
        else if (taxableIncome <= 32000000) personalIncomeTax = Math.round(1950000 + (taxableIncome - 18000000) * 0.2);
        else if (taxableIncome <= 52000000) personalIncomeTax = Math.round(4750000 + (taxableIncome - 32000000) * 0.25);
        else if (taxableIncome <= 80000000) personalIncomeTax = Math.round(9750000 + (taxableIncome - 52000000) * 0.3);
        else personalIncomeTax = Math.round(18150000 + (taxableIncome - 80000000) * 0.35);
      }

      // Tổng lương thực nhận
      const netSalary = Math.round(totalTaxableIncome - totalInsurance - personalIncomeTax);

      totalBaseSalary = Math.round(totalBaseSalary - unpaidLeave);

      // Lưu vào salarySlip: update nếu đã có, insert nếu chưa có
      await this.salarySlipModel.updateOne(
        { employeeId: emp._id, month, year },
        {
          $set: {
            employeeId: emp._id,
            month,
            year,
            baseSalary,// Lương cơ bản
            salaryCoefficient,// Hệ số lương
            totalBaseSalary,// Tổng lương cơ bản
            otWeekdayHour, //Tổng số giờ OT ngày thường
            otWeekendHour, //Tổng số giờ OT cuối tuần
            otWeekday,// Tổng tiền OT ngày thường
            otWeekend,// Tổng tiền OT cuối tuần
            otHoliday: 0, // Không tính ngày lễ
            totalOtHour, // Tổng số giờ OT
            totalOtSalary: totalOtAmount, // Tổng tiền OT
            socialInsurance, //Tiền bảo hiểm xã hội
            healthInsurance, //Tiền bảo hiểm y tế
            unemploymentInsurance, //Tiền bảo hiểm thất nghiệp
            totalInsurance, // Tổng tiền bảo hiểm
            unpaidLeaveCount, //Số lần nghỉ không phép
            unpaidLeave,// Tiền nghỉ không phép
            benefit: totalBenefit, // Tổng benefit cộng vào
            numDependents, //Số người phụ thuộc
            familyDeduction: totalFamilyDeduction, //Giảm trừ gia cảnh
            personalIncomeTax, //Thuế TNCN
            netSalary, //Lương thực nhận
            cntLatePenalty, //Số lần đi muộn
            latePenalty, //Tiền phạt đi muộn
            totalTaxableIncome, //Tổng thu nhập chịu thuế
            status: '00',
          },
        },
        { upsert: true }
      );
    } catch (err) {
      this.logger.error(`Lỗi tính lương cho nhân viên ${emp.fullName}:`, err);
    }
  }

  async getSalarySlipByMonth (month: string) {
    try{
      const monthDate = new Date(month);
      const year = monthDate.getFullYear();
      const monthNumber = monthDate.getMonth() + 1; // thang trong js la 0 - 11
      const salarySlips = await this.salarySlipModel.find({month: monthNumber, year: year}).populate("employeeId", "fullName").exec();
      if(salarySlips.length === 0 || !salarySlips) {
        throw new Error('Chưa có dữ liệu lương cho tháng này');
      }
      return salarySlips;
    }catch (e) {
      throw e;
    }
  }

  // Lấy tất cả salarySlip theo employeeId
  async getSalarySlipsByEmployee(employeeId: string) {
    return this.salarySlipModel.find({ employeeId: new Types.ObjectId(employeeId) }).sort({ year: -1, month: -1 }).exec();
  }

  // Lấy salarySlip theo id
  async getSalarySlipById(id: string) {
    return this.salarySlipModel.findById(id).exec();
  }

  // Lấy tất cả salarySlip của tất cả nhân viên
  async getAllSalarySlips() {
    return this.salarySlipModel.find()
      .populate({
        path: 'employeeId',
        model: 'Employees',
        select: 'fullName code email phone departmentId positionId'
      })
      .sort({ year: -1, month: -1, createdAt: -1 })
      .exec();
  }

  // Lấy salarySlip theo departmentId
  async getSalarySlipsByDepartment(departmentId: string) {
    return this.salarySlipModel.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $match: {
          'employee.departmentId': new Types.ObjectId(departmentId)
        }
      },
      {
        $sort: {
          year: -1,
          month: -1,
          createdAt: -1
        }
      }
    ]).exec();
  }

  async generatePdfBase64(month: string){
    try{
      let checkDataTable = false;
      let dataPreview = {} as SalaryPreviewDto;
      dataPreview.unitName = "Công ty TNHH MTV F";
      dataPreview.department= "Phòng hành chính - nhân sự";
      const monthDate = new Date(month);
      dataPreview.month = monthDate.getMonth() + 1;
      dataPreview.year = monthDate.getFullYear();
      const dataSal = await this.getSalarySlipByMonth(month);
      if(dataSal.length > 0){
        checkDataTable = true;
      }
      const formattedSalarys = dataSal.map((slip, index) => ({
        stt: index + 1,
        employeeId: slip.employeeId,
        month: slip.month,
        year: slip.year,
        status: slip.status,
        baseSalary: formatNumber(slip.baseSalary),
        totalBaseSalary: formatNumber(slip.totalBaseSalary),
        salaryCoefficient: formatNumber(slip.salaryCoefficient),
        unpaidLeave: formatNumber(slip.unpaidLeave),
        latePenalty: formatNumber(slip.latePenalty),
        otWeekday: formatNumber(slip.otWeekday),
        otWeekend: formatNumber(slip.otWeekend),
        otHoliday: formatNumber(slip.otHoliday),
        insurance: formatNumber(slip.totalInsurance),
        personalIncomeTax: formatNumber(slip.personalIncomeTax),
        familyDeduction: formatNumber(slip.familyDeduction),
        netSalary: formatNumber(slip.netSalary),
        totalOtSalary: formatNumber(slip.totalOtSalary),
        totalOtHour: formatNumber(slip.totalOtHour),
        totalTaxableIncome: formatNumber(slip.totalTaxableIncome),
        benefit: formatNumber(slip.benefit),
      })) as any;
      dataPreview.salarys = formattedSalarys;
      let totalSalary = 0;
      let totalBasicSalaryAll = 0;
      let totalPositionSalary = 0;
      let totalFamilyDeduction = 0;
      let totalAllowance = 0;
      let totalOTDaily = 0;
      let totalOTWeekend = 0;
      let totalOTHoliday = 0;
      let totalBhxh = 0;
      let totalBhyt = 0;
      let totalBhtn = 0;
      let totalTax = 0;
      dataSal.forEach((salary) => {
        totalSalary += salary.netSalary || 0;
        totalBasicSalaryAll += salary.baseSalary || 0;
        totalPositionSalary += salary.totalBaseSalary || 0;
        totalFamilyDeduction += salary.familyDeduction || 0;
        totalAllowance += salary.benefit || 0;
        totalTax += salary.personalIncomeTax || 0;
      })
      dataPreview.totalInWords = numberToVietnameseCurrency(totalSalary);
      dataPreview.totalSalary = formatNumber(totalSalary);
      dataPreview.totalPositionSalary = formatNumber(totalPositionSalary);
      dataPreview.totalFamilyDeduction = formatNumber(totalFamilyDeduction);
      dataPreview.totalAllowance = formatNumber(totalAllowance);
      dataPreview.totalOTDaily = formatNumber(totalOTDaily);
      dataPreview.totalOTWeekend = formatNumber(totalOTWeekend);
      dataPreview.totalOTHoliday = formatNumber(totalOTHoliday);
      dataPreview.totalBhxh = formatNumber(totalBhxh);
      dataPreview.totalBhyt = formatNumber(totalBhyt);
      dataPreview.totalBhtn = formatNumber(totalBhtn);
      dataPreview.totalTax = formatNumber(totalTax);
      const dateSign = new Date();
      dataPreview.signDay = dateSign.getDay();
      dataPreview.signMonth = dateSign.getMonth() + 1;
      dataPreview.signYear = dateSign.getFullYear();
      const rawData = JSON.stringify(dataPreview);
      const hash = crypto.createHash('sha256').update(rawData).digest('hex');
      const templatePath = path.join(process.cwd(), "templates", "bang_luong.html");
      const templateHtml = fs.readFileSync(templatePath, "utf8");
      const html = Mustache.render(templateHtml, dataPreview);
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        landscape: true,
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" }
      });

      await browser.close();

      return {
        pdfPreview: Buffer.from(pdfBuffer).toString("base64"),
        dataTable: checkDataTable,
        pdfHash: hash
      }
    }catch (e) {
      throw e;
    }
  }

  async findTextPosition(pdfBuffer, searchText) {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      for (const item of textContent.items) {
        if (item.str && item.str.includes(searchText)) {
          return {
            pageIndex: i - 1, // pdf-lib dùng index từ 0
            x: item.transform[4],
            y: item.transform[5]
          };
        }
      }
    }
    return null;
  }

  async signSalarySlip(month: string, signatureImage: string, originalHash: string) {
    try {
      const { pdfPreview, pdfHash } = await this.generatePdfBase64(month);
      const pdfBuffer = Buffer.from(pdfPreview, 'base64');
      const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      if (pdfHash !== originalHash) {
        throw new BadRequestException('PDF đã bị sửa trước khi ký');
      }
      const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
      const firstPage = pdfDoc.getPages()[0];
      const sigBytes = Uint8Array.from(Buffer.from(signatureImage, 'base64'));
      const pngImage = await pdfDoc.embedPng(sigBytes);
      const pngDims = pngImage.scale(0.4);
      const { width, height } = firstPage.getSize();
      const pos = await this.findTextPosition(pdfBuffer, 'Người làm đơn');
      let targetPage = firstPage;
      const offsetY = 10;
      const offsetX = 30;
      if (pos) {
        const allPages = pdfDoc.getPages();
        const targetPage = allPages[pos.pageIndex];
        targetPage.drawImage(pngImage, {
          x: pos.x - offsetX,
          y: pos.y - pngDims.height - offsetY,
          width: pngDims.width,
          height: pngDims.height,
        });
      } else {
        const firstPage = pdfDoc.getPages()[0];
        const { width } = firstPage.getSize();
        firstPage.drawImage(pngImage, {
          x: width - pngDims.width - 40,
          y: 40,
          width: pngDims.width,
          height: pngDims.height,
        });
      }
      const signedPdfBytes = await pdfDoc.save();
      const signedPdfBase64 = Buffer.from(signedPdfBytes).toString('base64');

      const signedFile = base64ToMulterFile(
          signedPdfBase64,
          `bang-luong-thang-ky-${month}.pdf`
      );
      const uploadedFileInfo = await this.uploadService.uploadFile(signedFile, true);
      return {
        signFile: uploadedFileInfo
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async signSalarySlipByManage(requestId: string, signatureImage: string, status: string){
    try{
      const dataRequest = await this.requestModel.findById(new Types.ObjectId(requestId)).exec();
      if (!dataRequest || !dataRequest.attachments?.length) {
        throw new Error("No attachment found");
      }
      const dataDocument = await this.documentModel.findById(dataRequest?.attachments[0]).exec();
      if (!dataDocument) {
        throw new Error("Document not found");
      }
      const key = dataDocument.key;
      const pdfBuffer = await this.uploadService.getFileBuffer(key);
      const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
      const firstPage = pdfDoc.getPages()[0];
      const sigBytes = Uint8Array.from(Buffer.from(signatureImage, 'base64'));
      const pngImage = await pdfDoc.embedPng(sigBytes);
      const pngDims = pngImage.scale(0.4);
      const { width, height } = firstPage.getSize();
      const pos = await this.findTextPosition(pdfBuffer, 'Quản lý');
      let targetPage = firstPage;
      const offsetY = 10;
      const offsetX = 30;
      if (pos) {
        const allPages = pdfDoc.getPages();
        const targetPage = allPages[pos.pageIndex];
        targetPage.drawImage(pngImage, {
          x: pos.x - offsetX,
          y: pos.y - pngDims.height - offsetY,
          width: pngDims.width,
          height: pngDims.height,
        });
      } else {
        const firstPage = pdfDoc.getPages()[0];
        const { width } = firstPage.getSize();
        firstPage.drawImage(pngImage, {
          x: width - pngDims.width - 40,
          y: 40,
          width: pngDims.width,
          height: pngDims.height,
        });
      }
      const signedPdfBytes = await pdfDoc.save();
      const signedPdfBase64 = Buffer.from(signedPdfBytes).toString('base64');

      const success = await this.uploadService.uploadSignedPdf(key, signedPdfBytes);

      if(success){
        dataRequest.status = status;
        await dataRequest.save();
        return dataRequest;
      }else{
        dataRequest.status = STATUS.REJECTED;
        await dataRequest.save();
        throw new Error("Duyệt và ký số thất bại")
      }
    }catch (e) {
      console.error(e);
      throw e;
    }
  }
}