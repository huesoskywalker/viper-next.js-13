import { PageProps } from "../../../../lib/getCategories"
import { getEventComment, getEventReplies } from "../../../../lib/events"
import { ReplyCard } from "./ReplyCard"
import { CommentCard } from "./CommentCard"
import { EventCommentsCard } from "../../../../components/EventCommentsCard"

export default async function CommentIdPage({ params }: PageProps) {
    const eventId: string = params.id
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    const eventComment = await getEventComment(eventId, commentId)
    const eventReplies = await getEventReplies(eventId, commentId, viperId)
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
                            commentId={JSON.stringify(comment.comments._id)}
                            text={comment.comments.text}
                            commentLikes={comment.comments.likes.length}
                            commentReplies={comment.comments.replies.length}
                            timestamp={comment.timestamp}
                        />
                    )
                })}
            </div>
            <div>
                {eventReplies?.map((reply) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <ReplyCard
                            key={reply.replies._id}
                            eventId={eventId}
                            commentId={commentId}
                            viperId={reply.replies.viperId}
                            comment={reply.replies.reply}
                            likes={reply.replies.likes.length}
                            replyId={reply.replies._id}
                        />
                    )
                })}
            </div>
        </div>
    )
}
