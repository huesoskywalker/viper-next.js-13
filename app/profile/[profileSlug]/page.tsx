import { getCurrentViper } from "../../../lib/session"
import { getBlogLikesAndRePosts } from "../../../lib/vipers"
import PostAndLikeCard from "./PostAndLikeCard"

export default async function ProfileSlugPage() {
    const viper = await getCurrentViper()
    const blogLikesAndRePosts = await getBlogLikesAndRePosts(viper!.id)

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
