import { swrFetcher } from '@/common/api';
import { Button, Table, Tooltip } from 'antd';
import { IoRefresh } from 'react-icons/io5';
import useSWR from 'swr';
import styles from './Table.module.scss';
import { stringUtil } from '@/common/utils';
import Icon from '@ant-design/icons';

export const useTableBase = ({ endpoint, params }) => {
	if (params?.page) {
		params.page = params.page - 1;
	}

	const swrKey = stringUtil.generateUrl(endpoint, params);
	return useSWR(swrKey, swrFetcher, {
		keepPreviousData: true,
	});
};

export function TableBase({
	endpoint,
	params: { page = 1, size = 5, key = '', filter = {} } = {},
	onPaginationChange,
	...props
}) {
	const { data, isLoading, mutate, isValidating } = useTableBase({
		endpoint,
		params: { page, size, key, filter },
	});

	return (
		<div className={styles.container}>
			<Table
				rowKey="_id"
				loading={isLoading}
				dataSource={data?.items || []}
				{...props}
				pagination={{
					current: page,
					pageSize: size,
					onChange: onPaginationChange,
					total: data?.totalItems,
					position: ['bottomRight'],
					pageSizeOptions: [5, 10, 20, 50],
					showLessItems: true,
					showSizeChanger: true,
					...props?.pagination,
				}}
			/>

			<Tooltip title="Làm mới">
				<Button
					shape="circle"
					onClick={() => mutate()}
					loading={isValidating}
					icon={<Icon component={IoRefresh} />}
					className={styles.refresh}
				/>
			</Tooltip>
		</div>
	);
}
