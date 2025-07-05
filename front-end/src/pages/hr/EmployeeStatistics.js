import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, message, Statistic, Divider, Select } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import Hr_Employee from '../../services/Hr_Employee';
import RequestService from '../../services/RequestService';

const { Title } = Typography;
const { Option } = Select;
const COLORS = ['#0088FE', '#FF69B4', '#00C49F'];
const AGE_COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1'];
const LEAVE_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'];

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

const EmployeeStatistics = () => {
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalLeaveRequests, setTotalLeaveRequests] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Tạo danh sách năm từ 2020 đến năm hiện tại + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    yearOptions.push(year);
  }

  const fetchLeaveData = async (year) => {
    try {
      const leaveRes = await RequestService.getByTypeCode('LEAVE_REQUEST');
      const leaveRequests = Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes;
      setTotalLeaveRequests(leaveRequests.length);

      // Thống kê đơn nghỉ phép theo tháng cho năm được chọn
      const monthCount = {};
      
      // Khởi tạo số đếm cho tất cả 12 tháng
      for (let i = 1; i <= 12; i++) {
        monthCount[i] = 0;
      }

      leaveRequests.forEach(request => {
        if (request.dataReq && request.dataReq.startDate) {
          const startDate = new Date(request.dataReq.startDate);
          if (startDate.getFullYear() === year) {
            const month = startDate.getMonth() + 1; // getMonth() trả về 0-11
            monthCount[month] = (monthCount[month] || 0) + 1;
          }
        }
      });

      const leaveDataByMonth = Object.keys(monthCount).map((month, idx) => ({
        month: `Tháng ${month}`,
        count: monthCount[month],
        fill: LEAVE_COLORS[idx % LEAVE_COLORS.length]
      }));

      setLeaveData(leaveDataByMonth);
    } catch (err) {
      message.error('Lỗi khi lấy dữ liệu đơn nghỉ phép');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu nhân viên
        const res = await Hr_Employee.getAllEmployee();
        const employees = Array.isArray(res.data) ? res.data : res;
        setTotal(employees.length);
        
        // Thống kê giới tính
        const genderCount = { Nam: 0, Nữ: 0, Khác: 0 };
        // Thống kê độ tuổi
        const ageCount = { '<18': 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, 'Trên 60': 0, 'Không rõ': 0 };
        
        employees.forEach(emp => {
          const gender = emp.gender || 'Khác';
          if (gender === 'male' || gender === 'Nam') genderCount['Nam']++;
          else if (gender === 'female' || gender === 'Nữ') genderCount['Nữ']++;
          else genderCount['Khác']++;
          const dob = emp.dob;
          const range = getAgeRange(dob);
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

        // Lấy dữ liệu đơn nghỉ phép cho năm được chọn
        await fetchLeaveData(selectedYear);

      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu thống kê nhân viên');
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
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
      </Spin>
    </div>
  );
};

export default EmployeeStatistics; 