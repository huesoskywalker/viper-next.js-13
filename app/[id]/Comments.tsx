import { EventCommentsCard } from "./EventCommentsCard"
import { Comments } from "../../lib/events"
import { delay } from "../../lib/delay"

export async function Comments({
    comments,
    id,
}: {
    comments: Comments[]
    id: string
}) {
    // Normally you would fetch data here
    await delay(1500)
    return (
        <div className="space-y-6">
            <div className="space-y-8">
                {comments?.map((comment) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={JSON.stringify(comment.viperId)}
                            eventId={id}
                            viperId={JSON.stringify(comment.viperId)}
                            commentId={JSON.stringify(comment._id)}
                            text={comment.text}
                            commentLikes={comment.likes.length}
                            commentReplies={comment.replies.length}
                            timestamp={comment.timestamp}
                            event={false}
                            reply={false}
                            blog={false}
                        />
                    )
                })}
            </div>
        </div>
    )
}
