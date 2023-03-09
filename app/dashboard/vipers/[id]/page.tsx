import { getViperById } from "../../../../lib/vipers"
import { PageProps } from "../../../../lib/utils"
import { CommentCard } from "../../../profile/CommentCard"
import { Suspense } from "react"
import Loading from "./loading"

export default async function ViperPage({ params }: PageProps) {
    const id: string = params.id
    const viper = await getViperById(id)
    const stringifyFullViperId = JSON.stringify(viper?._id)
    const viperId = stringifyFullViperId.replace(/['"]+/g, "")

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {viper?.blog
                    ?.sort((a, b) => b.timestamp - a.timestamp)
                    .map((blog) => {
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
                                event={false}
                                reply={true}
                                blog={true}
                            />
                        )
                    })}
            </Suspense>
        </div>
    )
}
