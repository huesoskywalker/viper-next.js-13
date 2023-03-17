import { Suspense } from "react"
import { preloadEventById } from "../../../../lib/events"
import { PageProps } from "../../../../lib/getCategories"
import EventToEdit from "./EventToEdit"

export default async function EventEditPage({ params }: PageProps) {
    const eventId: string = params._id

    // Can be good to make a function that returns only the editable Props of the Event
    preloadEventById(eventId)
    return (
        <div className=" w-full">
            <Suspense fallback={<div>Suspense from EditPage</div>}>
                {/* @ts-expect-error Async Server Component */}
                <EventToEdit eventId={eventId} />
            </Suspense>
        </div>
    )
}
