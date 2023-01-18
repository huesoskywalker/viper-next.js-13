import { EventCommentsCard } from "../../components/EventCommentsCard"
import { Comments } from "../../lib/events"
import { delay } from "../../lib/delay"

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`

function Skeleton() {
    return (
        <div className={`space-y-4`}>
            <div className="h-6 w-2/6 rounded-lg bg-gray-300" />
            <div className="h-4 w-1/6 rounded-lg bg-gray-300" />
            <div className="h-4 w-full rounded-lg bg-gray-300" />
            <div className="h-4 w-4/6 rounded-lg bg-gray-300" />
        </div>
    )
}

export default function CommentsSkeleton() {
    return (
        <div className="space-y-6">
            <div className={`h-7 w-2/5 rounded-lg bg-gray-300 ${shimmer}`} />

            <div className="space-y-8">
                <Skeleton />
                <Skeleton />
            </div>
        </div>
    )
}

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
            <div className="text-lg font-medium text-white">
                People comment's
            </div>

            <div className="space-y-8">
                {comments?.map((comment) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <EventCommentsCard
                            key={comment.viperId}
                            eventId={id}
                            viperId={comment.viperId}
                            commentId={comment._id}
                            text={comment.text}
                            commentLikes={comment.likes.length}
                            commentReplies={comment.replies.length}
                            // comment={comment}
                        />
                    )
                })}
            </div>
        </div>
    )
}
