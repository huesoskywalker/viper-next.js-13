import { Comments } from "../../types/event"
import { EventCommentsCard } from "./EventCommentsCard"

export async function EventComments({
    commentsPromise,
    eventId,
}: {
    commentsPromise: Promise<Comments[] | null>
    eventId: string
}) {
    const comments: Comments[] | null = await commentsPromise
    if (!comments) throw new Error("No event bro")
    return (
        <ul>
            {comments.map((comment: Comments) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(comment.viperId)}
                        eventId={eventId}
                        replyTo={comment.eventTitle}
                        commentId={JSON.stringify(comment._id)}
                        viperId={JSON.stringify(comment.viperId)}
                        text={comment.text}
                        commentLikes={comment.likes.length}
                        commentReplies={comment.replies.length}
                        replyId={undefined}
                        timestamp={comment.timestamp}
                        reply={false}
                    />
                )
            })}
        </ul>
    )
}
