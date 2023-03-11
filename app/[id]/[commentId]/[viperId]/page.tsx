import { PageProps } from "../../../../lib/getCategories"
import {
    Comments,
    Reply,
    getEventComment,
    getEventReplies,
} from "../../../../lib/events"
import { EventCommentsCard } from "../../EventCommentsCard"
import { delay } from "../../../../lib/delay"

export default async function CommentIdPage({ params }: PageProps) {
    const eventId: string = params.id
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    // Added interface Comments but the comment.comments.[$winded]
    const eventComment: Comments[] = await getEventComment(eventId, commentId)
    // same here with <Reply> on the () =>
    const eventReplies: Reply[] = await getEventReplies(
        eventId,
        commentId,
        viperId
    )

    await delay(1500)
    return (
        <div className="mr-10 space-y-5">
            <div>
                {eventComment?.map((comment: Comments) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={JSON.stringify(comment.viperId)}
                            eventId={eventId}
                            commentId={JSON.stringify(comment._id)}
                            viperId={JSON.stringify(comment.viperId)}
                            text={comment.text}
                            commentLikes={comment.likes.length}
                            commentReplies={comment.replies.length}
                            replyId={undefined}
                            timestamp={comment.timestamp}
                            event={false}
                            reply={false}
                            blog={false}
                        />
                    )
                })}
            </div>
            <div className="space-y-5">
                {eventReplies?.map((reply: Reply) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={JSON.stringify(reply._id)}
                            eventId={eventId}
                            commentId={commentId}
                            viperId={JSON.stringify(reply.viperId)}
                            commentViperId={viperId}
                            text={reply.reply}
                            commentLikes={reply.likes.length}
                            replyId={JSON.stringify(reply._id).replace(
                                /["']+/g,
                                ""
                            )}
                            timestamp={reply.timestamp}
                            event={false}
                            reply={true}
                            blog={false}
                        />
                    )
                })}
            </div>
        </div>
    )
}
