import { getViperCreatedEvents, EventInterface } from "../../../../lib/events"
import { getCurrentViper } from "../../../../lib/session"
import { EventCard } from "../../../../components/EventCard"
import { EditEvent } from "../../../../components/EditEvent"
import { Suspense } from "react"
import Loading from "./loading"

export default async function CreatePage() {
    const viper = await getCurrentViper()
    if (!viper) return
    const events: EventInterface[] = await getViperCreatedEvents(viper.id)
    const lastEvent: EventInterface = events[0]

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {lastEvent ? (
                    <div>
                        <EditEvent
                            href={`/dashboard/myevents/${lastEvent._id}`}
                        />
                        <EventCard
                            key={JSON.stringify(lastEvent._id)}
                            event={lastEvent}
                            href={`/${lastEvent._id}`}
                        />
                    </div>
                ) : (
                    <h1 className="text-gray-300 font-bold">
                        Create your first Event!
                    </h1>
                )}
            </Suspense>
            <div></div>
        </div>
    )
}
