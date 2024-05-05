import { PrivacyDropdown } from '@/common/components/Button';
import { useAuth } from '@/views/auth/hooks';
import { genderOptions } from '@/views/user/data';
import { useUserContext } from '@/views/user/hooks';
import { Button, Card, Dropdown, List, Space, Typography } from 'antd';
import { toast } from 'react-hot-toast';
import { HiPencil } from 'react-icons/hi2';
import { ContactList, EducationList, WorkList } from '../lists';
import { capitalize } from 'lodash';

export const InfoTab = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();

	const handleChangeField = (field) => (value) => {
		if (value === user[field]) return;

		updateAuthUser({ [field]: value })
			.then(() => toast.success('Cập nhật thành công!'))
			.catch(() => toast.error('Cập nhật thất bại!'));
	};

	const gender = genderOptions.find((item) => item.value === user.gender?.value);
	const updateGender = (data) => handleChangeField('gender')({ ...user.gender, ...data });

	return (
		<Card title="Thông tin cá nhân">
			<List>
				<List.Item>
					<List.Item.Meta
						title="Họ và tên"
						description={
							<Typography.Text
								editable={
									isCurrentUser && {
										icon: <HiPencil />,
										tooltip: 'Chỉnh sửa',
										onChange: handleChangeField('fullname'),
										triggerType: ['icon', 'text'],
									}
								}
							>
								{user.fullname}
							</Typography.Text>
						}
					/>
				</List.Item>

				{gender && (
					<List.Item
						actions={
							isCurrentUser
								? [
										<PrivacyDropdown
											key="privacy"
											value={user.gender?.privacy}
											onChange={(privacy) => updateGender({ privacy })}
										/>,
										<Dropdown
											key="edit"
											menu={{
												items: genderOptions.map(({ Icon, label, value }) => ({
													key: value,
													label: (
														<Space>
															<Icon /> {capitalize(label)}
														</Space>
													),
													value,
													disabled: value === gender.value,
													onClick: () => updateGender({ value }),
												})),
											}}
											arrow
											trigger={['click']}
										>
											<Button type="text" icon={<HiPencil />} />
										</Dropdown>,
								  ]
								: []
						}
					>
						<List.Item.Meta
							title="Giới tính"
							description={
								<Space>
									<gender.Icon />

									<Typography.Text>{capitalize(gender.label)}</Typography.Text>
								</Space>
							}
						/>
					</List.Item>
				)}

				<List.Item>
					<List.Item.Meta title="Email" description={<Typography.Text>{user.email}</Typography.Text>} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Liên hệ" description={<ContactList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Công việc" description={<WorkList />} />
				</List.Item>

				<List.Item>
					<List.Item.Meta title="Học vấn" description={<EducationList />} />
				</List.Item>
			</List>
		</Card>
	);
};
