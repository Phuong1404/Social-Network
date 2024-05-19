import { Button, List, Tooltip } from 'antd';
import useSWR from 'swr';
import { swrFetcher } from '@/common/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { HiEye } from 'react-icons/hi2';
import { stringUtil, timeUtil } from '@/common/utils';
import Icon from '@ant-design/icons';

function HistoryTab({ user }) {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);

	useEffect(() => {
		const pageQuery = Number(router.query.page) || 1;
		const sizeQuery = Number(router.query.size) || 10;
		setPage(pageQuery);
		setSize(sizeQuery);
	}, [router.query.page, router.query.size]);

	const changePage = (page) => {
		router.push({
			pathname: router.pathname,
			query: { ...router.query, page },
		});
	};

	const changeSize = (size) => {
		router.push({
			pathname: router.pathname,
			query: { ...router.query, size },
		});
	};

	const swrKey = stringUtil.generateUrl(`admin/activityUser/${user._id}`, { page: page - 1, size });
	const { data: res, isLoading } = useSWR(swrKey, swrFetcher, {
		keepPreviousData: true,
	});

	const [totalItems, setTotalItems] = useState(0);
	useEffect(() => {
		if (res?.totalItems) setTotalItems(res.totalItems);
	}, [res?.totalItems]);

	return (
		<List
			dataSource={res?.items}
			loading={isLoading}
			renderItem={(item) => (
				<List.Item
					extra={
						<Tooltip key="link" title="Xem chi tiết">
							<Button type="text" icon={<Icon component={HiEye} />} disabled href={item.link} />
						</Tooltip>
					}
				>
					<List.Item.Meta title={item.content} description={timeUtil.getTimeAgo(item.createdAt)} />
				</List.Item>
			)}
			pagination={{
				current: page,
				onChange: (page) => changePage(page),
				onShowSizeChange: (_, size) => changeSize(size),
				position: 'top',
				total: totalItems,
				pageSize: size,
			}}
		/>
	);
}

export default HistoryTab;
