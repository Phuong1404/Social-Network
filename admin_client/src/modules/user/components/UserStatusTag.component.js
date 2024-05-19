import { Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { timeUtil } from '@/common/utils';

export default function UserStatusTag({ user, ...props }) {
	let content = 'Không hoạt động';
	let color = 'default';

	const isLocked = !!user.isPermanentlyLocked;
	const isLockedTemporarily = !!user.lockTime && dayjs().isBefore(user.lockTime);
	const isOnline = user.isOnline;
	const lastAccess = user.lastAccess;

	if (isLocked) {
		content = 'Đã khóa';
		color = 'error';
	} else if (isLockedTemporarily) {
		content = 'Tạm khóa';
		color = 'warning';
	} else if (isOnline) {
		content = 'Đang hoạt động';
		color = 'success';
	} else if (lastAccess) {
		const timeAgo = timeUtil.getTimeAgo(lastAccess);
		content = `Hoạt động ${timeAgo}`;
	}

	const tooltip = isLocked || isLockedTemporarily ? `Lý do: ${user.reasonLock}` : null;

	return (
		<Tooltip title={tooltip}>
			<Tag color={color} {...props}>
				{content}
			</Tag>
		</Tooltip>
	);
}
