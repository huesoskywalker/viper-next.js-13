// import { getViperBlogs } from "@/lib/vipers"
import { MyBlog } from "@/types/viper"
import { CommentCard } from "./CommentCard"

export async function ViperBlogs({ viperId }: { viperId: string }) {
    // Using cache pattern built on top of parallel fetching
    const fetchBlogs = await fetch("http://localhost:3000/api/viper/blog/all", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            viper_id: viperId,
        }),
        // IN here there is a preloadCache, I'm releasing it for TEST
        // So I can get instant server side render
        // Gotta figure out how to revalidate the page once a post is created.
        // On Demand revalidation ?
        cache: "no-cache",
        next: {
            revalidate: 60,
        },
    })
    const viperBlogs: MyBlog[] = await fetchBlogs.json()
    {
        /**
         * Wondering if this fetch way or the one above is a better practice.
         * I'm using the fetch pattern so I can revalidate and catch data in the edge
         * As well, preloading data on the page
         */
    }
    // const viperBlogs: Blog[] = await getViperBlogs(viperId)

    return (
        <>
            <div className="space-y-4 w-full">
                {viperBlogs.map((blog: MyBlog) => {
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
