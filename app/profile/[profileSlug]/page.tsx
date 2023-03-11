import { getCurrentViper } from "../../../lib/session"
import {
    CommentBlog,
    ExternalBlog,
    getBlogLikesAndRePosts,
} from "../../../lib/vipers"
import PostAndLikeCard from "./PostAndLikeCard"

export default async function ProfileSlugPage() {
    const viper = await getCurrentViper()
    const blogLikesAndRePosts: CommentBlog[] & ExternalBlog[] =
        await getBlogLikesAndRePosts(viper!.id)

    return (
        <div className="space-y-4">
            {blogLikesAndRePosts?.map((blog: CommentBlog) => {
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
