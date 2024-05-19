import Icon from '@ant-design/icons';
import { IoListOutline, IoPeopleOutline, IoPersonOutline } from 'react-icons/io5';
import { RiHome4Line, RiShieldUserLine } from 'react-icons/ri';
import { BsExclamationTriangle } from 'react-icons/bs';

import UserPage from '@/modules/user/pages/UserPage.page';
import AdminPage from '@/modules/admin/pages/AdminPage.page';
import DashboardPage from '@/modules/dashboard/pages/Dashboard.page';
import ReportPage from '@/modules/report/pages/ReportPage.page';
import ListPage from '@/modules/list/pages/ListPage.page';

export const layoutData = [
	{
		path: 'dashboard',
		title: 'Trang chủ',
		icon: <Icon component={RiHome4Line} />,
		element: <DashboardPage />,
	},
	{
		path: 'account',
		title: 'Tài khoản',
		icon: <Icon component={IoPeopleOutline} />,
		children: [
			{
				path: 'user',
				title: 'Người dùng',
				icon: <Icon component={IoPersonOutline} />,
				element: <UserPage />,
			},
			{
				path: 'admin',
				title: 'Quản trị viên',
				icon: <Icon component={RiShieldUserLine} />,
				element: <AdminPage />,
			},
		],
	},
	{
		path: 'report',
		title: 'Báo cáo',
		icon: <Icon component={BsExclamationTriangle} />,
		element: <ReportPage />,
	},
	{
		path: 'list',
		title: 'Danh sách',
		icon: <Icon component={IoListOutline} />,
		element: <ListPage />,
	},
];
