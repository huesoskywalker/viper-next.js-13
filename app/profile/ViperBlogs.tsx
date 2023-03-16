import { Blog } from "../../types/viper"
import { CommentCard } from "./CommentCard"

export async function ViperBlogs({
    blogsPromise,
    viperId,
}: {
    blogsPromise: Promise<Blog[]>
    viperId: string
}) {
    const viperBlogs: Blog[] = await blogsPromise

    return (
        <>
            <div className="space-y-4 w-full">
                {viperBlogs.map((blog: Blog) => {
                    return (
                        /* @ts-expect-error Server Component */
                        <CommentCard
                            key={JSON.stringify(blog._id)}
                            viperId={viperId}
                            commentId={JSON.stringify(blog._id)}
                            text={blog.content}
                            timestamp={blog.timestamp}
                            likes={blog.likes.length}
                            replies={blog.comments.length}
                            rePosts={blog.rePosts.length}
                            blog={true}
                        />
                    )
                })}
            </div>
        </>
    )
}
