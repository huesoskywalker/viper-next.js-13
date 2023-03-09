import { getBlog } from "../../../lib/vipers"
import { CommentCard } from "../CommentCard"

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

    const viper_id = viperId.replace(/['"]+/g, "")
    const blogger_id = bloggerId.replace(/['"]+/g, "")
    const blog_id = blogId.replace(/['"]+/g, "")
    // const viper_id = JSON.stringify(viperId)
    return (
        <div>
            {/* <Suspense fallback={<CommentSkeleton />}> */}
            {allBlogs?.map((blog) => {
                return (
                    /* @ts-expect-error Server Component */
                    <CommentCard
                        key={JSON.stringify(blog._id)}
                        eventId={blogger_id}
                        viperId={viper_id}
                        commentId={blog_id}
                        text={blog.content}
                        timestamp={blog.timestamp}
                        likes={blog.likes?.length}
                        replies={blog.comments?.length}
                        rePosts={blog.rePosts.length}
                        event={false}
                        reply={true}
                        blog={true}
                        showComment={showComment}
                    />
                )
            })}
            {/* </Suspense> */}
        </div>
    )
}
