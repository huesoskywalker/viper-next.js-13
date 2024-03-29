import { Reply } from "@/types/event"
import { EventCommentsCard } from "@/app/[id]/EventCommentsCard"
import { delay } from "@/lib/delay"
import { getViperBasicsProps } from "@/lib/vipers"
import { Viper } from "@/types/viper"

export async function CommentReplies({
    repliesPromise,
    eventId,
    commentId,
    viperId,
}: {
    repliesPromise: Promise<Reply[] | null>
    eventId: string
    commentId: string
    viperId: string
}) {
    const commentViperData: Promise<Viper | null> = getViperBasicsProps(viperId)

    const [replies, commentViper] = await Promise.all([repliesPromise, commentViperData])

    if (!replies) throw new Error("No event bro")

    await delay(300)
    return (
        <ul>
            {replies.map((reply: Reply) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(reply._id)}
                        eventId={eventId}
                        replyTo={commentViper?.name}
                        commentId={commentId}
                        viperId={JSON.stringify(reply.viperId)}
                        text={reply.reply}
                        commentLikes={reply.likes.length}
                        replyId={JSON.stringify(reply._id).replace(/["']+/g, "")}
                        timestamp={reply.timestamp}
                        reply={true}
                    />
                )
            })}
        </ul>
    )
}
