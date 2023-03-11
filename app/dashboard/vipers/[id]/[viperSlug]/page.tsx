import { PageProps } from "../../../../../lib/getCategories"
import {
    CommentBlog,
    ExternalBlog,
    getBlogLikesAndRePosts,
} from "../../../../../lib/vipers"
import PostAndLikeCard from "../../../../profile/[profileSlug]/PostAndLikeCard"

export default async function ViperSlugPage({ params }: PageProps) {
    const viperId: string = params.id
    const blogLikesAndRePosts: CommentBlog[] & ExternalBlog[] =
        await getBlogLikesAndRePosts(viperId)
    return (
        <div>
            {blogLikesAndRePosts?.map((blog) => {
                return (
                    /* @ts-expect-error Server Component */
                    <PostAndLikeCard
                        key={JSON.stringify(blog.bloggerId)}
                        bloggerId={JSON.stringify(blog.bloggerId)}
                        blogId={JSON.stringify(blog.blogId)}
                        timestamp={blog.timestamp}
                        viperId={JSON.stringify(blog.viperId)}
                        showComment={blog.comment}
                    />
                )
            })}
        </div>
    )
}
