import { Button, Card, Input, Space } from 'antd';
import { TableBase, useTableBase } from '../Table';
import { HiOutlineFilter } from 'react-icons/hi';
import React, { useRef,useState } from 'react';

export const usePageTableBase = ({ endpoint }) => {
	const [key, setKey] = useState('');
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(5);
	const [filter, setFilter] = useState({});
  
	const handleSearch = (value) => {
	  setKey(value);
	  setPage(1); // Reset to the first page on new search
	};
  
	const typingTimeoutRef = useRef();
	const handleChange = (e) => {
	  const value = e.target.value;
	  if (typingTimeoutRef.current) {
		clearTimeout(typingTimeoutRef.current);
	  }
  
	  typingTimeoutRef.current = setTimeout(() => {
		handleSearch(value);
	  }, 800);
	};
  
	const handlePagination = (nextPage, pageSize = size) => {
	  setPage(nextPage);
	  setSize(pageSize);
	};
  
	const tableBase = useTableBase({ endpoint, params: { page, size, key, filter } });
  
	return { key, page, size, filter, handleSearch, handleChange, handlePagination, tableBase };
  };

export function PageTableBase({ header, endpoint, actions, ...props }) {
	const { key, page, size, filter, handleSearch, handleChange, handlePagination } = usePageTableBase({
		endpoint,
	});

	return (
		<Card
			title={header}
			extra={
				<Space>
					<Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} onChange={handleChange} />

					<Button icon={<HiOutlineFilter />}>Lọc</Button>

					{actions}
				</Space>
			}
			bodyStyle={{ padding: 12 }}
		>
			<TableBase
				endpoint={endpoint}
				params={{ page, size, key, filter }}
				onPaginationChange={handlePagination}
				{...props}
			/>
		</Card>
	);
}
