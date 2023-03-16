import { EventInterface } from "../../../../types/event"
import { EditForm } from "./EditForm"

export default async function EventToEdit({
    eventPromise,
}: {
    eventPromise: Promise<EventInterface>
}) {
    const toEditEvent: EventInterface = await eventPromise

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
