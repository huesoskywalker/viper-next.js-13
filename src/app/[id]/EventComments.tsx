import { Comments } from "@/types/event"
import { EventCommentsCard } from "./EventCommentsCard"

export async function EventComments({
    // commentsPromise,
    eventId,
}: {
    // commentsPromise: Promise<Comments[] | null>
    eventId: string
}) {
    const eventComments = await fetch(`http://localhost:3000/api/event/comment/${eventId}`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        cache: "no-cache",
    })
    const responseComments: [{ _id: string; title: string; comment: Comments }] =
        await eventComments.json()
    // const comments: Comments[] | null = await commentsPromise
    if (!responseComments) throw new Error("No comments bro")
    return (
        <ul>
            {responseComments.map((commentsData) => {
                const { _id, title, comment } = commentsData
                return (
                    /* @ts-expect-error Async Server Component */
                    <EventCommentsCard
                        key={JSON.stringify(comment.viperId)}
                        eventId={_id}
                        replyTo={title}
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
