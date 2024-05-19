import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Icon from '@ant-design/icons';
import { swrFetcher } from '@/common/api';
import { Card, Col, Row, Statistic } from 'antd';
import { IoPeopleOutline } from 'react-icons/io5';

const LineChart = dynamic(() => import('@/modules/dashboard/components').then((mod) => mod.LineChart), {
	ssr: false,
});
const PieChart = dynamic(() => import('@/modules/dashboard/components').then((mod) => mod.PieChart), {
	ssr: false,
});
const UserTable = dynamic(() => import('@/modules/dashboard/components').then((mod) => mod.UserTable), {
	ssr: false,
});

export default function DashboardPage() {
	const { data, isLoading } = useSWR('/admin/dashboard', swrFetcher, {
		keepPreviousData: true,
	});

	const dashboardCard = [
		{
			title: 'Tổng số người dùng',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.totalUser,
		},
		{
			title: 'Đang hoạt động',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserOnline,
		},
		{
			title: 'Truy cập trong ngày',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numAccessInDay,
		},
		{
			title: 'Người dùng mới',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserCreateInDay,
		},
	];
	return (
		<Row gutter={[16, 16]}>
			{dashboardCard.map((item, index) => (
				<Col key={index} xs={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic {...item} valueStyle={{ fontWeight: 800 }} />
					</Card>
				</Col>
			))}

			<Col xs={24} lg={18}>
				<LineChart />
			</Col>

			<Col xs={24} lg={6}>
				<PieChart />
			</Col>

			<Col xs={24} lg={12}>
				<UserTable />
			</Col>
		</Row>
	);
}
