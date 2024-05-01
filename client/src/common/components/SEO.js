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
				{renderOpenGraphTags(title, description, images, url)}
				{renderTwitterTags(title, description, images)}
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

function renderOpenGraphTags(title, description, images, url) {
	return (
		<>
			<meta property="og:title" content={title} key="og-title" />
			<meta property="og:description" content={description} key="og-description" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta property="og:image" content={url} key={`og-image-${index}`} />
					{alt && <meta property="og:image:alt" content={alt} key={`og-image-alt-${index}`} />}
					{width && (
						<meta property="og:image:width" content={width.toString()} key={`og-image-width-${index}`} />
					)}
					{height && (
						<meta property="og:image:height" content={height.toString()} key={`og-image-height-${index}`} />
					)}
				</>
			))}

			<meta property="og:url" content={url} key="og-url" />
			<meta property="og:site_name" content="SocialNetwork - Kết nối và sáng tạo" key="og-site_name" />
			<meta property="og:type" content="website" key="og-type" />
			<meta property="og:locale" content="vi_VN" key="og-locale" />
		</>
	);
}

function renderTwitterTags(title, description, images) {
	return (
		<>
			<meta name="twitter:card" content={description} key="twitter-card" />
			<meta name="twitter:creator" content="@SocialNetwork" key="twitter-creator" />
			<meta name="twitter:title" content={title} key="twitter-title" />
			<meta name="twitter:description" content={description} key="twitter-description" />
			{images.map(({ url, alt, width, height }, index) => (
				<>
					<meta name="twitter:image" content={url} key={`tw-image-${index}`} />
					{alt && <meta name="twitter:image:alt" content={alt} key={`tw-image-alt-${index}`} />}
					{width && (
						<meta name="twitter:image:width" content={width.toString()} key={`tw-image-width-${index}`} />
					)}
					{height && (
						<meta
							name="twitter:image:height"
							content={height.toString()}
							key={`tw-image-height-${index}`}
						/>
					)}
				</>
			))}
		</>
	);
}
