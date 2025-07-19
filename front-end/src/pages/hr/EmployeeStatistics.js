import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, message, Statistic, Divider, Select, Table } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import Hr_Employee from '../../services/Hr_Employee';
import RequestService from '../../services/RequestService';
import StatisticsService from '../../services/StatisticsService';

const { Title } = Typography;
const { Option } = Select;
const COLORS = ['#0088FE', '#FF69B4', '#00C49F'];
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
  if (salary < 10000000) return '<10M';
  if (salary < 15000000) return '10M - 15M';
  if (salary < 20000000) return '15M - 20M';
  if (salary < 25000000) return '20M - 25M';
  if (salary < 30000000) return '25M - 30M';
  return 'Trên 30M';
};

const EmployeeStatistics = () => {
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [monthlySalaryData, setMonthlySalaryData] = useState([]);
  const [salaryRangeData, setSalaryRangeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalLeaveRequests, setTotalLeaveRequests] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  // Tạo danh sách năm từ 2020 đến năm hiện tại + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2022; year <= currentYear; year++) {
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
        // Lấy dữ liệu nhân viên
        const res = await Hr_Employee.getAllEmployee();
        const employees = Array.isArray(res.data) ? res.data : res;
        setTotal(employees.length);
        
        // Thống kê giới tính và độ tuổi
        const genderCount = { Nam: 0, Nữ: 0, Khác: 0 };
        const ageCount = { '<18': 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, 'Trên 60': 0, 'Không rõ': 0 };
        
        employees.forEach(emp => {
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

        // Lấy dữ liệu đơn nghỉ phép
        const leaveRes = await RequestService.getByTypeCode('LEAVE_REQUEST');
        const leaveRequests = Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes;
        setTotalLeaveRequests(leaveRequests.length);

        // Thống kê đơn nghỉ phép theo tháng
        const monthCount = {};
        for (let i = 1; i <= 12; i++) {
          monthCount[i] = 0;
        }

        leaveRequests.forEach(request => {
          if (request.dataReq && request.dataReq.startDate) {
            const startDate = new Date(request.dataReq.startDate);
            if (startDate.getFullYear() === selectedYear) {
              const month = startDate.getMonth() + 1;
              monthCount[month] = (monthCount[month] || 0) + 1;
            }
          }
        });

        const leaveDataByMonth = Object.keys(monthCount).map((month, idx) => ({
          month: `Tháng ${month}`,
          count: monthCount[month],
          fill: SALARY_COLORS[idx % SALARY_COLORS.length]
        }));

        setLeaveData(leaveDataByMonth);

        // Lấy dữ liệu lương
        const salaryRes = await StatisticsService.getAllSalarySlips();
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
        message.error('Lỗi khi lấy dữ liệu thống kê nhân viên');
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

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f7fa 100%)' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1976d2', marginBottom: 32, letterSpacing: 1 }}>Thống kê nhân sự</Title>
      <Spin spinning={loading}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={12}>
            <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(25, 118, 210, 0.08)' }}>
              <Statistic
                title={<span style={{ color: '#1976d2', fontWeight: 600 }}>Tổng số nhân viên</span>}
                value={total}
                valueStyle={{ color: '#1976d2', fontSize: 36, fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(255, 107, 107, 0.08)' }}>
              <Statistic
                title={<span style={{ color: '#ff6b6b', fontWeight: 600 }}>Tổng đơn nghỉ phép</span>}
                value={totalLeaveRequests}
                valueStyle={{ color: '#ff6b6b', fontSize: 36, fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={12}>
            <Card
              title={<span style={{ color: '#0088FE', fontWeight: 600 }}>Tỷ lệ giới tính nhân viên</span>}
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0, 136, 254, 0.08)' }}
            >
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
            <Card
              title={<span style={{ color: '#8884d8', fontWeight: 600 }}>Phân bố độ tuổi nhân viên</span>}
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(136, 132, 216, 0.08)' }}
            >
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
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ff6b6b', fontWeight: 600 }}>Thống kê đơn nghỉ phép theo tháng</span>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: 120 }}
                    placeholder="Chọn năm"
                  >
                    {yearOptions.map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                </div>
              }
              style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(255, 107, 107, 0.08)' }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={leaveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>Phân bố lương</span>
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
              title={<span style={{ color: '#722ed1', fontWeight: 600 }}>Thống kê lương theo tháng</span>}
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

export default EmployeeStatistics; 