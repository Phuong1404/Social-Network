import { urlUtil } from '@/common/utils';
import { Button, Popover, Space } from 'antd';
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TelegramIcon,
	TelegramShareButton,
} from 'next-share';

export function SharePopover({ link, onShare, ...props }) {
	const url = urlUtil.getFullUrl(link);
	return (
		<Popover
			content={
				<Space direction="vertical">
					<FacebookShareButton url={url}>
						<Button 
							icon={<FacebookIcon size={24} round />} 
							onClick={onShare} 
							styles={{icon: {lineHeight: 0}}}
							style={{width: 120, justifyContent: 'flex-start' }}	
						>
							Facebook
						</Button>
					</FacebookShareButton>

					<LinkedinShareButton url={url}>
						<Button 
							icon={<LinkedinIcon size={24} round />} 
							onClick={onShare} 
							styles={{icon: {lineHeight: 0}}}
							style={{width: 120, justifyContent: 'flex-start' }}	
						>
							Linkedin
						</Button>
					</LinkedinShareButton>

					<TelegramShareButton url={url}>
						<Button 
							icon={<TelegramIcon size={24} round />} 
							onClick={onShare} 
							styles={{icon: {lineHeight: 0}}}
							style={{width: 120, justifyContent: 'flex-start' }}	
						>
							Telegram
						</Button>
					</TelegramShareButton>
				</Space>
			}
			trigger={['click']}
			{...props}
		/>
	);
}
