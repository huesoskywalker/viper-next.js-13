import { Suspense } from "react"
import { getCurrentViper } from "../../lib/session"
import { Blog, Viper, getViperById } from "../../lib/vipers"
import { CommentCard } from "./CommentCard"
import Loading from "./loading"

export default async function ProfilePage() {
    const viper = await getCurrentViper()
    const fullViper: Viper | undefined = await getViperById(viper!.id)
    const stringifyFullViperId: string = JSON.stringify(fullViper?._id)
    const viperId: string = stringifyFullViperId.replace(/['"]+/g, "")

    return (
        <div className="space-y-4">
            <Suspense fallback={<Loading />}>
                {fullViper?.blog
                    ?.sort((a, b) => b.timestamp - a.timestamp)
                    .map((blog: Blog) => {
                        return (
                            /* @ts-expect-error Server Component */
                            <CommentCard
                                key={JSON.stringify(blog._id)}
                                eventId={viperId}
                                viperId={viperId}
                                commentId={JSON.stringify(blog._id)}
                                text={blog.content}
                                timestamp={blog.timestamp}
                                likes={blog.likes.length}
                                replies={blog.comments?.length}
                                rePosts={blog.rePosts.length}
                                reply={false}
                                blog={true}
                            />
                        )
                    })}
            </Suspense>
        </div>
    )
}
