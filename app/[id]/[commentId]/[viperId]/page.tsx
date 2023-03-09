import { PageProps } from "../../../../lib/getCategories"
import { getEventComment, getEventReplies } from "../../../../lib/events"
import { EventCommentsCard } from "../../EventCommentsCard"
import { delay } from "../../../../lib/delay"

export default async function CommentIdPage({ params }: PageProps) {
    const eventId: string = params.id
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    const eventComment = await getEventComment(eventId, commentId)
    const eventReplies = await getEventReplies(eventId, commentId, viperId)

    await delay(1500)
    return (
        <div className="mr-10 space-y-5">
            <div>
                {eventComment?.map((comment) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={JSON.stringify(comment.comments.viperId)}
                            eventId={eventId}
                            viperId={JSON.stringify(comment.comments.viperId)}
                            viperCommentId={viperId}
                            commentId={JSON.stringify(comment.comments._id)}
                            text={comment.comments.text}
                            commentLikes={comment.comments.likes.length}
                            commentReplies={comment.comments.replies.length}
                            timestamp={comment.comments.timestamp}
                            event={false}
                            reply={false}
                            blog={false}
                        />
                    )
                })}
            </div>
            <div className="space-y-5">
                {eventReplies?.map((reply) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={reply.replies._id}
                            eventId={eventId}
                            viperId={JSON.stringify(reply.replies.viperId)}
                            commentId={commentId}
                            viperCommentId={viperId}
                            text={reply.replies.reply}
                            commentLikes={reply.replies.likes.length}
                            replyId={JSON.stringify(reply.replies._id).replace(
                                /["']+/g,
                                ""
                            )}
                            timestamp={reply.replies.timestamp}
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
