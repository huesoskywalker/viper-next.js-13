import { Suspense } from "react"
import Loading from "./loading"
import { EventInterface } from "@/types/event"
import { DisplayEvents } from "./DisplayEvents"

export default async function EventsPage({}) {
    const fetchEvents = await fetch(`http:localhost:3000/api/event/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache",
        next: {
            revalidate: 900,
        },
    })
    const events: Promise<EventInterface[]> = fetchEvents.json()
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
