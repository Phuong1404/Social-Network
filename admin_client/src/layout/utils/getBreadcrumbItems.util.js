import { layoutData } from '@/layout/data';
import Link from 'next/link';

const findLayoutItem = (path, parentChildren) => {
	const item = parentChildren?.find((item) => item.path === path);

	return item || null;
};

export function getBreadcrumbItems(pathname) {
	const items = [];

	const layoutItems = [];
	const paths = pathname.split('/').filter((path) => path);
	const length = paths.length;

	for (let i = 0; i < length; i++) {
		const path = paths[i];
		const parent = i === 0 ? layoutData : layoutItems[i - 1].children;
		const layoutItem = findLayoutItem(path, parent);
		if (!layoutItem) continue;

		const isLast = i === length - 1;
		const breadcrumbPath = '/' + paths.slice(0, i + 1).join('/');
		const breadcrumbItem = {
			key: breadcrumbPath,
			title: isLast ? (
				<>
					{layoutItem.icon} {layoutItem.title}
				</>
			) : (
				<Link href={breadcrumbPath}>
					{layoutItem.icon} {layoutItem.title}
				</Link>
			),
		};

		layoutItems.push(layoutItem);
		items.push(breadcrumbItem);
	}

	if (!paths.includes('dashboard')) {
		const dashboardItem = layoutData[0];
		items.unshift({
			key: dashboardItem.path,
			title: (
				<Link href={dashboardItem.path}>
					{dashboardItem.icon} {dashboardItem.title}
				</Link>
			),
		});
	}

	return items;
}
