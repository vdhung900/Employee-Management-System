import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ReactECharts from "echarts-for-react";
import { employeeService } from "../../services/employeeService";
import { salaryService } from "../../services/salaryService";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Statistics = () => {
    const [statistics, setStatistics] = useState({ departments: {}, positions: {}, genders: {} });
    const [salaryStats, setSalaryStats] = useState({ monthly: {}, quarterly: {}, monthlyChart: {} });

    const fetchEmployees = async () => {
        try {
            const res = await employeeService.getEmployees();
            const employees = res.data.data;
            const stats = { departments: {}, positions: {}, genders: { male: 0, female: 0, other: 0 } };

            employees.forEach((employee) => {
                const departmentName = employee.departmentId?.name || "Unknown";
                stats.departments[departmentName] = (stats.departments[departmentName] || 0) + 1;
                stats.positions[employee.position] = (stats.positions[employee.position] || 0) + 1;
                stats.genders[employee.gender] += 1;
            });

            setStatistics(stats);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchSalaries = async () => {
        try {
            const res = await salaryService.getSalaries();
            const salaries = res.data.data;
            const monthlyStats = {};
            const quarterlyStats = {};
            const monthlyChart = {};

            salaries.forEach((salary) => {
                const date = new Date(salary.paymentDate);
                const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
                const quarter = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;

                if (!monthlyStats[month]) {
                    monthlyStats[month] = [];
                }
                monthlyStats[month].push({
                    Employee: salary.employeeId.fullName,
                    Department: salary.employeeId.departmentId?.name || "Unknown",
                    SalaryBase: salary.salaryBase,
                    Allowances: salary.allowances,
                    Bonus: salary.bonus,
                    Penalty: salary.penalty,
                    TotalIncome: salary.totalIncome,
                });

                quarterlyStats[quarter] = (quarterlyStats[quarter] || 0) + salary.totalIncome;
                monthlyChart[month] = (monthlyChart[month] || 0) + salary.totalIncome;
            });

            setSalaryStats({ monthly: monthlyStats, quarterly: quarterlyStats, monthlyChart: monthlyChart });
        } catch (error) {
            console.error("Error fetching salaries:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchSalaries();
    }, []);

    const getPieChartOption = (title, data) => ({
        title: { text: title, left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
            {
                name: title,
                type: "pie",
                radius: "50%",
                data: Object.entries(data).map(([key, value]) => ({ name: key, value })),
            },
        ],
    });

    const getBarChartOption = (title, data) => ({
        title: { text: title, left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: Object.keys(data) },
        yAxis: { type: "value" },
        series: [{ name: title, type: "bar", data: Object.values(data) }],
    });

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        Object.entries(salaryStats.monthly).forEach(([month, salaries]) => {
            const ws = XLSX.utils.json_to_sheet(salaries);
            XLSX.utils.book_append_sheet(wb, ws, month);
        });
        XLSX.writeFile(wb, "Detailed_Salary_Statistics.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Salary Statistics", 10, 10);
    
        Object.entries(salaryStats.monthly).forEach(([month, salaries], index) => {
          if (index > 0) doc.addPage();
          doc.setFontSize(14);
          doc.text(`Month: ${month}`, 10, 20);
          
          autoTable(doc, {
            startY: 30,
            head: [["Employee", "Department", "Salary Base", "Allowances", "Bonus", "Penalty", "Total Income"]],
            body: salaries.map((s) => [s.Employee, s.Department, s.SalaryBase, s.Allowances, s.Bonus, s.Penalty, s.TotalIncome]),
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133], textColor: 255, fontSize: 12 },
          });
        });
        
        doc.save("Detailed_Salary_Statistics.pdf");
      };


    return (
        <Container>
            <h2 className="text-center my-4">Employee Statistics</h2>
            <Row>
                <Col md={4}>
                    <ReactECharts option={getPieChartOption("By Department", statistics.departments)} />
                </Col>
                <Col md={4}>
                    <ReactECharts option={getPieChartOption("By Position", statistics.positions)} />
                </Col>
                <Col md={4}>
                    <ReactECharts option={getPieChartOption("By Gender", statistics.genders)} />
                </Col>
            </Row>
            <h2 className="text-center my-4">Salary Statistics</h2>
            <Row>
                <Col md={6}>
                    <ReactECharts option={getBarChartOption("Monthly Salary", salaryStats.monthlyChart)} />
                </Col>
                <Col md={6}>
                    <ReactECharts option={getBarChartOption("Quarterly Salary", salaryStats.quarterly)} />
                </Col>
            </Row>
            <Row className="mt-4 text-center">
                <Col>
                    <Button onClick={exportToExcel} className="me-2">Export to Excel</Button>
                    <Button onClick={exportToPDF}>Export to PDF</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Statistics;
