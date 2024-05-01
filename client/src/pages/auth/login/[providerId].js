import ProviderAuthPage from '@/modules/auth/pages/ProviderAuthPage';
import { authProviders } from '@/modules/auth/data';

export const getStaticPaths = async () => ({
	paths: authProviders.map((provider) => ({ params: { providerId: provider.id } })),
	fallback: false,
});

export const getStaticProps = async ({ params }) => {
	const { providerId } = params;

	const provider = authProviders.find((p) => p.id === providerId);
	if (!provider) return { redirect: { destination: '/auth/login', permanent: false } };

	return {
		props: { provider },
	};
};

export default ProviderAuthPage;
