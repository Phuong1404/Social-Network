import React, { forwardRef } from 'react';
import NavBar from './NavBar';
import Layout from '.';

export const Container = forwardRef((props, ref) => (
	<>
		<NavBar />
		<Layout.Main {...props} ref={ref} />
	</>
));
