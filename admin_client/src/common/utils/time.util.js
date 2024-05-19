import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeUtil = {
	getTimeAgo: (time) => dayjs(time).fromNow(),

	formatDate: (time, format = 'DD/MM/YYYY') => dayjs(time).format(format),
};
