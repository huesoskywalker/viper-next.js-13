import { getViperCreatedEvents, EventInterface } from "../../../lib/events"
import { getCurrentViper } from "../../../lib/session"
import { EventCard } from "../../../components/EventCard"
import { EditEvent } from "../../../components/EditEvent"

export default async function MyEventsPage() {
    const viper = await getCurrentViper()
    const events: EventInterface[] = await getViperCreatedEvents(viper!.id)

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {events?.map((event: EventInterface) => {
                    return (
                        <div key={JSON.stringify(event._id)}>
                            <EditEvent
                                href={`/dashboard/myevents/${event._id}`}
                            />
                            <EventCard event={event} href={`/${event._id}`} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
