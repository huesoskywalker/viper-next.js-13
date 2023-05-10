import { PageProps } from "@/lib/getCategories"
import { Suspense } from "react"
import { CommentSkeleton } from "@/components/CommentSkeleton"
import { getEventComments, preloadEventComments } from "@/lib/events"
import { Comments } from "@/types/event"
import { EventComments } from "./EventComments"

export default async function EventPage({ params }: PageProps) {
    const eventId: string = params.id
    // const eventComments: Promise<Comments[] | null> = getEventComments(eventId)

    preloadEventComments(eventId)
    //     const fetchComments = await fetch(`http://localhost:3000/event/comment/${eventId}`, {
    //         method: "GET",
    //         headers: {
    //             "content-type": "application/json; charset=utf-8",
    //         },
    //     })
    //  const eventComments: Promise<Comments[] | null> = fetchComments.json()
    return (
        <div className="space-y-8 lg:space-y-6 ">
            <div className="text-xl font-medium text-gray-400/80  w-full ">
                <div className="space-y-6">
                    <Suspense fallback={<CommentSkeleton />}>
                        {/* @ts-expect-error Async Server Component */}
                        <EventComments eventId={eventId} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
