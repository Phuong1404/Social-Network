import { useFetcher } from '@/common/hooks';
import Layout, { withLayout } from '@/layout/components';
import { withAuth } from '@/views/auth/components';
import SEO from '@/common/components/SEO';
import {CreatePost,ListPost} from '@/views/post/components'
import {QuickContact,ShortCut} from '@/views/home/components'
function HomePage() {
	const postFetch = useFetcher({ api: 'posts/home' });

	return (
		<div>
			<SEO title="Trang chủ" />

			<Layout.Sider align="left">
				<ShortCut />
			</Layout.Sider>

			<Layout.Content>
				<CreatePost fetcher={postFetch} style={{ marginBottom: 16 }} />

				<ListPost fetcher={postFetch} />
			</Layout.Content>

			<Layout.Sider align="right">
				<QuickContact />
			</Layout.Sider>
		</div>
	);
}

export default withAuth(withLayout(HomePage));