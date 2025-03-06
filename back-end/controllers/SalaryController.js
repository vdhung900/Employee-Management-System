const Salary = require('../models/Salary');

// Tính tổng thu nhập
totalIncome = (salaryBase, allowances, bonus, penalty) => {
  return salaryBase + allowances + bonus - penalty;
};

exports.addSalary = async (req, res) => {
  try {
    const { employeeId, salaryBase, allowances, bonus, penalty, paymentDate } = req.body;
    const total = totalIncome(salaryBase, allowances, bonus, penalty);
    const salary = new Salary({ employeeId, salaryBase, allowances, bonus, penalty, totalIncome: total, paymentDate });
    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const salary = await Salary.findOne({ employeeId: req.params.employeeId });
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const { salaryBase, allowances, bonus, penalty, paymentDate } = req.body;
    const total = totalIncome(salaryBase, allowances, bonus, penalty);
    const salary = await Salary.findByIdAndUpdate(req.params.id, { salaryBase, allowances, bonus, penalty, totalIncome: total, paymentDate }, { new: true });
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};