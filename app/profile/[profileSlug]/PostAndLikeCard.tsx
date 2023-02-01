import { getBlog } from "../../../lib/vipers"
import { CommentCard } from "../../[id]/[commentId]/[viperId]/CommentCard"

export default async function PostAndLikeCard({
    bloggerId,
    blogId,
    viperId,
    timestamp,
    showComment,
}: {
    bloggerId: string
    blogId: string
    viperId: string
    timestamp: number
    showComment: string
}) {
    const allBlogs = await getBlog(bloggerId, blogId)
    // console.log(allBlogs)
    // console.log(`-----------`)

    const viper_id = viperId.replace(/['"]+/g, "")
    // const viper_id = JSON.stringify(viperId)
    return (
        <div>
            {allBlogs?.map((blog) => {
                return (
                    /* @ts-expect-error Server Component */
                    <CommentCard
                        key={JSON.stringify(blog._id)}
                        eventId={bloggerId}
                        viperId={viper_id}
                        commentId={blogId}
                        text={blog.content}
                        timestamp={blog.timestamp}
                        likes={blog.likes?.length}
                        replies={blog.comments?.length}
                        rePosts={blog.rePosts.length}
                        reply={false}
                        blog={true}
                        showComment={showComment}
                    />
                )
            })}
        </div>
    )
}
