// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true nếu dùng port 465
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendMail(to: string, fullName: string, username: string, password: string) {
        const htmlTemplate = this.getHtmlTemplate(fullName, username, password);
        const info = await this.transporter.sendMail({
            from: 'Hệ thống quản lý nhân sự',
            to,
            subject: '🎉 Chào mừng bạn đến với hệ thống!',
            html: htmlTemplate,
        });

        console.log('Email sent: %s', info.messageId);
    }

    async sendSalarySlipMail(to: string, fullName: string, slip: any) {
        const htmlTemplate = this.getSalarySlipHtmlTemplate(fullName, slip);
        const info = await this.transporter.sendMail({
            from: 'Hệ thống quản lý nhân sự',
            to,
            subject: `Bảng lương tháng ${slip.month}/${slip.year}`,
            html: htmlTemplate,
        });
        console.log('Salary slip email sent: %s', info.messageId);
    }

    private getHtmlTemplate(fullName: string, username: string, password: string): string {
        const createdDate = new Date().toLocaleDateString('vi-VN');

        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng bạn đến với chúng tôi!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .email-container {
            max-width: 600px;
            width: 100%;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.8s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            text-align: center;
            padding: 40px 30px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
        }

        .logo {
            font-size: 4rem;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }

        .header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            font-weight: 700;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 40px 30px;
            background: #ffffff;
        }

        .welcome-message {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome-message h2 {
            color: #1f2937;
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .welcome-message p {
            color: #6b7280;
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .user-name {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        .account-info {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }

        .account-info::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .account-info h3 {
            color: #1f2937;
            font-size: 1.4rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-item:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #374151;
            font-size: 0.95rem;
        }

        .info-value {
            font-family: 'Monaco', 'Menlo', monospace;
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            color: #1f2937;
            font-size: 0.9rem;
            max-width: 60%;
            word-break: break-all;
        }

        .copy-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8rem;
            margin-left: 8px;
            transition: all 0.3s ease;
        }

        .copy-btn:hover {
            background: #3730a3;
            transform: translateY(-1px);
        }

        .security-notice {
            background: linear-gradient(135deg, #fef3c7, #f59e0b);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #f59e0b;
        }

        .security-notice h4 {
            color: #92400e;
            font-size: 1.1rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .security-notice p {
            color: #92400e;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .btn {
            flex: 1;
            min-width: 200px;
            padding: 15px 25px;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
        }

        .btn-secondary {
            background: #ffffff;
            color: #4f46e5;
            border: 2px solid #4f46e5;
        }

        .btn-secondary:hover {
            background: #4f46e5;
            color: white;
            transform: translateY(-2px);
        }

        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            color: #6b7280;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 1.8rem;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .btn {
                min-width: auto;
            }
            
            .info-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .info-value {
                max-width: 100%;
            }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🎉</div>
            <h1>Chào mừng bạn!</h1>
            <p>Tài khoản của bạn đã được tạo thành công</p>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h2>Xin chào <span class="user-name" id="userName">${fullName}</span>!</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi. Dưới đây là thông tin đăng nhập của bạn:</p>
            </div>

            <div class="account-info">
                <h3>🔐 Thông tin tài khoản</h3>
                
                <div class="info-item">
                    <span class="info-label">Tên đăng nhập:</span>
                    <div>
                        <span class="info-value" id="username">${username}</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Mật khẩu:</span>
                    <div>
                        <span class="info-value" id="password">${password}</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Ngày tạo:</span>
                    <span class="info-value" id="createdDate">${createdDate}</span>
                </div>
            </div>

            <div class="security-notice">
                <h4>🔒 Lưu ý bảo mật</h4>
                <p>Vui lòng đổi mật khẩu ngay sau lần đăng nhập đầu tiên để đảm bảo an toàn cho tài khoản của bạn. Không chia sẻ thông tin đăng nhập với bất kỳ ai.</p>
            </div>
        </div>

        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <strong>employee.system.work@gmail.com</strong></p>
            <p>Hoặc gọi hotline: <strong>1900-9999</strong></p>
        </div>
    </div>
</body>
</html>`
    }

    private getSalarySlipHtmlTemplate(fullName: string, slip: any): string {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bảng lương tháng ${slip.month}/${slip.year}</title>
</head>
<body>
    <h2>Xin chào ${fullName},</h2>
    <p>Bạn nhận được bảng lương tháng <b>${slip.month}/${slip.year}</b>:</p>
    <table border="1" cellpadding="8" style="border-collapse:collapse;">
        <tr><th>Mục</th><th>Giá trị</th></tr>
        <tr><td>Lương cơ bản</td><td>${slip.baseSalary?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Hệ số lương</td><td>${slip.salaryCoefficient || 0}</td></tr>
        <tr><td>Tổng lương cơ bản</td><td>${slip.totalBaseSalary?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Phép không lương</td><td>${slip.unpaidLeave?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Phạt đi muộn/về sớm</td><td>${slip.latePenalty?.toLocaleString() || 0} VND</td></tr>
        <tr><td>OT ngày thường</td><td>${slip.otWeekday?.toLocaleString() || 0} VND</td></tr>
        <tr><td>OT cuối tuần</td><td>${slip.otWeekend?.toLocaleString() || 0} VND</td></tr>
        <tr><td>OT ngày lễ</td><td>${slip.otHoliday?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Bảo hiểm</td><td>${slip.insurance?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Thuế TNCN</td><td>${slip.personalIncomeTax?.toLocaleString() || 0} VND</td></tr>
        <tr><td>Giảm trừ gia cảnh</td><td>${slip.familyDeduction?.toLocaleString() || 0} VND</td></tr>
        <tr><td><b>Tổng lương thực nhận</b></td><td><b>${slip.totalSalary?.toLocaleString() || 0} VND</b></td></tr>
    </table>
    <p>Nếu có thắc mắc về bảng lương, vui lòng liên hệ phòng nhân sự.</p>
    <p>Trân trọng,<br/>Phòng Nhân sự</p>
</body>
</html>`;
    }
}
