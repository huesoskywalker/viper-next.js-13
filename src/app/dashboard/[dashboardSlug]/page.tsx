import { preloadViperCreatedEvents } from "@/lib/vipers"
import { getCurrentViper } from "@/lib/session"
import { Suspense } from "react"
import Loading from "./loading"
import { Session } from "next-auth"
import { DisplayEvents } from "@/app/events/(main)/DisplayEvents"
import { preloadViperById } from "@/lib/vipers"
import { EventInterface } from "@/types/event"

export default async function MyEventsPage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user
    // Is this pattern too awful ? lol

    preloadViperById(viper._id)
    preloadViperCreatedEvents(viper._id)
    const fetchViperEvents = await fetch(`http://localhost:3000/api/viper/events/created`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            viperId: viper._id,
        }),
        cache: "no-cache",
        next: { revalidate: 600 },
    })
    const viperEvents: Promise<EventInterface> = fetchViperEvents.json()

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <DisplayEvents eventsPromise={viperEvents} dashboard={true} />
            </Suspense>
        </div>
    )
}
