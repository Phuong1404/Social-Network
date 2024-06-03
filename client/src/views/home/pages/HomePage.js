import { useFetcher } from '@/common/hooks';
import Layout, { withLayout } from '@/layout/components';
import { withAuth } from '@/views/auth/components';
import SEO from '@/common/components/SEO';
import dynamic from 'next/dynamic';

const CreatePost = dynamic(() => import('@/views/post/components').then((mod) => mod.CreatePost));
const ListPost = dynamic(() => import('@/views/post/components').then((mod) => mod.ListPost));

const QuickContact = dynamic(() => import('@/views/home/components').then((mod) => mod.QuickContact));
const ShortCut = dynamic(() => import('@/views/home/components').then((mod) => mod.ShortCut));

function HomePage() {
	const postFetch = useFetcher({ api: 'posts/home' });

	return (
		<>
			<SEO title="Trang chủ" />

			<Layout.Sider align="left">
				<ShortCut />
			</Layout.Sider>

			<Layout.Content>
				<CreatePost fetcher={postFetch} style={{ marginBottom: 16, boxShadow: 'rgba(0, 119, 182, 0.25) 0px 0px 4px',}} />

				<ListPost fetcher={postFetch} />
			</Layout.Content>

			<Layout.Sider align="right">
				<QuickContact />
			</Layout.Sider>
		</>
	);
}

export default withAuth(withLayout(HomePage));
