import { PageProps } from "@/lib/getCategories"
import { getEventCommentById, getEventCommentReplies } from "@/lib/events"
import { Comments, Reply } from "@/types/event"
import { EventComments } from "../../EventComments"
import { CommentReplies } from "./CommentReplies"
import { Suspense } from "react"
import { preloadViperBasicProps } from "@/lib/vipers"

export default async function CommentIdPage({
    params: { id, commentId, viperId },
}: PageProps) {
    const eventId: string = id

    // To minimize client-server waterfalls, we recommend this pattern to fetch data in parallel
    const eventCommentData: Promise<Comments[] | null> = getEventCommentById(
        eventId,
        commentId
    )

    const commentRepliesData: Promise<Reply[]> = getEventCommentReplies(
        eventId,
        commentId,
        viperId
    )
    preloadViperBasicProps(viperId)
    return (
        <div className="mr-10 space-y-5">
            <div>
                <Suspense
                    fallback={
                        <div className="text-yellow-400 text-lg">
                            Comment Suspense
                        </div>
                    }
                >
                    {/* @ts-expect-error Async Server Component */}
                    <EventComments
                        commentsPromise={eventCommentData}
                        eventId={eventId}
                    />
                </Suspense>
            </div>
            <div className="space-y-5">
                <Suspense
                    fallback={
                        <div className="text-yellow-400 text-lg">
                            Reply Suspense
                        </div>
                    }
                >
                    {/* @ts-expect-error Async Server Component */}
                    <CommentReplies
                        repliesPromise={commentRepliesData}
                        eventId={eventId}
                        commentId={commentId}
                        viperId={viperId}
                    />
                </Suspense>
            </div>
        </div>
    )
}
