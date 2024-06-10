import React from 'react';
import Head from 'next/head';
import { urlUtil } from '@/common/utils';


export default function SEO({
	title = 'SocialNetwork - Kết nối và sáng tạo',
	description = 'Sáng tạo và kết nối cùng SocialNetwork - Nơi gặp gỡ những tài năng đầy tiềm năng!',
	images = [{ url: urlUtil.getFullUrl('/seo.png'), alt: 'SocialNetwork - Kết nối và sáng tạo', width: 1865, height: 937 }],

	url ='',
	children,
	robot,
}) {
	return (
		<>
			<Head>
				{renderFavicon()}
				{renderGeneralTags(title, description, url)}
				{renderRobotTags(robot)}
			</Head>

			<Head>{children}</Head>
		</>
	);
}

function renderFavicon() {
	return (
		<>
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" key="apple-touch-icon" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" key="favicon-32x32" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" key="favicon-16x16" />
			<link rel="manifest" href="/site.webmanifest" key="site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" key="safari-pinned-tab" />
			<meta name="apple-mobile-web-app-title" content="SocialNetwork" key="apple-mobile-web-app-title" />
			<meta name="application-name" content="SocialNetwork" key="application-name" />
			<meta name="msapplication-TileColor" content="#ffffff" key="msapplication-TileColor" />
			<meta name="theme-color" content="#ffffff" key="theme-color" />
		</>
	);
}
function renderGeneralTags(title, description, url) {
	return (
		<>
			<title key="title">{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
			<meta name="description" content={description} key="description" />
			<link rel="canonical" href={url} key="canonical" />
		</>
	);
}

function renderRobotTags(robot) {
	if (robot) {
		if (robot === true) {
			return <meta name="robots" content="index, follow" key="robots" />;
		}

		return (
			<meta
				name="robots"
				content={`${robot.index ? 'index' : 'noindex'}, ${robot.follow ? 'follow' : 'nofollow'}`}
				key="robots"
			/>
		);
	}

	return <meta name="robots" content="noindex, nofollow" key="robots" />;
}
