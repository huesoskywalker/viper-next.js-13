import { EventInterface, getAllEvents } from "../../../lib/events"
import { Suspense } from "react"
import Loading from "./loading"
import { EventCard } from "../../../components/EventCard"

export default async function EventsPage({}) {
    const events: EventInterface[] = await getAllEvents()

    return (
        <div className="space-y-9">
            <h1>Events</h1>
            <div className="flex justify-between">
                <Suspense fallback={<Loading />}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {events?.map((event: EventInterface) => {
                            return (
                                <EventCard
                                    key={JSON.stringify(event._id)}
                                    event={event}
                                    href={`/${event._id}`}
                                />
                            )
                        })}
                    </div>
                </Suspense>
            </div>
        </div>
    )
}
