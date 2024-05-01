import Reaction from '@/assets/icons/reactions';
import { HiGlobeAsiaAustralia, HiLockClosed, HiUserMinus, HiUserPlus, HiUsers } from 'react-icons/hi2';
export const privacyOptions = [
	{
		value: 'public',
		label: 'Công khai',
		RIcon: HiGlobeAsiaAustralia,
	},
	{
		value: 'private',
		label: 'Chỉ mình tôi',
		RIcon: HiLockClosed,
	},
	{
		value: 'friends',
		label: 'Bạn bè',
		RIcon: HiUsers,
	},
	{
		value: 'includes',
		label: 'Bạn bè bao gồm',
		RIcon: HiUserPlus,
	},
	{
		value: 'excludes',
		label: 'Bạn bè ngoại trừ',
		RIcon: HiUserMinus,
	},
];
export const getPrivacyOption = (value = 'public') =>
	privacyOptions.find((option) => option.value === value);

export const contactOptions = [
	{
		value: 'phone',
		label: 'Điện thoại',
	},
	{
		value: 'email',
		label: 'Email',
	},
	{
		value: 'facebook',
		label: 'Facebook',
	},
	{
		value: 'twitter',
		label: 'Twitter',
	},
	{
		value: 'instagram',
		label: 'Instagram',
	},
	{
		value: 'github',
		label: 'Github',
	},
	{
		value: 'linkedin',
		label: 'Linkedin',
	},
	{
		value: 'youtube',
		label: 'Youtube',
	},
	{
		value: 'website',
		label: 'Website',
	},
];

export const educationOptions = [
	{
		value: 'primary',
		label: 'Tiểu học',
	},
	{
		value: 'secondary',
		label: 'Trung học cơ sở',
	},
	{
		value: 'high',
		label: 'Trung học phổ thông',
	},
	{
		value: 'university',
		label: 'Đại học',
	},
	{
		value: 'master',
		label: 'Thạc sĩ',
	},
	{
		value: 'doctor',
		label: 'Tiến sĩ',
	},
];

export const workOptions = [
	{
		value: 'intern',
		label: 'Thực tập',
	},
	{
		value: 'parttime',
		label: 'Bán thời gian',
	},
	{
		value: 'fulltime',
		label: 'Toàn thời gian',
	},
];

export const reactOptions = [
	{
		img: Reaction.Like.src,
		label: 'Thích',
		value: 'like',
	},
	{
		img: Reaction.Love.src,
		label: 'Yêu thích',
		value: 'love',
	},
	{
		img: Reaction.Haha.src,
		label: 'Haha',
		value: 'haha',
	},
	{
		img: Reaction.Wow.src,
		label: 'Wow',
		value: 'wow',
	},
	{
		img: Reaction.Sad.src,
		label: 'Buồn',
		value: 'sad',
	},
	{
		img: Reaction.Angry.src,
		label: 'Phẫn nộ',
		value: 'angry',
	},
];
