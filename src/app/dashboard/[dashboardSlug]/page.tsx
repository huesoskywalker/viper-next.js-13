import { getViperCreatedEvents, preloadViperCreatedEvents } from "@/lib/events"
import { getCurrentViper } from "@/lib/session"
import { Suspense } from "react"
import Loading from "./loading"
import { EventInterface } from "@/types/event"
import { Session } from "next-auth"
import { DisplayEvents } from "@/app/events/(main)/DisplayEvents"

export default async function MyEventsPage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user
    const events: Promise<EventInterface[]> = getViperCreatedEvents(viper.id)
    {
        /* should we use cache patterns here ,
         DisplayEvents have many inputs for 1 output,  created events  should be cached,  */
    }
    // preloadViperCreatedEvents(viper.id)
    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={events} dashboard={true} />
            </Suspense>
        </div>
    )
}
