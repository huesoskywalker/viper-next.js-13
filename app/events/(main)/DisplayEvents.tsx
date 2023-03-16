import { delay } from "../../../lib/delay"
import { EventInterface } from "../../../types/event"
import { EditEventLink } from "../../dashboard/[dashboardSlug]/EditEventLink"
import { EventCard } from "./EventCard"

export async function DisplayEvents({
    eventsPromise,
    dashboard,
}: {
    eventsPromise: Promise<EventInterface[]>
    dashboard: boolean
}) {
    const events: EventInterface[] = await eventsPromise
    if (events.length === 0) {
        return (
            <div className="flex justify-center align-text-bottom">
                <p className="text-gray-400  text-xs">
                    Hey buddy, create your first event
                </p>
            </div>
        )
    }
    if (!dashboard) {
        return (
            <>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {events.map((event: EventInterface) => {
                        return (
                            <div key={JSON.stringify(event._id)}>
                                <EventCard
                                    image={event.image}
                                    title={event.title}
                                    content={event.content}
                                    location={event.location}
                                    date={event.date}
                                    href={`/${event._id}`}
                                />
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {events.map((event: EventInterface) => {
                    return (
                        <div key={JSON.stringify(event._id)}>
                            <EditEventLink
                                href={`/dashboard/myevents/${event._id}`}
                            />
                            <EventCard
                                image={event.image}
                                title={event.title}
                                content={event.content}
                                location={event.location}
                                date={event.date}
                                href={`/${event._id}`}
                            />
                        </div>
                    )
                })}
            </div>
        </>
    )
}
