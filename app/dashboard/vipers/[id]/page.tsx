import { getViperById } from "../../../../lib/vipers"
import { PageProps } from "../../../../lib/utils"
import { CommentCard } from "../../../[id]/[commentId]/[viperId]/CommentCard"

export default async function ViperPage({ params }: PageProps) {
    const id: string = params.id
    const viper = await getViperById(id)
    const stringifyFullViperId = JSON.stringify(viper?._id)
    const viperId = stringifyFullViperId.replace(/['"]+/g, "")

    return (
        <div>
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
                            reply={true}
                            blog={true}
                        />
                    )
                })}
        </div>
    )
}
