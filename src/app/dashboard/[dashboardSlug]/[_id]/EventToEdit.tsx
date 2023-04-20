import { getEventById } from "@/lib/events"
import { EventInterface } from "@/types/event"
import { EditEventForm } from "./EditEventForm"

export default async function EventToEdit({ eventId }: { eventId: string }) {
    // const toEditEvent: EventInterface = await eventPromise
    const toEditEvent: EventInterface | null = await getEventById(eventId)
    if (!toEditEvent)
        return (
            <h1 className="text-gray-400 text-xl">
                Something should we do here, this does not work, most sure And the ERROR will crash
                the console.
            </h1>
        )

    const event_id = JSON.stringify(toEditEvent._id).replace(/['"]+/g, "")

    return (
        <>
            <EditEventForm
                eventId={event_id}
                eventOrganizerId={toEditEvent.organizer._id}
                eventTitle={toEditEvent.title}
                eventContent={toEditEvent.content}
                eventLocation={toEditEvent.location}
                eventDate={toEditEvent.date.toString()}
                eventCategory={toEditEvent.category}
                eventImage={toEditEvent.image}
                eventPrice={toEditEvent.price}
            />
        </>
    )
}
