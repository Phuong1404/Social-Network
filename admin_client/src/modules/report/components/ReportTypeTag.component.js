import { Tag } from 'antd';

const typeMap = {
	user: {
		color: 'warning',
		label: 'Người dùng',
	},
	post: {
		color: 'success',
		label: 'Bài viết',
	},
	comment: {
		color: 'default',
		label: 'Bình luận',
	},
	conversation: {
		color: 'processing',
		label: 'Cuộc trò chuyện',
	},
	bug: {
		color: 'error',
		label: 'Lỗi',
	},
};

export function ReportTypeTag({ type, ...props }) {
	const { color, label } = typeMap[type];

	return (
		<Tag color={color} {...props}>
			{label}
		</Tag>
	);
}
