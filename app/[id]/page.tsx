import { PageProps } from "../../lib/getCategories"
import { Suspense } from "react"
import { CommentSkeleton } from "../../ui/CommentSkeleton"
import { Comments, EventInterface, getEventById } from "../../lib/events"
import { EventCommentsCard } from "./EventCommentsCard"

export default async function EventPage({ params }: PageProps) {
    const eventId: string = params.id

    const event: EventInterface | null = await getEventById(eventId)
    if (!event) return

    return (
        <div className="space-y-8 lg:space-y-6 ">
            <div className="text-xl font-medium text-gray-400/80  w-full ">
                <Suspense fallback={<CommentSkeleton />}>
                    <div className="space-y-6">
                        <div className="space-y-8">
                            {event.comments.map((comment: Comments) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <EventCommentsCard
                                        key={JSON.stringify(comment.viperId)}
                                        eventId={eventId}
                                        commentId={JSON.stringify(comment._id)}
                                        viperId={JSON.stringify(
                                            comment.viperId
                                        )}
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
                    </div>
                </Suspense>
            </div>
        </div>
    )
}
