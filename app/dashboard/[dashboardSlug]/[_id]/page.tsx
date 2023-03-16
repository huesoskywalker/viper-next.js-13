import { Suspense } from "react"
import { getEventById } from "../../../../lib/events"
import { PageProps } from "../../../../lib/getCategories"
import { EventInterface } from "../../../../types/event"
import EventToEdit from "./EventToEdit"

export default async function EventEditPage({ params }: PageProps) {
    const eventId: string = params._id

    // Can be good to make a function that returns only the editable Props of the Event
    const toEditEvent: Promise<EventInterface | null> = getEventById(eventId)
    return (
        <div className=" w-full">
            <Suspense fallback={<div>Suspense from EditPage</div>}>
                {/* @ts-expect-error Async Server Component */}
                <EventToEdit eventPromise={toEditEvent} />
            </Suspense>
        </div>
    )
}
