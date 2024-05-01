import { HiSparkles, HiUserGroup, HiUserPlus, HiUsers } from 'react-icons/hi2';

export const friendTypeList = [
	{
		title: 'Bạn bè',
		type: 'friends',
		Icon: HiUsers,
	},
	{
		title: 'Lời mời kết bạn',
		type: 'requests',
		Icon: HiUserPlus,
	},
	{
		title: 'Gợi ý',
		type: 'suggests',
		Icon: HiSparkles,
	},
	{
		title: 'Tất cả',
		type: 'all',
		Icon: HiUserGroup,
	},
];
