export function formatDate(dateInput) {
    const date = new Date(dateInput);

    if (isNaN(date)) return ''; // Nếu không phải ngày hợp lệ, trả về chuỗi rỗng

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatNumber(value) {
    if (value === null || value === undefined || isNaN(Number(value))) return "0";
    const number = Math.floor(Number(value));
    return number.toLocaleString("vi-VN");
}
