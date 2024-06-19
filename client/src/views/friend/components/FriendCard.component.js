import { UserAvatar } from '@/views/user/components';
import { Button, Card, Dropdown, Popconfirm, theme, Tooltip, Typography, Image } from 'antd';
import { useRouter } from 'next/router';
import { HiDotsHorizontal } from 'react-icons/hi';
import {
	HiArrowDownOnSquareStack,
	HiChatBubbleOvalLeft,
	HiExclamationTriangle,
	HiUser,
	HiUserMinus,
	HiUserPlus,
	HiXMark,
} from 'react-icons/hi2';
import { friendRelationshipMap, relationshipColor, relationshipLabel } from '../data';
import Link from 'next/link';
import { useAuth } from '@/views/auth/hooks';
import { useReport } from '@/views/report/hooks';
import { useUserAction } from '@/views/user/hooks';

export function FriendCard({ user }) {
	const { token } = theme.useToken();

	const { authUser } = useAuth();
	const isAuthUser = authUser?._id == user._id;

	const router = useRouter();
	const type = (router.query.type) || 'friends';
	const _relationship = user.relationship || friendRelationshipMap[type] || 'none';
	const {
		relationship,
		loading,
		handleRequestFriend,
		handleCancelRequestFriend,
		handleAcceptFriend,
		handleUnfriend,
		handleChat,
		handleRejectFriend,
	} = useUserAction({ ...user, relationship: _relationship });

	const { openReport } = useReport({ type: 'user', id: user._id });
	const dropdownItems = [
		{
			key: 'report',
			icon: <HiExclamationTriangle />,
			label: 'Báo cáo',
			onClick: openReport,
		},
	];

	switch (relationship) {
		case 'friend':
			dropdownItems.unshift({
				key: 'unfriend',
				icon: <HiUserMinus />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn hủy kết bạn?"
						okText="Hủy kết bạn"
						cancelText="Thoát"
						onConfirm={handleUnfriend}
					>
						Hủy kết bạn
					</Popconfirm>
				),
			});
			break;
		case 'sent':
			dropdownItems.unshift({
				key: 'cancel',
				icon: <HiXMark />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn hủy lời mời kết bạn?"
						okText="Hủy lời mời"
						cancelText="Thoát"
						onConfirm={handleCancelRequestFriend}
					>
						Hủy lời mời
					</Popconfirm>
				),
			});
			break;
		case 'received':
			dropdownItems.unshift({
				key: 'decline',
				icon: <HiXMark />,
				danger: true,
				label: (
					<Popconfirm
						title="Bạn có chắc muốn từ chối lời mời kết bạn?"
						okText="Từ chối"
						cancelText="Thoát"
						onConfirm={handleRejectFriend}
					>
						Từ chối
					</Popconfirm>
				),
			});

			dropdownItems.unshift({
				key: 'accept',
				icon: <HiArrowDownOnSquareStack />,
				label: 'Chấp nhận lời mời',
				onClick: handleAcceptFriend,
			});
			break;
		case 'none':
			dropdownItems.unshift({
				key: 'add',
				icon: <HiUserPlus />,
				label: 'Kết bạn',
				onClick: handleRequestFriend,
			});
			break;
	}

	return (
		<Card
			hoverable
			cover={
				user.imageUrl
				? <Image
					src={user.imageUrl}
					alt={user.fullname}
					style={{ width: '100%', height: '90px', objectFit: 'cover', background: "#edfafd" }}
				/> : <div style={{ width: '100%', height: '90px', objectFit: 'cover', background: "#edfafd" }}></div>
			}
			actions={[
				<Tooltip key="profile" title="Trang cá nhân">
					<Link href={`/profile?id=${user._id}`} passHref draggable>
						<Button icon={<HiUser />} />
					</Link>
				</Tooltip>,
				<Tooltip key="message" title="Nhắn tin">
					<Button
						icon={<HiChatBubbleOvalLeft />}
						onClick={handleChat}
						disabled={isAuthUser}
						loading={loading.chat}
					/>
				</Tooltip>,
				<Dropdown key="more" menu={{ items: dropdownItems }} arrow disabled={isAuthUser} trigger={['click']}>
					<Button
						icon={<HiDotsHorizontal />}
						disabled={isAuthUser}
						loading={Object.keys(loading).some((item) => item !== 'chat' && loading[item])}
					/>
				</Dropdown>,
			]}
			bodyStyle={{ padding: 12 }}
			style={{overflow: 'hidden'}}
		>
			<Card.Meta
				avatar={<UserAvatar user={user} />}
				title={user.fullname}
				description={
					isAuthUser ? (
						'Bạn'
					) : (
						<Typography.Text strong type={relationshipColor[relationship]}>
							{relationshipLabel[relationship]}
						</Typography.Text>
					)
				}
			/>
		</Card>
	);
}
