import { PageProps } from "../../../../lib/getCategories"
import { getEventComment, getEventReplies } from "../../../../lib/events"
import { ReplyCard } from "./ReplyCard"
import { CommentCard } from "./CommentCard"

export default async function CommentIdPage({ params }: PageProps) {
    const eventId: string = params.id
    const commentId: string = params.commentId
    const viperId: string = params.viperId

    const eventComment = await getEventComment(eventId, commentId)
    const eventReplies = await getEventReplies(eventId, commentId, viperId)

    return (
        <div className="grid grid-cols-7 gap-4 ">
            <div className="col-start-2 col-span-5 mx-2 max-w-6xl  lg:border-x  lg:border-gray-800 rounded-lg  p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                <div className="flex justify-start lg:border-b lg:border-gray-800 pb-3 mr-10">
                    {eventComment?.map((comment) => {
                        return (
                            /* @ts-expect-error Async Server Component */
                            <CommentCard
                                key={comment.comments._id}
                                eventId={eventId}
                                commentId={comment.comments._id}
                                viperId={comment.comments.viperId}
                                text={comment.comments.text}
                                likes={comment.comments.likes.length}
                                replies={comment.comments.replies.length}
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
        </div>
    )
}
