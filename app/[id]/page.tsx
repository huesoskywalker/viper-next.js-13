// import { Event } from "./Event"
import { getEventById } from "../../lib/events"
import { PageProps } from "../../lib/getCategories"
import { Comments } from "./Comments"
import { Suspense } from "react"
import { CommentSkeleton } from "../../components/CommentSkeleton"
import Loading from "../loading"

export default async function EventEditPage({ params }: PageProps) {
    const eventId: string = params.id
    const selectedEvent = await getEventById(eventId)

    return (
        <div className="space-y-8 lg:space-y-6 ">
            <div className="text-xl font-medium text-gray-400/80  w-full ">
                <Suspense fallback={<CommentSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <Comments comments={selectedEvent?.comments} id={eventId} />
                </Suspense>
            </div>
        </div>
    )
}
