import { getViperBlogs } from "@/lib/vipers"
import { Blog } from "@/types/viper"
import { CommentCard } from "./CommentCard"

export async function ViperBlogs({ viperId }: { viperId: string }) {
    // Using cache pattern built on top of parallel fetching
    const viperBlogs: Blog[] = await getViperBlogs(viperId)

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
