import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import dayjs from "dayjs";
import { formatDayjs, timezone as tz } from "../config.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const parseUnixTime = (unix) => {
  return dayjs.unix(unix).tz(tz).format(formatDayjs);
};
