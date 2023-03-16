import { getAllEvents } from "../../../lib/events"
import { Suspense } from "react"
import Loading from "./loading"
import { EventInterface } from "../../../types/event"
import { DisplayEvents } from "./DisplayEvents"

export default async function EventsPage({}) {
    const events: Promise<EventInterface[]> = getAllEvents()

    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <Suspense fallback={<Loading />}>
                    {/* @ts-expect-error Async Server Component */}
                    <DisplayEvents eventsPromise={events} dashboard={false} />
                </Suspense>
            </div>
        </div>
    )
}
