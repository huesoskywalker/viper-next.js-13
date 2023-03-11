import { getViperCreatedEvents, EventInterface } from "../../../lib/events"
import { getCurrentViper } from "../../../lib/session"
import { EventCard } from "../../events/(main)/EventCard"
import { EditEvent } from "./EditEvent"
import { delay } from "../../../lib/delay"
import { Suspense } from "react"
import Loading from "./loading"

export default async function MyEventsPage() {
    const viper = await getCurrentViper()
    if (!viper) return
    const events: EventInterface[] = await getViperCreatedEvents(viper.id)
    await delay(1500)
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Suspense fallback={<Loading />}>
                    {events.map((event: EventInterface) => {
                        return (
                            <div key={JSON.stringify(event._id)}>
                                <EditEvent
                                    href={`/dashboard/myevents/${event._id}`}
                                />
                                <EventCard
                                    event={event}
                                    href={`/${event._id}`}
                                />
                            </div>
                        )
                    })}
                </Suspense>
            </div>
            {events.length === 0 ? (
                <div className="flex justify-center align-text-bottom">
                    <p className="text-gray-400  text-xs">
                        Hey buddy, create your first event
                    </p>
                </div>
            ) : null}
        </div>
    )
}
