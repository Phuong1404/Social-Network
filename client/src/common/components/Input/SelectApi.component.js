import { Select } from 'antd';
import { stringUtil } from '@/common/utils';

export function SelectApi({
	fetcher,
	scrollThreshold = 100,
	toOption,
	renderOption,
	...props
}) {
	const handeScroll = (e) => {
		const isBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) < scrollThreshold;
		
		const needMore = isBottom && fetcher.hasMore;

		if (needMore && !fetcher.fetching) fetcher.loadMore();
	};

	return (
		<Select

			loading={fetcher.fetching || (fetcher.hasMore && fetcher.data.length === 0)}
			onPopupScroll={handeScroll}
			filterOption={(input, option) => {
				const label = option?.label?.toString() || '';
				return stringUtil.search(label, input, { normalize: true, ignoreCase: true });
			}}
			showSearch
			{...props}
		>
			{renderOption &&
				fetcher.data.map((item) => <Select.Option key={item._id}>{renderOption(item)}</Select.Option>)}
		</Select>
	);
}
