import Layout from '@/layout/components';
import NavBar from './NavBar';
import React from 'react';

export function withLayout(Component) {
	const Container = (props) => (
		<>
			<NavBar />

			<Layout.Main>
				<Component {...props} />
			</Layout.Main>
		</>
	);
	if (Component.getInitialProps) {
		Container.getInitialProps = Component.getInitialProps;
	}
	return Container;
}
