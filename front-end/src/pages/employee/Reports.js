import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Tabs,
    Button,
    DatePicker,
    Select,
    Space,
    Table,
    Statistic,
    Progress,
    Divider
} from 'antd';
import {
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    FileExcelOutlined,
    FilterOutlined,
    AuditOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ThreeDContainer from '../../components/3d/ThreeDContainer';
import ReportService from '../../services/ReportService';
import * as XLSX from 'xlsx';
import {
    PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line
} from 'recharts';
import Hr_Employee from '../../services/Hr_Employee';
import RequestService from '../../services/RequestService';
import StatisticsService from '../../services/StatisticsService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const STAT_COLORS = ['#0088FE', '#FF69B4', '#00C49F'];
const STAT_AGE_COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1'];
const STAT_SALARY_COLORS = ['#52c41a', '#1890ff', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2'];
const STAT_SENIORITY_COLORS = ['#1976d2', '#52c41a', '#faad14', '#eb2f96', '#722ed1'];

function getStatAgeRange(dob) {
    if (!dob) return 'Không rõ';
    const birth = new Date(dob);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear();
    if (age < 18) return '<18';
    if (age <= 25) return '18-25';
    if (age <= 35) return '26-35';
    if (age <= 45) return '36-45';
    if (age <= 60) return '46-60';
    return 'Trên 60';
}
function getStatSalaryRange(salary) {
    if (salary < 10000000) return 'Dưới 10M';
    if (salary < 15000000) return '10M - 15M';
    if (salary < 20000000) return '15M - 20M';
    if (salary < 25000000) return '20M - 25M';
    if (salary < 30000000) return '25M - 30M';
    return 'Trên 30M';
}
function getSeniorityRange(joinDate) {
    if (!joinDate) return 'Không rõ';
    const join = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    if (years < 1) return '<1 năm';
    if (years <= 3) return '1-3 năm';
    if (years <= 6) return '4-6 năm';
    if (years <= 10) return '7-10 năm';
    return '>10 năm';
}

// Giả lập dữ liệu báo cáo nhân sự
const staffReportData = [
    { department: 'Engineering', total: 25, new: 3, leave: 1, male: 18, female: 7 },
    { department: 'Design', total: 12, new: 2, leave: 0, male: 5, female: 7 },
    { department: 'Management', total: 8, new: 0, leave: 1, male: 6, female: 2 },
    { department: 'Finance', total: 6, new: 1, leave: 0, male: 2, female: 4 },
    { department: 'Admin', total: 5, new: 0, leave: 0, male: 1, female: 4 },
    { department: 'Sales', total: 15, new: 2, leave: 1, male: 9, female: 6 },
    { department: 'Marketing', total: 10, new: 1, leave: 0, male: 3, female: 7 },
    { department: 'Customer Support', total: 8, new: 1, leave: 0, male: 3, female: 5 }
];

// Giả lập dữ liệu báo cáo tuyển dụng
const recruitmentReportData = [
    { month: 'T1/2023', applicants: 42, interviews: 15, hired: 3, positions: 4, cost: 15000000 },
    { month: 'T2/2023', applicants: 38, interviews: 12, hired: 2, positions: 3, cost: 12000000 },
    { month: 'T3/2023', applicants: 45, interviews: 18, hired: 4, positions: 5, cost: 18000000 },
    { month: 'T4/2023', applicants: 52, interviews: 20, hired: 5, positions: 6, cost: 22000000 },
    { month: 'T5/2023', applicants: 48, interviews: 22, hired: 4, positions: 4, cost: 20000000 },
    { month: 'T6/2023', applicants: 40, interviews: 16, hired: 3, positions: 3, cost: 16000000 }
];

// Giả lập dữ liệu báo cáo lương
const payrollReportData = [
    { month: 'T1/2023', totalSalary: 380000000, bonus: 25000000, deductions: 75000000, netPayment: 330000000 },
    { month: 'T2/2023', totalSalary: 385000000, bonus: 20000000, deductions: 76000000, netPayment: 329000000 },
    { month: 'T3/2023', totalSalary: 390000000, bonus: 30000000, deductions: 78000000, netPayment: 342000000 },
    { month: 'T4/2023', totalSalary: 395000000, bonus: 35000000, deductions: 80000000, netPayment: 350000000 },
    { month: 'T5/2023', totalSalary: 410000000, bonus: 40000000, deductions: 85000000, netPayment: 365000000 },
    { month: 'T6/2023', totalSalary: 420000000, bonus: 45000000, deductions: 90000000, netPayment: 375000000 }
];

// Giả lập dữ liệu báo cáo chấm công
const attendanceReportData = [
    { month: 'T1/2023', total: 89, onTime: 78, late: 8, absent: 3, leave: 11, overtime: 120 },
    { month: 'T2/2023', total: 85, onTime: 75, late: 7, absent: 3, leave: 9, overtime: 110 },
    { month: 'T3/2023', total: 90, onTime: 80, late: 6, absent: 4, leave: 8, overtime: 125 },
    { month: 'T4/2023', total: 87, onTime: 76, late: 9, absent: 2, leave: 10, overtime: 115 },
    { month: 'T5/2023', total: 92, onTime: 82, late: 7, absent: 3, leave: 7, overtime: 130 },
    { month: 'T6/2023', total: 88, onTime: 78, late: 8, absent: 2, leave: 12, overtime: 140 }
];

const Reports = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [dateRange, setDateRange] = useState([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [staffReportData, setStaffReportData] = useState([]);
    const [payrollReportData, setPayrollReportData] = useState([]);
    const [attendanceReportData, setAttendanceReportData] = useState([]);
    const [performanceReportData, setPerformanceReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Employee Statistics State
    const [statGenderData, setStatGenderData] = useState([]);
    const [statAgeData, setStatAgeData] = useState([]);
    const [statLeaveData, setStatLeaveData] = useState([]);
    const [statMonthlySalaryData, setStatMonthlySalaryData] = useState([]);
    const [statSalaryRangeData, setStatSalaryRangeData] = useState([]);
    const [statSeniorityData, setStatSeniorityData] = useState([]);
    const [statTotal, setStatTotal] = useState(0);
    const [statTotalLeaveRequests, setStatTotalLeaveRequests] = useState(0);
    const [statSelectedYear, setStatSelectedYear] = useState(new Date().getFullYear());
    const [statSelectedMonth, setStatSelectedMonth] = useState(null);
    const [statAvailableMonths, setStatAvailableMonths] = useState([]);
    const statCurrentYear = new Date().getFullYear();
    const statYearOptions = [];
    for (let year = statCurrentYear - 3; year <= statCurrentYear; year++) {
        statYearOptions.push(year);
    }

    // Thêm state cho bảng danh sách nghỉ phép
    const [selectedLeaveMonth, setSelectedLeaveMonth] = useState(null);
    const [leaveRequestsByMonth, setLeaveRequestsByMonth] = useState([]);
    const [leaveMonthOptions, setLeaveMonthOptions] = useState([]);
    // Thêm state cho leaveRequests để dùng toàn cục
    const [leaveRequests, setLeaveRequests] = useState([]);
    // Thêm state cho filter status
    const [leaveStatusFilter, setLeaveStatusFilter] = useState('ALL');

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            ReportService.getStaffReport(),
            ReportService.getPayrollReport(),
            ReportService.getAttendanceReport(),
            ReportService.getPerformanceReport()
        ]).then(([staff, payroll, attendance, performance]) => {
            setStaffReportData(staff?.data ?? []);
            setPayrollReportData(payroll?.data ?? []);
            setAttendanceReportData(attendance?.data ?? []);
            setPerformanceReportData(performance?.data ?? []);
        }).catch(e => {
            setError(e.message || 'Lỗi tải báo cáo');
        }).finally(() => setLoading(false));

        // Employee Statistics fetch
        const fetchStatData = async () => {
            try {
                // Employees
                const res = await Hr_Employee.getAllEmployee();
                const employees = Array.isArray(res.data) ? res.data : res;
                setStatTotal(employees.length);
                // Gender & Age
                const genderCount = { Nam: 0, Nữ: 0, Khác: 0 };
                const ageCount = { '<18': 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, 'Trên 60': 0, 'Không rõ': 0 };
                employees.forEach(emp => {
                    const gender = emp.gender || 'Khác';
                    if (gender === 'male' || gender === 'Nam') genderCount['Nam']++;
                    else if (gender === 'female' || gender === 'Nữ') genderCount['Nữ']++;
                    else genderCount['Khác']++;
                    const range = getStatAgeRange(emp.dob);
                    ageCount[range] = (ageCount[range] || 0) + 1;
                });
                setStatGenderData([
                    { name: 'Nam', value: genderCount['Nam'] },
                    { name: 'Nữ', value: genderCount['Nữ'] },
                    { name: 'Khác', value: genderCount['Khác'] },
                ]);
                setStatAgeData(Object.keys(ageCount).map((range, idx) => ({
                    ageRange: range,
                    count: ageCount[range],
                    fill: STAT_AGE_COLORS[idx % STAT_AGE_COLORS.length]
                })));
                // Leave requests
                const leaveRes = await RequestService.getAllLeaveRequests();
                const leaveRequestsData = Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes;
                setLeaveRequests(leaveRequestsData);
                setStatTotalLeaveRequests(leaveRequestsData.length);
                // Leave by month
                const monthCount = {};
                for (let i = 1; i <= 12; i++) monthCount[i] = 0;
                leaveRequestsData.forEach(request => {
                    if (request.dataReq && request.dataReq.startDate) {
                        const startDate = new Date(request.dataReq.startDate);
                        if (startDate.getFullYear() === statSelectedYear) {
                            const month = startDate.getMonth() + 1;
                            monthCount[month] = (monthCount[month] || 0) + 1;
                        }
                    }
                });
                const leaveDataByMonth = Object.keys(monthCount).map((month, idx) => ({
                    month: `Tháng ${month}`,
                    count: monthCount[month],
                    fill: STAT_SALARY_COLORS[idx % STAT_SALARY_COLORS.length]
                }));
                setStatLeaveData(leaveDataByMonth);
                // Salary slips
                const salaryRes = await StatisticsService.getAllSalarySlips();
                const salarySlips = Array.isArray(salaryRes.data) ? salaryRes.data : salaryRes;
                if (salarySlips.length > 0) {
                    // Months
                    const monthsSet = new Set();
                    salarySlips.forEach(slip => {
                        if (slip.month && slip.year) monthsSet.add(`${slip.month}/${slip.year}`);
                    });
                    const monthsList = Array.from(monthsSet).map(monthYear => {
                        const [month, year] = monthYear.split('/');
                        return { value: monthYear, label: `Tháng ${month}/${year}` };
                    }).sort((a, b) => {
                        const [aMonth, aYear] = a.value.split('/');
                        const [bMonth, bYear] = b.value.split('/');
                        return new Date(bYear, bMonth - 1) - new Date(aYear, aMonth - 1);
                    });
                    setStatAvailableMonths(monthsList);
                    if (!statSelectedMonth && monthsList.length > 0) setStatSelectedMonth(monthsList[0].value);
                    // Monthly salary table
                    const monthlyStats = {};
                    salarySlips.forEach(slip => {
                        const key = `${slip.month}/${slip.year}`;
                        if (!monthlyStats[key]) {
                            monthlyStats[key] = {
                                month: slip.month,
                                year: slip.year,
                                totalSalary: 0,
                                employeeCount: 0,
                                salaries: []
                            };
                        }
                        monthlyStats[key].totalSalary += slip.netSalary || 0;
                        monthlyStats[key].employeeCount += 1;
                        monthlyStats[key].salaries.push(slip.netSalary || 0);
                    });
                    const monthlyData = Object.values(monthlyStats).map(stat => ({
                        key: `${stat.month}/${stat.year}`,
                        month: `Tháng ${stat.month}/${stat.year}`,
                        totalSalary: stat.totalSalary,
                        avgSalary: Math.round(stat.totalSalary / stat.employeeCount),
                        employeeCount: stat.employeeCount,
                        maxSalary: Math.max(...stat.salaries),
                        minSalary: Math.min(...stat.salaries)
                    }));
                    monthlyData.sort((a, b) => {
                        const [aMonth, aYear] = a.key.split('/');
                        const [bMonth, bYear] = b.key.split('/');
                        return new Date(bYear, aMonth - 1) - new Date(aYear, bMonth - 1);
                    });
                    setStatMonthlySalaryData(monthlyData);
                    // Salary range for selected month
                    if (statSelectedMonth) {
                        const [selectedMonthNum, selectedYearNum] = statSelectedMonth.split('/');
                        const filteredSlips = salarySlips.filter(slip => slip.month == selectedMonthNum && slip.year == selectedYearNum);
                        if (filteredSlips.length > 0) {
                            const salaryRanges = {
                                'Dưới 10M': 0,
                                '10M - 15M': 0,
                                '15M - 20M': 0,
                                '20M - 25M': 0,
                                '25M - 30M': 0,
                                'Trên 30M': 0
                            };
                            filteredSlips.forEach(slip => {
                                const salary = slip.netSalary || 0;
                                const range = getStatSalaryRange(salary);
                                salaryRanges[range]++;
                            });
                            const rangeData = Object.keys(salaryRanges).map((range, idx) => ({
                                range,
                                count: salaryRanges[range],
                                fill: STAT_SALARY_COLORS[idx % STAT_SALARY_COLORS.length]
                            }));
                            setStatSalaryRangeData(rangeData);
                        }
                    }
                }
                // Seniority
                const seniorityCount = { '<1 năm': 0, '1-3 năm': 0, '4-6 năm': 0, '7-10 năm': 0, '>10 năm': 0, 'Không rõ': 0 };
                employees.forEach(emp => {
                    const range = getSeniorityRange(emp.joinDate);
                    seniorityCount[range] = (seniorityCount[range] || 0) + 1;
                });
                setStatSeniorityData(Object.keys(seniorityCount).map((range, idx) => ({
                    range,
                    count: seniorityCount[range],
                    fill: STAT_SENIORITY_COLORS[idx % STAT_SENIORITY_COLORS.length]
                })));
            } catch (err) {
                // ignore error for now
            }
        };
        fetchStatData();
    }, [statSelectedYear, statSelectedMonth]);

    // Cập nhật leaveMonthOptions theo statLeaveData và statSelectedYear
    useEffect(() => {
        if (Array.isArray(statLeaveData)) {
            const monthArr = statLeaveData.map(d => {
                const m = d.month.match(/Tháng (\d+)/);
                return m ? { value: m[1], label: d.month } : null;
            }).filter(Boolean);
            // Thêm option 'Tất cả các tháng'
            monthArr.unshift({ value: 'ALL', label: 'Tất cả các tháng' });
            setLeaveMonthOptions(monthArr);
            if (!selectedLeaveMonth && monthArr.length > 0) setSelectedLeaveMonth('ALL');
        }
    }, [statLeaveData, statSelectedYear]);

    useEffect(() => {
        // Lọc đơn nghỉ phép theo tháng được chọn và năm đang chọn
        if (Array.isArray(leaveRequests) && selectedLeaveMonth) {
            const filtered = leaveRequests.filter(req => {
                if (req.dataReq && req.dataReq.startDate) {
                    const d = new Date(req.dataReq.startDate);
                    if (d.getFullYear() !== statSelectedYear) return false;
                    if (selectedLeaveMonth === 'ALL') return true;
                    return d.getMonth() + 1 == selectedLeaveMonth;
                }
                return false;
            });
            setLeaveRequestsByMonth(filtered);
        }
    }, [leaveRequests, selectedLeaveMonth, statSelectedYear]);

    // Columns cho bảng báo cáo nhân sự
    const staffColumns = [
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Tổng nhân viên',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Nhân viên mới',
            dataIndex: 'new',
            key: 'new',
            render: (value) => <span style={{ color: '#52c41a' }}>{value}</span>,
            sorter: (a, b) => a.new - b.new,
        },
        {
            title: 'Nghỉ việc',
            dataIndex: 'leave',
            key: 'leave',
            render: (value) => <span style={{ color: '#ff4d4f' }}>{value}</span>,
            sorter: (a, b) => a.leave - b.leave,
        },
        {
            title: 'Nam',
            dataIndex: 'male',
            key: 'male',
        },
        {
            title: 'Nữ',
            dataIndex: 'female',
            key: 'female',
        },
        {
            title: 'Tỷ lệ nam/nữ',
            key: 'gender_ratio',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.male / record.total) * 100)}
                    size="small"
                    format={() => `${record.male}:${record.female}`}
                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                />
            ),
        }
    ];

    // Columns cho bảng báo cáo tuyển dụng
    const recruitmentColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Hồ sơ ứng tuyển',
            dataIndex: 'applicants',
            key: 'applicants',
            sorter: (a, b) => a.applicants - b.applicants,
        },
        {
            title: 'Phỏng vấn',
            dataIndex: 'interviews',
            key: 'interviews',
            sorter: (a, b) => a.interviews - b.interviews,
        },
        {
            title: 'Đã tuyển',
            dataIndex: 'hired',
            key: 'hired',
            render: (value) => <span style={{ color: '#52c41a' }}>{value}</span>,
            sorter: (a, b) => a.hired - b.hired,
        },
        {
            title: 'Vị trí tuyển',
            dataIndex: 'positions',
            key: 'positions',
        },
        {
            title: 'Chi phí tuyển dụng',
            dataIndex: 'cost',
            key: 'cost',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Hiệu quả',
            key: 'efficiency',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.hired / record.interviews) * 100)}
                    size="small"
                    status={(record.hired / record.interviews) > 0.2 ? "success" : "normal"}
                />
            ),
        }
    ];

    // Columns cho bảng báo cáo lương
    const payrollColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Tổng lương',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.totalSalary - b.totalSalary,
        },
        {
            title: 'Thưởng',
            dataIndex: 'bonus',
            key: 'bonus',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.bonus - b.bonus,
        },
        {
            title: 'Khấu trừ',
            dataIndex: 'deductions',
            key: 'deductions',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.deductions - b.deductions,
        },
        {
            title: 'Thực chi',
            dataIndex: 'netPayment',
            key: 'netPayment',
            render: (value) => `${(value/1000000).toFixed(1)} triệu`,
            sorter: (a, b) => a.netPayment - b.netPayment,
        },
        {
            title: 'So với tháng trước',
            key: 'comparison',
            render: (_, record, index) => {
                if (index === 0) return <span>--</span>;
                const prevAmount = payrollReportData[index - 1].netPayment;
                const diff = record.netPayment - prevAmount;
                const percentage = ((diff / prevAmount) * 100).toFixed(1);

                return (
                    <span style={{ color: diff >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {diff >= 0 ? '+' : ''}{percentage}%
          </span>
                );
            },
        }
    ];

    // Columns cho bảng báo cáo chấm công
    const attendanceColumns = [
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Tổng ngày công',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Đúng giờ',
            dataIndex: 'onTime',
            key: 'onTime',
            render: (value, record) => (
                <span>{value} ({Math.round((value/record.total) * 100)}%)</span>
            ),
            sorter: (a, b) => a.onTime - b.onTime,
        },
        {
            title: 'Đi muộn',
            dataIndex: 'late',
            key: 'late',
            render: (value) => <span style={{ color: '#faad14' }}>{value}</span>,
            sorter: (a, b) => a.late - b.late,
        },
        {
            title: 'Vắng mặt',
            dataIndex: 'absent',
            key: 'absent',
            render: (value) => <span style={{ color: '#ff4d4f' }}>{value}</span>,
            sorter: (a, b) => a.absent - b.absent,
        },
        {
            title: 'Nghỉ phép',
            dataIndex: 'leave',
            key: 'leave',
            sorter: (a, b) => a.leave - b.leave,
        },
        {
            title: 'Giờ tăng ca',
            dataIndex: 'overtime',
            key: 'overtime',
            sorter: (a, b) => a.overtime - b.overtime,
        }
    ];

    // Hàm xuất Excel cho từng tab
    const exportExcel = () => {
        let exportData = [];
        let sheetName = '';
        if (activeTab === '1') {
            exportData = staffReportData.map((item, idx) => ({
                'STT': idx + 1,
                'Phòng ban': item.department,
                'Tổng nhân viên': item.total,
                'Nhân viên mới': item.new,
                'Nghỉ việc': item.leave,
                'Nam': item.male,
                'Nữ': item.female,
            }));
            sheetName = 'NhanSu';
        } else if (activeTab === '3') {
            exportData = payrollReportData.map((item, idx) => ({
                'STT': idx + 1,
                'Tháng': item.month,
                'Tổng lương': item.totalSalary,
                'Thưởng': item.bonus,
                'Khấu trừ': item.deductions,
                'Thực chi': item.netPayment,
            }));
            sheetName = 'Luong';
        } else if (activeTab === '4') {
            exportData = attendanceReportData.map((item, idx) => ({
                'STT': idx + 1,
                'Tháng': item.month,
                'Tổng ngày công': item.total,
                'Đúng giờ': item.onTime,
                'Đi muộn': item.late,
                'Vắng mặt': item.absent,
                'Nghỉ phép': item.leave,
                'Giờ tăng ca': item.overtime,
            }));
            sheetName = 'ChamCong';
        } else if (activeTab === '5') {
            exportData = performanceReportData.map((item, idx) => ({
                'STT': idx + 1,
                'Tháng': item.month,
                'Điểm TB': item.averageScore,
                'Số lượt đánh giá': item.totalReviews,
            }));
            sheetName = 'DanhGia';
        }
        if (exportData.length === 0) return;
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `report_${sheetName}.xlsx`);
    };

    // Hàm xuất toàn bộ báo cáo ra Excel (nhiều sheet)
    const exportAllExcel = () => {
        const wb = XLSX.utils.book_new();
        // Nhân sự
        const staffSheet = XLSX.utils.json_to_sheet(staffReportData.map((item, idx) => ({
            'STT': idx + 1,
            'Phòng ban': item.department,
            'Tổng nhân viên': item.total,
            'Nhân viên mới': item.new,
            'Nghỉ việc': item.leave,
            'Nam': item.male,
            'Nữ': item.female,
        })));
        XLSX.utils.book_append_sheet(wb, staffSheet, 'NhanSu');
        // Lương
        const payrollSheet = XLSX.utils.json_to_sheet(payrollReportData.map((item, idx) => ({
            'STT': idx + 1,
            'Tháng': item.month,
            'Tổng lương': item.totalSalary,
            'Thưởng': item.bonus,
            'Khấu trừ': item.deductions,
            'Thực chi': item.netPayment,
        })));
        XLSX.utils.book_append_sheet(wb, payrollSheet, 'Luong');
        // Chấm công
        const attendanceSheet = XLSX.utils.json_to_sheet(attendanceReportData.map((item, idx) => ({
            'STT': idx + 1,
            'Tháng': item.month,
            'Tổng ngày công': item.total,
            'Đúng giờ': item.onTime,
            'Đi muộn': item.late,
            'Vắng mặt': item.absent,
            'Nghỉ phép': item.leave,
            'Giờ tăng ca': item.overtime,
        })));
        XLSX.utils.book_append_sheet(wb, attendanceSheet, 'ChamCong');
        // Đánh giá
        const performanceSheet = XLSX.utils.json_to_sheet(performanceReportData.map((item, idx) => ({
            'STT': idx + 1,
            'Tháng': item.month,
            'Điểm TB': item.averageScore,
            'Số lượt đánh giá': item.totalReviews,
        })));
        XLSX.utils.book_append_sheet(wb, performanceSheet, 'DanhGia');
        XLSX.writeFile(wb, 'BaoCaoTongHop.xlsx');
    };

    const statMonthlySalaryColumns = [
        { title: 'Tháng', dataIndex: 'month', key: 'month', width: 120 },
        { title: 'Tổng lương', dataIndex: 'totalSalary', key: 'totalSalary', render: (value) => `${value?.toLocaleString('vi-VN')} ₫`, sorter: (a, b) => a.totalSalary - b.totalSalary },
        { title: 'Lương trung bình', dataIndex: 'avgSalary', key: 'avgSalary', render: (value) => `${value?.toLocaleString('vi-VN')} ₫`, sorter: (a, b) => a.avgSalary - b.avgSalary },
        { title: 'Số nhân viên', dataIndex: 'employeeCount', key: 'employeeCount', sorter: (a, b) => a.employeeCount - b.employeeCount },
        { title: 'Lương cao nhất', dataIndex: 'maxSalary', key: 'maxSalary', render: (value) => `${value?.toLocaleString('vi-VN')} ₫`, sorter: (a, b) => a.maxSalary - b.maxSalary },
        { title: 'Lương thấp nhất', dataIndex: 'minSalary', key: 'minSalary', render: (value) => `${value?.toLocaleString('vi-VN')} ₫`, sorter: (a, b) => a.minSalary - b.minSalary },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '16px', alignItems: 'center' }}>
                <Col span={24} style={{ textAlign: 'left' }}>
                    <BarChartOutlined style={{ fontSize: 36, color: '#1890ff', marginRight: 12, verticalAlign: 'middle' }} />
                    <Title level={2} style={{ display: 'inline', verticalAlign: 'middle', margin: 0 }}>Báo cáo</Title>
                </Col>
            </Row>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                <div style={{ minWidth: 300, flex: '1 1 300px', maxWidth: 400 }}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tổng nhân viên"
                                value={staffReportData.reduce((sum, d) => sum + d.total, 0)}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </ThreeDContainer>
                </div>
                <div style={{ minWidth: 300, flex: '1 1 300px', maxWidth: 400 }}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tổng phòng ban"
                                value={staffReportData.length}
                                prefix={<PieChartOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </ThreeDContainer>
                </div>
                <div style={{ minWidth: 300, flex: '1 1 300px', maxWidth: 400 }}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Điểm đánh giá TB 6 tháng"
                                value={performanceReportData.length > 0 ? (performanceReportData.reduce((sum, d) => sum + d.averageScore, 0) / performanceReportData.length).toFixed(2) : 0}
                                prefix={<AuditOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </ThreeDContainer>
                </div>
                <div style={{ minWidth: 300, flex: '1 1 300px', maxWidth: 400 }}>
                    <ThreeDContainer>
                        <Card>
                            <Statistic
                                title="Tỷ lệ đúng giờ 6 tháng"
                                value={attendanceReportData.length > 0 ? ((attendanceReportData.reduce((sum, d) => sum + d.onTime, 0) / (attendanceReportData.reduce((sum, d) => sum + d.total, 0) || 1)) * 100).toFixed(1) : 0}
                                suffix="%"
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </ThreeDContainer>
                </div>
            </div>

            <ThreeDContainer>
                <div style={{ marginBottom: '16px', padding: '16px', background: '#fff', borderRadius: '8px' }}>
                    <Space>
                        <Button icon={<FileExcelOutlined />} onClick={exportExcel}>Xuất Excel</Button>
                        <Button icon={<DownloadOutlined />} onClick={exportAllExcel} style={{marginRight: 8}}>Tải báo cáo đầy đủ (Excel)</Button>
                    </Space>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane
                        tab={<span><TeamOutlined /> Báo cáo nhân sự</span>}
                        key="1"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về số lượng nhân viên, biến động nhân sự theo phòng ban cho giai đoạn đã chọn.
                            </Paragraph>
                            {error && <Text type="danger">{error}</Text>}
                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><UserOutlined style={{color:'#1890ff'}}/>Tổng số nhân viên</span>}>
                                        <Statistic
                                            title="Tổng số nhân viên"
                                            value={staffReportData.reduce((sum, d) => sum + d.total, 0)}
                                            prefix={<UserOutlined />}
                                        />
                                        <Divider />
                                        <div>
                                            <div><Text type="secondary">Phòng ban nhiều nhất:</Text></div>
                                            <Text strong>{staffReportData.length > 0 ? `${staffReportData.reduce((max, d) => d.total > max.total ? d : max, staffReportData[0]).department} (${staffReportData.reduce((max, d) => d.total > max.total ? d : max, staffReportData[0]).total})` : '-'}</Text>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><UserAddOutlined style={{color:'#52c41a'}}/>Tuyển mới trong kỳ</span>}>
                                        <Statistic
                                            title="Tuyển mới trong kỳ"
                                            value={staffReportData.reduce((sum, d) => sum + d.new, 0)}
                                            valueStyle={{ color: '#52c41a' }}
                                            prefix={<UserAddOutlined />}
                                        />
                                        <Divider />
                                        <Progress
                                            percent={staffReportData.length > 0 ? (staffReportData.reduce((sum, d) => sum + d.new, 0) / staffReportData.reduce((sum, d) => sum + d.total, 0)) * 100 : 0}
                                            size="small"
                                            status="success"
                                            format={() => `${staffReportData.length > 0 ? ((staffReportData.reduce((sum, d) => sum + d.new, 0) / staffReportData.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1) : 0}% tổng nhân sự`}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><UserDeleteOutlined style={{color:'#ff4d4f'}}/>Nghỉ việc trong kỳ</span>}>
                                        <Statistic
                                            title="Nghỉ việc trong kỳ"
                                            value={staffReportData.reduce((sum, d) => sum + d.leave, 0)}
                                            valueStyle={{ color: '#ff4d4f' }}
                                            prefix={<UserDeleteOutlined />}
                                        />
                                        <Divider />
                                        <Progress
                                            percent={staffReportData.length > 0 ? (staffReportData.reduce((sum, d) => sum + d.leave, 0) / staffReportData.reduce((sum, d) => sum + d.total, 0)) * 100 : 0}
                                            size="small"
                                            status="exception"
                                            format={() => `${staffReportData.length > 0 ? ((staffReportData.reduce((sum, d) => sum + d.leave, 0) / staffReportData.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1) : 0}% tổng nhân sự`}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Table
                                loading={loading}
                                dataSource={staffReportData}
                                columns={staffColumns}
                                rowKey="department"
                                pagination={false}
                                summary={pageData => {
                                    let totalStaff = 0;
                                    let totalNew = 0;
                                    let totalLeave = 0;
                                    let totalMale = 0;
                                    let totalFemale = 0;

                                    pageData.forEach(({ total, new: newStaff, leave, male, female }) => {
                                        totalStaff += total;
                                        totalNew += newStaff;
                                        totalLeave += leave;
                                        totalMale += male;
                                        totalFemale += female;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalStaff}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#52c41a' }}>{totalNew}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <span style={{ color: '#ff4d4f' }}>{totalLeave}</span>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalMale}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalFemale}</Table.Summary.Cell>
                                            <Table.Summary.Cell>
                                                <Progress
                                                    percent={totalStaff > 0 ? Math.round((totalMale / totalStaff) * 100) : 0}
                                                    size="small"
                                                    format={() => `${totalMale}:${totalFemale}`}
                                                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                                />
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>

                    <TabPane
                        tab={<span><DollarOutlined /> Báo cáo lương thưởng</span>}
                        key="3"
                    >
                        <Card>
                            <Paragraph>
                                Báo cáo thống kê về chi phí lương, thưởng, phụ cấp và tổng chi phí nhân sự theo tháng.
                            </Paragraph>
                            {error && <Text type="danger">{error}</Text>}
                            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                                <Col span={6}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><DollarOutlined style={{color:'#1890ff'}}/>Tổng chi phí 6 tháng</span>}>
                                        <Statistic
                                            title="Tổng chi phí 6 tháng"
                                            value={(payrollReportData.reduce((sum, d) => sum + d.netPayment, 0) / 1000000000).toFixed(1)}
                                            suffix="tỷ VND"
                                            precision={1}
                                            prefix={<DollarOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><DollarOutlined style={{color:'#1890ff'}}/>Chi phí lương cơ bản</span>}>
                                        <Statistic
                                            title="Chi phí lương cơ bản"
                                            value={payrollReportData.length > 0 ? (payrollReportData.reduce((sum, d) => sum + d.totalSalary, 0) / payrollReportData.reduce((sum, d) => sum + d.netPayment, 0)) * 100 : 0}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><DollarOutlined style={{color:'#52c41a'}}/>Chi phí thưởng</span>}>
                                        <Statistic
                                            title="Chi phí thưởng"
                                            value={payrollReportData.length > 0 ? (payrollReportData.reduce((sum, d) => sum + d.bonus, 0) / payrollReportData.reduce((sum, d) => sum + d.netPayment, 0)) * 100 : 0}
                                            suffix="%"
                                            precision={1}
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><DollarOutlined style={{color:'#722ed1'}}/>Trung bình/nhân viên</span>}>
                                        <Statistic
                                            title="Trung bình/nhân viên"
                                            value={payrollReportData.length > 0 ? (payrollReportData.reduce((sum, d) => sum + d.netPayment, 0) / 6 / (staffReportData.reduce((sum, d) => sum + d.total, 0) || 1) / 1000000).toFixed(1) : 0}
                                            suffix="triệu"
                                            precision={1}
                                            valueStyle={{ color: '#722ed1' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Table
                                loading={loading}
                                dataSource={payrollReportData}
                                columns={payrollColumns}
                                rowKey="month"
                                pagination={false}
                                summary={pageData => {
                                    let totalSalary = 0;
                                    let totalBonus = 0;
                                    let totalDeductions = 0;
                                    let totalNet = 0;

                                    pageData.forEach(({ totalSalary: salary, bonus, deductions, netPayment }) => {
                                        totalSalary += salary;
                                        totalBonus += bonus;
                                        totalDeductions += deductions;
                                        totalNet += netPayment;
                                    });

                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalSalary/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalBonus/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalDeductions/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{`${(totalNet/1000000).toFixed(1)} triệu`}</Table.Summary.Cell>
                                            <Table.Summary.Cell>-</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                        <Divider />
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <DollarOutlined style={{ color: '#52c41a' }} />
                                            <span style={{ color: '#222', fontWeight: 600 }}>Phân bố lương</span>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Select
                                                    value={statSelectedMonth}
                                                    onChange={setStatSelectedMonth}
                                                    style={{ width: 200 }}
                                                    placeholder="Chọn tháng"
                                                    allowClear={false}
                                                >
                                                    {statAvailableMonths.map(month => (
                                                        <Option key={month.value} value={month.value}>{month.label}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    }
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={statSalaryRangeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="range" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => `${value} nhân viên`} />
                                            <Legend />
                                            <Bar dataKey="count" name="Số nhân viên" >
                                                {statSalaryRangeData.map((entry, idx) => (
                                                    <Cell key={`cell-salary-range-${idx}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    </Card>
                                </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24}>
                                <Card
                                    title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><BarChartOutlined style={{ color: '#722ed1' }} />Thống kê lương theo tháng</span>}
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <Table
                                        columns={statMonthlySalaryColumns}
                                        dataSource={statMonthlySalaryData}
                                        rowKey="key"
                                        pagination={{
                                            pageSize: 12,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tháng`,
                                        }}
                                        scroll={{ x: 800 }}
                                        size="middle"
                                    />
                                    </Card>
                                </Col>
                        </Row>
                    </TabPane>

                    <TabPane
                        tab={<span><AuditOutlined /> Báo cáo đánh giá</span>}
                        key="5"
                    >
                        <Card title={<span style={{display:'flex',alignItems:'center',gap:8}}><AuditOutlined style={{color:'#faad14'}}/>Báo cáo đánh giá hiệu suất nhân viên</span>}>
                            <Text>Báo cáo đánh giá hiệu suất nhân viên</Text>
                            {error && <Text type="danger">{error}</Text>}
                            <Table
                                loading={loading}
                                dataSource={performanceReportData}
                                columns={[
                                    { title: 'Tháng', dataIndex: 'month', key: 'month' },
                                    { title: 'Điểm TB', dataIndex: 'averageScore', key: 'averageScore', render: v => v.toFixed(2) },
                                    { title: 'Số lượt đánh giá', dataIndex: 'totalReviews', key: 'totalReviews' }
                                ]}
                                rowKey="month"
                                pagination={false}
                                summary={pageData => {
                                    let totalScore = 0;
                                    let totalReviews = 0;
                                    pageData.forEach(({ averageScore, totalReviews: tr }) => {
                                        totalScore += averageScore * tr;
                                        totalReviews += tr;
                                    });
                                    return (
                                        <Table.Summary.Row style={{ fontWeight: 'bold' }}>
                                            <Table.Summary.Cell>Tổng cộng</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalReviews > 0 ? (totalScore / totalReviews).toFixed(2) : 0}</Table.Summary.Cell>
                                            <Table.Summary.Cell>{totalReviews}</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </Card>
                    </TabPane>
                    <TabPane
                        tab={<span><ClockCircleOutlined /> Thống kê nghỉ phép</span>}
                        key="2"
                    >
                        <Row gutter={[32, 32]} justify="">
                            <Col xs={24} md={12}>
                                <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                        <Statistic
                                        title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><ClockCircleOutlined style={{ color: '#ff6b6b' }} />Tổng đơn nghỉ phép</span>}
                                        value={statTotalLeaveRequests}
                                        valueStyle={{ color: '#ff6b6b', fontSize: 36, fontWeight: 700 }}
                                    />
                                    </Card>
                                </Col>
                        </Row>
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <LineChartOutlined style={{ color: '#ff6b6b' }} />
                                            <span style={{ color: '#222', fontWeight: 600 }}>Thống kê đơn nghỉ phép theo tháng</span>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <Select
                                                    value={statSelectedYear}
                                                    onChange={setStatSelectedYear}
                                                    style={{ width: 120 }}
                                                    placeholder="Chọn năm"
                                                >
                                                    {statYearOptions.map(year => (
                                                        <Option key={year} value={year}>{year}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    }
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={statLeaveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => `${value} đơn`} />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                name="Số đơn nghỉ phép"
                                                stroke="#ff6b6b"
                                                strokeWidth={3}
                                                dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 6 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        <Divider />
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24}>
                                <Card
                                    title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Danh sách nhân viên nghỉ trong tháng</span>}
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                                        <Select
                                            value={selectedLeaveMonth}
                                            onChange={setSelectedLeaveMonth}
                                            style={{ width: 200 }}
                                            placeholder="Chọn tháng"
                                            options={leaveMonthOptions}
                                        />
                                        <Select
                                            value={leaveStatusFilter}
                                            onChange={setLeaveStatusFilter}
                                            style={{ width: 160 }}
                                            options={[
                                                { value: 'ALL', label: 'Tất cả trạng thái' },
                                                { value: 'APPROVED', label: 'Đã duyệt' },
                                                { value: 'PENDING', label: 'Chờ duyệt' },
                                                { value: 'CANCELLED', label: 'Từ chối' },
                                            ]}
                                        />
                                    </div>
                            <Table
                                        dataSource={leaveRequestsByMonth.filter(r => {
                                            if (leaveStatusFilter === 'ALL') return ['Approved', 'APPROVED', 'Pending', 'PENDING', 'Cancelled', 'CANCELLED'].includes(r.status);
                                            if (leaveStatusFilter === 'APPROVED') return r.status === 'Approved' || r.status === 'APPROVED';
                                            if (leaveStatusFilter === 'PENDING') return r.status === 'Pending' || r.status === 'PENDING';
                                            if (leaveStatusFilter === 'CANCELLED') return r.status === 'Cancelled' || r.status === 'CANCELLED';
                                            return false;
                                        })}
                                        rowKey={r => r._id}
                                        columns={[
                                            { title: 'Mã NV', dataIndex: ['employeeId', 'code'], key: 'code', render: (_, r) => r.employeeId?.code || '-' },
                                            { title: 'Nhân viên', dataIndex: ['employeeId', 'fullName'], key: 'employee', render: (_, r) => r.employeeId?.fullName || '-' },
                                            { title: 'Loại đơn', dataIndex: ['typeRequest', 'name'], key: 'type', render: (_, r) => r.typeRequest?.name || '-' },
                                            { title: 'Lý do', dataIndex: ['dataReq', 'reason'], key: 'reason', render: (_, r) => r.dataReq?.reason || '-' },
                                            { title: 'Ngày bắt đầu', dataIndex: ['dataReq', 'startDate'], key: 'start', render: (_, r) => r.dataReq?.startDate ? new Date(r.dataReq.startDate).toLocaleDateString() : '-' },
                                            { title: 'Ngày kết thúc', dataIndex: ['dataReq', 'endDate'], key: 'end', render: (_, r) => r.dataReq?.endDate ? new Date(r.dataReq.endDate).toLocaleDateString() : '-' },
                                            { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (value) => {
                                                let color = '#faad14';
                                                let text = value;
                                                if (value === 'Approved' || value === 'APPROVED') { color = '#52c41a'; text = 'Đã duyệt'; }
                                                else if (value === 'Cancelled' || value === 'CANCELLED') { color = '#ff4d4f'; text = 'Từ chối'; }
                                                else if (value === 'Pending' || value === 'PENDING') { color = '#faad14'; text = 'Chờ duyệt'; }
                                                return <span style={{ color, fontWeight: 600 }}>{text}</span>;
                                            } },
                                        ]}
                                        pagination={{ pageSize: 10 }}
                            />
                        </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={<span><BarChartOutlined /> Thống kê nhân sự</span>}
                        key="0"
                    >
                        <Divider />
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24} md={12}>
                                <Card
                                    title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><PieChartOutlined style={{ color: '#0088FE' }} />Tỷ lệ giới tính nhân viên</span>}
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <ResponsiveContainer width="100%" height={320}>
                                        <PieChart>
                                            <Pie
                                                data={statGenderData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={110}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            >
                                                {statGenderData.map((entry, index) => (
                                                    <Cell key={`cell-gender-${index}`} fill={STAT_COLORS[index % STAT_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value} nhân viên`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card
                                    title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><TeamOutlined style={{ color: '#8884d8' }} />Phân bố độ tuổi nhân viên</span>}
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart data={statAgeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="ageRange" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => `${value} nhân viên`} />
                                            <Legend />
                                            <Bar dataKey="count" name="Số lượng" >
                                                {statAgeData.map((entry, idx) => (
                                                    <Cell key={`cell-age-${idx}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[32, 32]} justify="center">
                            <Col xs={24}>
                                <Card
                                    title={<span style={{ color: '#222', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><BarChartOutlined style={{ color: '#1976d2' }} />Thống kê thâm niên làm việc</span>}
                                    style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                >
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={statSeniorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="range" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => `${value} nhân viên`} />
                                            <Legend />
                                            <Bar dataKey="count" name="Số nhân viên">
                                                {statSeniorityData.map((entry, idx) => (
                                                    <Cell key={`cell-seniority-${idx}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </ThreeDContainer>
        </div>
    );
};

export default Reports;
