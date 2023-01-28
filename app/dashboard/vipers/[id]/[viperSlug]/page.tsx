import { PageProps } from "../../../../../lib/getCategories"
import { getCurrentViper } from "../../../../../lib/session"
import { getBlogLikesAndRePosts, getViperById } from "../../../../../lib/vipers"
import PostAndLikeCard from "../../../../profile/[profileSlug]/PostAndLikeCard"

export default async function ProfileSlugPage({ params }: PageProps) {
    const viperId: string = params.id
    // const viper = await getCurrentViper()
    const blogLikesAndRePosts = await getBlogLikesAndRePosts(viperId)
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
