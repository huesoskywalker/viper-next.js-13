import { Blog, getBlog } from "../../../lib/vipers"
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
    const allBlogs: Blog[] | undefined = await getBlog(bloggerId, blogId)

    const viper_id: string = viperId.replace(/['"]+/g, "")
    const blogger_id: string = bloggerId.replace(/['"]+/g, "")
    const blog_id: string = blogId.replace(/['"]+/g, "")
    return (
        <div>
            {/* <Suspense fallback={<CommentSkeleton />}> */}
            {allBlogs?.map((blog: Blog) => {
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
