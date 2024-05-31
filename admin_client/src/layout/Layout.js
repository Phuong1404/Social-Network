import Icon, { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Badge, Breadcrumb, Button, Dropdown, Layout as AntdLayout, Menu, message, Space, Switch, theme } from 'antd';
import { useState, useEffect } from 'react';
import { IoLogOutOutline, IoMailOutline, IoNotificationsOutline, IoPersonCircleOutline, IoPersonOutline, IoSettingsOutline } from 'react-icons/io5';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import styles from './styles/Layout.module.scss';
import { useTheme } from '@/layout/hooks';
import { getBreadcrumbItems } from './utils';
import { useAuth } from '@/views/auth/hooks';
import { layoutData } from '@/layout/data';
const { Sider, Header, Content } = AntdLayout;

function getLayoutMenuItems(data) {
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

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const isAuth = !!user;

  const router = useRouter();
  const { pathname } = router;
  const [collapsed, setCollapsed] = useState(true);
  const { token } = theme.useToken();
  const { colorBgBase } = token;
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuth) {
      router.replace('/login', undefined, { shallow: true });
    }
  }, [isAuth, router]);

  const userDropdownItems = [
    {
      key: 'setting',
      label: 'Cài đặt',
      icon: <Icon component={IoSettingsOutline} />,
      onClick: () => message.info('Chức năng đang phát triển'),
    },
    {
      key: 'account',
      label: 'Tài khoản',
      icon: <Icon component={IoPersonCircleOutline} />,
      onClick: () => message.info('Chức năng đang phát triển'),
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <Icon component={IoLogOutOutline} />,
      onClick: logout,
    },
  ];

  const selectedKey = pathname.split('/').slice(1).reverse()[0];
  const onMenuSelect = ({ keyPath }) => {
    const path = '/' + keyPath.reverse().join('/');

    router.push(path);
  };

  const breadcrumbItems = getBreadcrumbItems(pathname);

  const menuItems = getLayoutMenuItems(layoutData);

  return (
    <AntdLayout className={styles.layout}>
      <Sider
        className={styles.sider}
        collapsible
        trigger={null}
        collapsed={collapsed}
        style={{ backgroundColor: colorBgBase }}
      >
        <Space className={styles.logo}>
          <img src="/tana.svg" alt="logo" />
          {!collapsed && <span>Admin TaNa</span>}
        </Space>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onSelect={onMenuSelect}
          className={styles.menu}
        />
      </Sider>

      <AntdLayout>
        <Header className={styles.header} style={{ backgroundColor: colorBgBase }}>
          {/* Left */}
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              size="large"
            />
            <Breadcrumb items={breadcrumbItems} />
          </Space>

          {/* Right */}
          <Space style={{ float: 'right' }}>
            <Switch
              className={styles.theme_switch}
              checkedChildren={<Icon component={RiMoonFill} className={styles.theme_icon} />}
              unCheckedChildren={<Icon component={RiSunFill} className={styles.theme_icon} />}
              checked={mode == 'dark'}
              onChange={toggleTheme}
            />

            <Badge count={5}>
              <Button type="text" icon={<Icon component={IoMailOutline} />} size="large" shape="circle" />
            </Badge>

            <Badge count={5}>
              <Button
                type="text"
                icon={<Icon component={IoNotificationsOutline} />}
                size="large"
                shape="circle"
              />
            </Badge>

            <Dropdown menu={{ items: userDropdownItems }} trigger={['click']} arrow>
              <Button
                type="text"
                icon={<Icon component={IoPersonOutline} />}
                size="large"
                shape="circle"
              />
            </Dropdown>
          </Space>
        </Header>
        <Content className={styles.content}>
          {children} 
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
}
