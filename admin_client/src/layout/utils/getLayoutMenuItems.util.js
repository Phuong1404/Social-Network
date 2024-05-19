import { layoutData } from '@/layout/data';

export default function getLayoutMenuItems(data = layoutData) {
	const items = [];

	for (const item of data) {
		items.push({
			key: item.path,
			icon: item.icon,
			label: item.title,
			children: item.children && getLayoutMenuItems(item.children),
		});
	}

	return items;
}
