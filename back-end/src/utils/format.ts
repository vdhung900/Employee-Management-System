export function getAllWorkingDatesBetween(startDate: Date | string, endDate: Date | string): Date[] {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format');
        }

        if (start > end) {
            throw new Error('Start date must be before or equal to end date');
        }

        const dates: Date[] = [];
        const current = new Date(start);

        while (current <= end) {
            const day = normalizeDate(current);
            const dow = day.getDay(); // 0: Sunday, 6: Saturday

            if (dow !== 0 && dow !== 6) {
                dates.push(new Date(day)); // Clone to avoid reference issues
            }

            current.setDate(current.getDate() + 1);
        }

        return dates;
    } catch (error) {
        console.error('Error in getAllWorkingDatesBetween:', error);
        throw error;
    }
}

export function normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function numberToVietnameseCurrency(num: number): string {
    if (num === 0) return "Không đồng";

    const chuSo = [
        "không",
        "một",
        "hai",
        "ba",
        "bốn",
        "năm",
        "sáu",
        "bảy",
        "tám",
        "chín",
    ];
    const hang = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

    const arr: string[] = [];
    let temp = num;
    while (temp > 0) {
        arr.push(("000" + (temp % 1000)).slice(-3));
        temp = Math.floor(temp / 1000);
    }

    let result = "";
    for (let i = arr.length - 1; i >= 0; i--) {
        const str = readThreeDigits(parseInt(arr[i]), chuSo);
        if (str !== "") {
            result += str + " " + hang[i] + " ";
        }
    }

    result = result.trim();
    return (
        result.charAt(0).toUpperCase() +
        result.slice(1) +
        " đồng"
    );

    function readThreeDigits(num: number, chuSo: string[]): string {
        let hundred = Math.floor(num / 100);
        let ten = Math.floor((num % 100) / 10);
        let unit = num % 10;
        let str = "";

        if (num === 0) return "";

        if (hundred > 0) {
            str += chuSo[hundred] + " trăm";
            if (ten === 0 && unit > 0) str += " linh";
        }

        if (ten > 1) {
            str += " " + chuSo[ten] + " mươi";
            if (unit === 1) str += " mốt";
            else if (unit === 5) str += " lăm";
            else if (unit > 1) str += " " + chuSo[unit];
        } else if (ten === 1) {
            str += " mười";
            if (unit === 1) str += " một";
            else if (unit === 5) str += " lăm";
            else if (unit > 1) str += " " + chuSo[unit];
        } else if (ten === 0 && unit > 0 && hundred > 0) {
            if (unit === 5) str += " lăm";
            else str += " " + chuSo[unit];
        } else if (ten === 0 && unit > 0) {
            if (unit === 5) str += "năm";
            else str += chuSo[unit];
        }

        return str.trim();
    }
}

export function formatNumber(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) return "0";
    return value.toLocaleString("vi-VN"); // tự động format theo kiểu Việt Nam
}
