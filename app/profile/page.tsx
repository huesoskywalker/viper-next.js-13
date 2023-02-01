import { getCurrentViper } from "../../lib/session"
import { getViperById } from "../../lib/vipers"
import { CommentCard } from "../[id]/[commentId]/[viperId]/CommentCard"

export default async function ProfilePage() {
    const viper = await getCurrentViper()
    const fullViper = await getViperById(viper!.id)
    const stringifyFullViperId = JSON.stringify(fullViper?._id)
    const viperId = stringifyFullViperId.replace(/['"]+/g, "")

    return (
        <div>
            {fullViper?.blog
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
