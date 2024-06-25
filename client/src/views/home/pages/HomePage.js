import { useFetcher } from '@/common/hooks';
import Layout, { withLayout } from '@/layout/components';
import { withAuth } from '@/views/auth/components';
import SEO from '@/common/components/SEO';
import {CreatePost,ListPost} from '@/views/post/components'
import {QuickContact,ShortCut} from '@/views/home/components'
function HomePage() {
	const postFetch = useFetcher({ api: 'posts/home' });

	return (
		<>
			<SEO title="Trang chủ" />

			<Layout.Sider align="left">
				<ShortCut />
			</Layout.Sider>

			<Layout.Content>
				<CreatePost fetcher={postFetch}/>

				<ListPost fetcher={postFetch} />
			</Layout.Content>

			<Layout.Sider align="right">
				<QuickContact />
			</Layout.Sider>
		</>
	);
}

export default withAuth(withLayout(HomePage));