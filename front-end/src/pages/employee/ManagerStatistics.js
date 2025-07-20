import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, message, Statistic, Divider, Table, Select } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import StatisticsService from "../../services/StatisticsService";
import EmployeeProfile from "../../services/EmployeeProfile";

const { Title } = Typography;
const { Option } = Select;
const COLORS = ['#0088FE', '#FF69B4', '#00C49F', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
const AGE_COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1'];
const SALARY_COLORS = ['#52c41a', '#1890ff', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2'];

const getAgeRange = (dob) => {
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
};

const getSalaryRange = (salary) => {
  if (salary < 10000000) return 'Dưới 10M';
  if (salary < 15000000) return '10M - 15M';
  if (salary < 20000000) return '15M - 20M';
  if (salary < 25000000) return '20M - 25M';
  if (salary < 30000000) return '25M - 30M';
  return 'Trên 30M';
};

const ManagerStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [leaveTable, setLeaveTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [salaryRangeData, setSalaryRangeData] = useState([]);
  const [monthlySalaryData, setMonthlySalaryData] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);

  // Danh sách năm cho dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear - 3; year <= currentYear; year++) {
    yearOptions.push(year);
  }

  const monthlySalaryColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      width: 120,
    },
    {
      title: 'Tổng lương',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.totalSalary - b.totalSalary,
    },
    {
      title: 'Lương trung bình',
      dataIndex: 'avgSalary',
      key: 'avgSalary',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.avgSalary - b.avgSalary,
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      sorter: (a, b) => a.employeeCount - b.employeeCount,
    },
    {
      title: 'Lương cao nhất',
      dataIndex: 'maxSalary',
      key: 'maxSalary',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.maxSalary - b.maxSalary,
    },
    {
      title: 'Lương thấp nhất',
      dataIndex: 'minSalary',
      key: 'minSalary',
      render: (value) => `${value.toLocaleString('vi-VN')} ₫`,
      sorter: (a, b) => a.minSalary - b.minSalary,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy departmentId từ user
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await EmployeeProfile.getEmployeeProfile(user.employeeId);
        const deptId = response.data?.departmentId?._id;
        if (!deptId) {
          message.error("Không tìm thấy phòng ban của bạn!");
          setLoading(false);
          return;
        }
        setDepartmentId(deptId);

        // Lấy danh sách nhân viên
        const empRes = await StatisticsService.getEmployeesByDepartment(deptId);
        const empList = Array.isArray(empRes.data) ? empRes.data : empRes;
        setEmployees(empList);

        // Lấy danh sách đơn nghỉ phép
        const leaveRes = await StatisticsService.getLeaveRequestsByDepartment(deptId);
        const leaveList = Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes;
        setLeaveRequests(leaveList);

        // Thống kê giới tính và độ tuổi
        const genderCount = { Nam: 0, Nữ: 0, Khác: 0 };
        const ageCount = { '<18': 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, 'Trên 60': 0, 'Không rõ': 0 };
        
        empList.forEach(emp => {
          const gender = emp.gender || 'Khác';
          if (gender === 'male' || gender === 'Nam') genderCount['Nam']++;
          else if (gender === 'female' || gender === 'Nữ') genderCount['Nữ']++;
          else genderCount['Khác']++;
          
          const range = getAgeRange(emp.dob);
          ageCount[range] = (ageCount[range] || 0) + 1;
        });
        
        setGenderData([
          { name: 'Nam', value: genderCount['Nam'] },
          { name: 'Nữ', value: genderCount['Nữ'] },
          { name: 'Khác', value: genderCount['Khác'] },
        ]);
        
        setAgeData(Object.keys(ageCount).map((range, idx) => ({
          ageRange: range,
          count: ageCount[range],
          fill: AGE_COLORS[idx % AGE_COLORS.length]
        })));

        // Thống kê số ngày nghỉ phép của từng nhân viên
        const leaveDaysByEmp = {};
        leaveList.forEach(req => {
          if (!req.employeeId) return;
          const empId = typeof req.employeeId === 'object' ? req.employeeId._id : req.employeeId;
          const start = req.dataReq?.startDate ? new Date(req.dataReq.startDate) : null;
          const end = req.dataReq?.endDate ? new Date(req.dataReq.endDate) : null;
          let days = 0;
          if (start && end) {
            days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
          } else if (start) {
            days = 1;
          }
          if (start && start.getFullYear() === selectedYear) {
            leaveDaysByEmp[empId] = (leaveDaysByEmp[empId] || 0) + days;
          }
        });

        const leaveTableData = empList.map(emp => ({
          key: emp._id,
          name: emp.fullName,
          gender: emp.gender,
          age: getAgeRange(emp.dob),
          totalLeaveDays: leaveDaysByEmp[emp._id] || 0
        }));
        setLeaveTable(leaveTableData);

        // Lấy dữ liệu lương của phòng ban
        const salaryRes = await StatisticsService.getSalarySlipsByDepartment(deptId);
        const salarySlips = Array.isArray(salaryRes.data) ? salaryRes.data : salaryRes;
        
        if (salarySlips.length > 0) {
          // Tạo danh sách tháng có sẵn
          const monthsSet = new Set();
          salarySlips.forEach(slip => {
            if (slip.month && slip.year) {
              monthsSet.add(`${slip.month}/${slip.year}`);
            }
          });
          
          const monthsList = Array.from(monthsSet).map(monthYear => {
            const [month, year] = monthYear.split('/');
            return {
              value: monthYear,
              label: `Tháng ${month}/${year}`
            };
          }).sort((a, b) => {
            const [aMonth, aYear] = a.value.split('/');
            const [bMonth, bYear] = b.value.split('/');
            return new Date(bYear, bMonth - 1) - new Date(aYear, aMonth - 1);
          });

          setAvailableMonths(monthsList);
          
          // Nếu chưa chọn tháng, chọn tháng đầu tiên
          if (!selectedMonth && monthsList.length > 0) {
            setSelectedMonth(monthsList[0].value);
          }

          // Xử lý dữ liệu lương theo tháng cho bảng
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

          setMonthlySalaryData(monthlyData);

          // Xử lý phân bố lương theo dải cho tháng được chọn
          if (selectedMonth) {
            const [selectedMonthNum, selectedYearNum] = selectedMonth.split('/');
            const filteredSlips = salarySlips.filter(slip => 
              slip.month == selectedMonthNum && slip.year == selectedYearNum
            );

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
                const range = getSalaryRange(salary);
                salaryRanges[range]++;
              });

              const rangeData = Object.keys(salaryRanges).map((range, idx) => ({
                range,
                count: salaryRanges[range],
                fill: SALARY_COLORS[idx % SALARY_COLORS.length]
              }));

              setSalaryRangeData(rangeData);
            }
          }
        }

      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu thống kê');
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (monthYear) => {
    setSelectedMonth(monthYear);
  };

  // Chuẩn bị dữ liệu cho biểu đồ cột nhóm theo tháng
  const leaveByMonthTable = employees.map(emp => {
    const row = { name: emp.fullName };
    for (let m = 1; m <= 12; m++) row[`Tháng ${m}`] = 0;
    leaveRequests.forEach(req => {
      if (
        req.employeeId &&
        ((typeof req.employeeId === 'object' && req.employeeId._id === emp._id) || req.employeeId === emp._id)
      ) {
        const start = req.dataReq?.startDate ? new Date(req.dataReq.startDate) : null;
        const end = req.dataReq?.endDate ? new Date(req.dataReq.endDate) : null;
        if (start && start.getFullYear() === selectedYear) {
          const month = start.getMonth() + 1;
          let days = 1;
          if (end && end.getFullYear() === selectedYear) {
            days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
          }
          row[`Tháng ${month}`] += days;
        }
      }
    });
    return row;
  });

  // Tính tổng số ngày nghỉ phép của phòng ban theo từng tháng trong năm được chọn
  const leaveByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    let totalDays = 0;
    leaveRequests.forEach(req => {
      const start = req.dataReq?.startDate ? new Date(req.dataReq.startDate) : null;
      const end = req.dataReq?.endDate ? new Date(req.dataReq.endDate) : null;
      if (start && start.getFullYear() === selectedYear && (start.getMonth() + 1) === month) {
        let days = 1;
        if (end && end.getFullYear() === selectedYear && (end.getMonth() + 1) === month) {
          days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }
        totalDays += days;
      }
    });
    return { month: `Tháng ${month}`, totalLeaveDays: totalDays };
  });

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', render: (_, __, idx) => idx + 1 },
    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Độ tuổi', dataIndex: 'age', key: 'age' },
    { 
      title: 'Tổng số ngày nghỉ phép', 
      dataIndex: 'totalLeaveDays', 
      key: 'totalLeaveDays',
      sorter: (a, b) => a.totalLeaveDays - b.totalLeaveDays,
      defaultSortOrder: 'descend'
    }
  ];

  const totalLeave = leaveTable.reduce((sum, emp) => sum + emp.totalLeaveDays, 0);

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f4f6fb' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1976d2', marginBottom: 32 }}>Thống kê nhân sự phòng ban</Title>
      <Spin spinning={loading}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={12}>
            <Card title="Tỷ lệ giới tính nhân viên">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} nhân viên`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Phân bố độ tuổi nhân viên">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageRange" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => `${value} nhân viên`} />
                  <Legend />
                  <Bar dataKey="count" name="Số lượng" >
                    {ageData.map((entry, idx) => (
                      <Cell key={`cell-age-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Select value={selectedYear} onChange={handleYearChange} style={{ width: 120 }}>
            {yearOptions.map(y => <Option key={y} value={y}>{y}</Option>)}
          </Select>
        </div>
        <Card title="Biểu đồ tổng số ngày nghỉ phép của phòng ban theo tháng trong năm" style={{ marginBottom: 24 }}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={leaveByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => `${value} ngày`} />
              <Legend />
              <Bar dataKey="totalLeaveDays" name="Số ngày nghỉ phép" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Bảng thống kê số ngày nghỉ phép của nhân viên trong phòng ban">
          <Table 
            columns={columns} 
            dataSource={leaveTable} 
            pagination={false} 
            footer={() => (
              <div style={{ textAlign: 'right', fontWeight: 600 }}>
                Tổng số ngày nghỉ phép: {totalLeave}
              </div>
            )}
          />
        </Card>
        <Divider />
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>Phân bố lương phòng ban</span>
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    style={{ width: 200 }}
                    placeholder="Chọn tháng"
                    allowClear={false}
                  >
                    {availableMonths.map(month => (
                      <Option key={month.value} value={month.value}>{month.label}</Option>
                    ))}
                  </Select>
                </div>
              }
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(82, 196, 26, 0.08)' }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salaryRangeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => `${value} nhân viên`} />
                  <Legend />
                  <Bar dataKey="count" name="Số nhân viên" >
                    {salaryRangeData.map((entry, idx) => (
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
              title={<span style={{ color: '#722ed1', fontWeight: 600 }}>Thống kê lương phòng ban theo tháng</span>}
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(114, 46, 209, 0.08)' }}
            >
              <Table
                columns={monthlySalaryColumns}
                dataSource={monthlySalaryData}
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
      </Spin>
    </div>
  );
};

export default ManagerStatistics; 