import { Tag } from 'antd';

const statusMap = {
	pending: {
		color: 'warning',
		label: 'Đang chờ',
	},
	approved: {
		color: 'success',
		label: 'Đã duyệt',
	},
	rejected: {
		color: 'error',
		label: 'Đã từ chối',
	},
};


export function ReportStatusTag({ status, ...props }) {
	const { color, label } = statusMap[status];

	return (
		<Tag color={color} {...props}>
			{label}
		</Tag>
	);
}
