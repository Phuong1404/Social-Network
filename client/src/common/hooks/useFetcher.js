import { swrFetcher } from '@/common/api';
import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { urlUtil } from '@/common/utils';
import useSWR, { useSWRConfig } from 'swr';


export const useFetcher =({
	api,
	limit = 20,
	params = {},
}) => {
	const getKey = useCallback(
		(pageIndex, prevData) => {
			if (pageIndex === 0) return urlUtil.generateUrl(api, { ...params, size: limit });

			const prevOffset = Number(prevData?.offset) || 0;
			const prevItems = prevData?.items || [];


			const offset = prevOffset + prevItems.length;
			return urlUtil.generateUrl(api, { ...params, offset, size: limit });
		},
		[limit, api, params]
	);

	const {
		data: listRes,
		isLoading: fetching,
		isValidating: validating,
		mutate,
		size: page,
		setSize: setPage,
	} = useSWRInfinite(getKey, swrFetcher);
	const lastRes = listRes?.[listRes.length - 1];
	const hasMore = !!lastRes && page < lastRes.totalPages;

	const resData = listRes?.flatMap((res) => res.items) || [];
	const [data, setData] = useState(resData);
	useEffect(() => {
		if (!validating) {
			const isSame =
				data.length === resData.length &&
				resData.every((item, index) => JSON.stringify(item) === JSON.stringify(data[index]));
			if (!isSame) setData(resData);
		}
	}, [validating]);

	const addData = (newData) => setData((prevData) => [newData, ...prevData]);

	const updateData = (id, newData) =>
		setData((prevData) => prevData.map((item) => (item._id === id ? newData : item)));

	const removeData = (id) => setData((prevData) => prevData.filter((item) => item._id !== id));

	const [loadingMore, setLoadingMore] = useState(false);
	const loadMore = () => {
		if (loadingMore || !hasMore) return;

		setLoadingMore(true);
		setPage(page + 1).finally(() => setLoadingMore(false));
	};

	return {
		data,
		listRes,
		params,
		fetching,
		loadingMore,
		validating,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
		mutate,
	};
};

export const useSWRFetcher = ({
	api,
	limit = 20,
	params: initParams = {},
}) => {
	const [data, setData] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [params, setParams] = useState(initParams);
	const { page = 0, size = limit, offset = page * size } = params;

	const { mutate: globalMutate } = useSWRConfig();
	const swrKey = urlUtil.generateUrl(api, { ...params, offset, size });
	const { data: res, isValidating, isLoading, mutate } = useSWR(swrKey, swrFetcher);
	useEffect(() => {
		if (res) {
			const { items, totalItems, offset } = res;
			setData((prevData) => {
				const newData = [...prevData];
				newData.splice(offset, items.length, ...items);
				return [...newData];
			});
			setHasMore(offset + items.length < totalItems);
		}
	}, [res]);

	const addData = async (newData) => {
		setData((prevData) => {
			const newDataList = [newData, ...prevData];

			return newDataList;
		});

		const swrKey = urlUtil.generateUrl(api, { ...params, offset: 0, size: limit });
		await globalMutate(swrKey);
	};

	const updateData = async (id, newData) => {
		const index = data.findIndex((item) => item._id === id);
		if (index === -1) return;

		const newDataList = [...data];
		newDataList[index] = newData;
		setData(newDataList);

		const page = Math.floor(index / limit);
		const swrKey = urlUtil.generateUrl(api, { ...params, offset: page, size: limit });
		await globalMutate(swrKey);
	};

	const removeData = async (id) => {
		const index = data.findIndex((item) => item._id === id);
		if (index === -1) return;

		const newDataList = [...data];
		newDataList.splice(index, 1);
		setData(newDataList);

		const page = Math.floor(index / limit);
		const swrKey = urlUtil.generateUrl(api, { ...params, offset: page, size: limit });
		await globalMutate(swrKey);
	};

	const loadMore = () => {
		if (isLoading || !hasMore) return;

		const newParams = { ...params, page: page + 1 };
		setParams(newParams);
	};

	return {
		data,
		res,
		params,
		fetching: isLoading && data.length === 0,
		loadingMore: isLoading,
		validating: isValidating,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
		mutate,
	};
};
