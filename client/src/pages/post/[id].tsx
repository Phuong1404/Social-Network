import { getPostApi } from '@/modules/post/api';
import PostPage, { PostSEO } from '@/modules/post/pages/PostPage';
import { ApiError } from '@/common/api';

export const getServerSideProps = async ({ params }) => {
    const id = params?.id;
    const props = { id };
    try {
        props.post = await getPostApi(id, true);
    } catch (e) {
        if (ApiError.isApiError(e)) props.error = e.toObject();
        else props.ersror = ApiError.fromError(e).toObject();
    }

    return { props };
};

export default function Post({ post, id, error }) {
    return (
        <>
            <PostSEO id={id} post={post} error={error && ApiError.fromObject(error)} />
            <PostPage post={post} />
        </>
    );
}
