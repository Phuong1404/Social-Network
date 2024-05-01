import { UserType } from '@/modules/user/types';
import { dateUtil } from '@/common/utils';

export const getConversationInfo = (conversation, authUser) => {
	const isDirect = conversation.members.length === 2;
	const receiver = isDirect ? conversation.members.find((member) => member.user._id !== authUser._id) : null;

	const name = isDirect ? receiver?.nickname || receiver?.user.fullname : conversation.name;
	const description = isDirect
		? receiver?.user.isOnline
			? 'Đang hoạt động'
			: receiver?.user.lastAccess
			? `Hoạt động ${dateUtil.getTimeAgo(receiver?.user.lastAccess)}`
			: 'Không hoạt động'
		: `${conversation.members.length} thành viên`;

	return { isDirect, receiver, name, description };
};
