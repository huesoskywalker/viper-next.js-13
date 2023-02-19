import { PageProps } from "../../../../lib/getCategories"
import { getEventComment, getEventReplies } from "../../../../lib/events"
import { ReplyCard } from "./ReplyCard"
import { CommentCard } from "./CommentCard"
import { EventCommentsCard } from "../../EventCommentsCard"
import { getViperById } from "../../../../lib/vipers"
import { delay } from "../../../../lib/delay"

export default async function CommentIdPage({ params }: PageProps) {
    const eventId: string = params.id
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    const eventComment = await getEventComment(eventId, commentId)
    const eventReplies = await getEventReplies(eventId, commentId, viperId)
    // const eventCommentId = eventComment.map((comment) => {
    //     return comment.comments.viperId
    // })
    // const stringifyViperCommentId = JSON.stringify(eventCommentId)
    // const commentViper_id = stringifyViperCommentId.replace(/[\W]+/g, "")
    // const viperComment = await getViperById(commentViper_id)

    await delay(1500)
    return (
        <div className="mr-10 space-y-5">
            <div>
                {eventComment?.map((comment) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        // <CommentCard
                        //     key={comment.comments._id}
                        //     eventId={viperId}
                        //     viperId={JSON.stringify(
                        //         comment.comments.viperId
                        //     )}
                        //     commentId={JSON.stringify(comment.comments._id)}
                        //     text={comment.comments.text}
                        //     // timestamp={comment}
                        //     likes={comment.comments.likes.length}
                        //     replies={comment.comments.replies.length}
                        //     event={false}
                        //     blog={false}
                        //     reply={true}
                        // />
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
                            // comment={true}
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
                            // commentReplies={0}
                            replyId={JSON.stringify(reply.replies._id).replace(
                                /["']+/g,
                                ""
                            )}
                            timestamp={reply.replies.timestamp}
                            event={false}
                            // comment={false}
                            reply={true}
                            blog={false}
                        />
                        // <ReplyCard
                        //     key={reply.replies._id}
                        //     eventId={eventId}
                        //     viperId={reply.replies.viperId}
                        //     commentId={commentId}
                        //     comment={reply.replies.reply}
                        //     likes={reply.replies.likes.length}
                        //     replyId={reply.replies._id}
                        // />
                    )
                })}
            </div>
        </div>
    )
}
