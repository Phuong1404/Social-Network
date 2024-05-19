import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Typography } from 'antd';
import { ReportStatusTag } from '@/modules/report/components';
import { ReportTypeTag } from '@/modules/report/components/ReportTypeTag.component';
const PageTableBase = dynamic(() => import('@/common/components/PageTableBase').then((mod) => mod.PageTableBase), {
	ssr: false,
});
const columns = [
	{
		key: 'type',
		title: 'Loại',
		dataIndex: 'type',
		render: (type) => <ReportTypeTag type={type} />,
	},
	{
		key: 'status',
		title: 'Trạng thái',
		dataIndex: 'status',
		render: (status) => <ReportStatusTag status={status} />,
		width: 120,
	},
	{
		key: 'content',
		title: 'Nội dung',
		dataIndex: 'description',
		render: (description, { reporter, title }) => (
			<Typography>
				<Typography.Title level={5}>
					<b>Tiêu đề:</b> {title}
				</Typography.Title>

				<Typography.Paragraph>
					<b>Người báo cáo: </b>

					<span onClick={() => router.push(`/account/user/${reporter._id}`)}>
						{reporter.fullname}
					</span>
				</Typography.Paragraph>

				<Typography.Paragraph ellipsis={{ rows: 4 }} style={{ textAlign: 'justify' }}>
					<b>Mô tả:</b> {description}
				</Typography.Paragraph>
			</Typography>
		),
	},
];

export default function ReportPage() {
	const router = useRouter();

	return (
		<PageTableBase
			header="Báo cáo"
			endpoint="/reports"
			columns={columns}
			onRow={(record) => ({
				style: { cursor: 'pointer' },
				onClick: () => router.push(`/report/${record._id}`),
			})}
		/>
	);
}
