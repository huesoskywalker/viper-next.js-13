import { Event } from "./Event"
import { getEventById } from "../../lib/events"
import { PageProps } from "../../lib/getCategories"
import CommentsSkeleton, { Comments } from "./Comments"
import { Suspense } from "react"

export default async function EventEditPage({ params }: PageProps) {
    const id: string = params.id
    const selectedEvent = await getEventById(id)

    return (
        <div className="space-y-8 lg:space-y-14">
            {/* @ts-expect-error Server Component */}
            <Event selectedEvent={selectedEvent} id={id} />
            {/* <div>
                <Link
                    href={`/vipers/${selectedEvent?.organizer.id}`}
                    className="truncate text-xl font-medium text-white lg:text-2xl"
                >
                    {selectedEvent?.organizer.name}
                </Link>
            </div> */}
            {/* <div className="text-gray-300">
                <AddComment id={id} />
            </div> */}
            <div className="text-xl font-medium text-gray-400/80  flex justify-start mr-3 ">
                <Suspense fallback={<CommentsSkeleton />}>
                    {/* @ts-expect-error Async Server Component */}
                    <Comments comments={selectedEvent.comments} />
                </Suspense>
            </div>
        </div>
    )
}
