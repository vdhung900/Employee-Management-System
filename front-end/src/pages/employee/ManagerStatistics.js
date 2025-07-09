import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, message, Statistic, Divider, Table, Select } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import ManagerStatisticsService from "../../services/ManagerStatisticsService";
import Employee_profile from '../../services/Employee_profile';

const { Title } = Typography;
const { Option } = Select;
const COLORS = ['#0088FE', '#FF69B4', '#00C49F', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
const AGE_COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1'];

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

const ManagerStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [leaveTable, setLeaveTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Danh sách năm cho dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= currentYear - 5; y--) yearOptions.push(y);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy departmentId từ user (giả sử lưu trong localStorage)
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await Employee_profile.getEmployeeProfile(user.employeeId);
        const departmentId = response.data?.departmentId?._id;
        if (!departmentId) {
          message.error("Không tìm thấy phòng ban của bạn!");
          setLoading(false);
          return;
        }

        // Lấy danh sách nhân viên
        const empRes = await ManagerStatisticsService.getEmployeesByDepartment(departmentId);
        const empList = Array.isArray(empRes.data) ? empRes.data : empRes;
        setEmployees(empList);

        // Lấy danh sách đơn nghỉ phép
        const leaveRes = await ManagerStatisticsService.getLeaveRequestsByDepartment(departmentId);
        const leaveList = Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes;
        setLeaveRequests(leaveList);

        // Thống kê giới tính
        const genderCount = { Nam: 0, Nữ: 0, Khác: 0 };
        // Thống kê độ tuổi
        const ageCount = { '<18': 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-60': 0, 'Trên 60': 0, 'Không rõ': 0 };
        empList.forEach(emp => {
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

        // Thống kê số ngày nghỉ phép của từng nhân viên (tổng)
        const leaveDaysByEmp = {};
        leaveList.forEach(req => {
          if (!req.employeeId) return;
          const empId = typeof req.employeeId === 'object' ? req.employeeId._id : req.employeeId;
          // Tính số ngày nghỉ phép từ startDate đến endDate
          const start = req.dataReq?.startDate ? new Date(req.dataReq.startDate) : null;
          const end = req.dataReq?.endDate ? new Date(req.dataReq.endDate) : null;
          let days = 0;
          if (start && end) {
            days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
          } else if (start) {
            days = 1;
          }
          // Chỉ tính cho năm được chọn
          if (start && start.getFullYear() === selectedYear) {
            leaveDaysByEmp[empId] = (leaveDaysByEmp[empId] || 0) + days;
          }
        });

        // Chuẩn bị dữ liệu cho bảng
        const leaveTableData = empList.map(emp => ({
          key: emp._id,
          name: emp.fullName,
          gender: emp.gender,
          age: getAgeRange(emp.dob),
          totalLeaveDays: leaveDaysByEmp[emp._id] || 0
        }));
        setLeaveTable(leaveTableData);

      } catch (err) {
        message.error('Lỗi khi lấy dữ liệu thống kê');
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedYear]);

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
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
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
      </Spin>
    </div>
  );
};

export default ManagerStatistics; 