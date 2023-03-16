import { getViperCreatedEvents } from "../../../lib/events"
import { getCurrentViper } from "../../../lib/session"
import { delay } from "../../../lib/delay"
import { Suspense } from "react"
import Loading from "./loading"
import { EventInterface } from "../../../types/event"
import { DisplayEvents } from "../../events/(main)/DisplayEvents"

export default async function MyEventsPage() {
    const viper = await getCurrentViper()
    if (!viper) return
    const events: Promise<EventInterface[]> = getViperCreatedEvents(viper.id)
    await delay(1000)
    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={events} dashboard={true} />
            </Suspense>
        </div>
    )
}
