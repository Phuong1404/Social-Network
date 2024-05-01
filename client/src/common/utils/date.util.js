import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';


dayjs.extend(relativeTime);
dayjs.extend(duration);

export const DATE_FORMAT = 'DD/MM/YYYY';

export const dateUtil = {
	formatDate: (date, format = DATE_FORMAT) => (date ? dayjs(date).format(format) : ''),

	getTimeAgo: (date, maxDateDiff = 60) => {
		const now = dayjs();
		const diff = now.diff(dayjs(date), 'day');
		if (!maxDateDiff || diff > maxDateDiff) {
			return dateUtil.formatDate(date);
		} else {
			return dayjs(date).fromNow();
		}
	},

	getDuration: (milliseconds) => dayjs.duration(milliseconds),
};
