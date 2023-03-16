import { getCurrentViper } from "../../../lib/session"
import { getBlogLikesAndRePosts } from "../../../lib/vipers"
import { CommentBlog, ExternalBlog } from "../../../types/viper"
import PostAndLikeCard from "./PostAndLikeCard"

export default async function ProfileSlugPage() {
    const viper = await getCurrentViper()
    // const blogLikesAndRePosts: CommentBlog[] & ExternalBlog[] =
    //     await getBlogLikesAndRePosts(viper!.id)

    return (
        <>
            <h1 className="text-yellow-400 text-lg">Let's build it up again</h1>
        </>
        // <div className="space-y-4">
        //     {blogLikesAndRePosts?.map((blog: CommentBlog) => {
        //         return (
        //             /* @ts-expect-error Server Component */
        //             <PostAndLikeCard
        //                 key={JSON.stringify(blog.bloggerId)}
        //                 bloggerId={JSON.stringify(blog.bloggerId)}
        //                 blogId={JSON.stringify(blog.blogId)}
        //                 timestamp={blog.timestamp}
        //                 viperId={JSON.stringify(blog.viperId)}
        //                 showComment={blog.comment}
        //             />
        //         )
        //     })}
        // </div>
    )
}
