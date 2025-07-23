import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Ho_Chi_Minh';

export const now = () => dayjs().tz(TIMEZONE);

export const formatVN = (date, format = 'YYYY-MM-DD HH:mm:ss') =>
    dayjs(date).tz(TIMEZONE).format(format);
