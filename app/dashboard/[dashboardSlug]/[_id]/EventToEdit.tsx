import { getEventById } from "../../../../lib/events"
import { EventInterface } from "../../../../types/event"
import { EditForm } from "./EditForm"

export default async function EventToEdit({ eventId }: { eventId: string }) {
    // const toEditEvent: EventInterface = await eventPromise
    const toEditEvent: EventInterface | null = await getEventById(eventId)
    if (!toEditEvent) throw new Error("No event to edit bro")

    const event_id = JSON.stringify(toEditEvent._id).replace(/['"]+/g, "")

    return (
        <>
            <EditForm
                eventId={event_id}
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
