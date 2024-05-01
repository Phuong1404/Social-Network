import { memo } from 'react';
import { Main } from './Main.component';
import { Sider } from './Sider.component';
import { Header } from './Header.component';
import { Content } from './Content.component';
import { Container } from './Container.component';

const Layout = {
	Main: memo(Main),
	Sider: memo(Sider),
	Header: memo(Header),
	Content: memo(Content),
	Container: memo(Container),
};

export default Layout;

export * from './withLayout.component';
