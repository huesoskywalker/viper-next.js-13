import { getCurrentViper } from "../../../../lib/session"
import { getViperParticipatedEvents } from "../../../../lib/vipers"
import { ParticipatedEventsCard } from "../../../../components/ParticipatedEventsCard"
import { Suspense } from "react"
import Loading from "./loading"

export default async function ParticipationsPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const participated = await getViperParticipatedEvents(viper!.id)
    const events = participated.map((event) => {
        return event.participated
    })
    console.log(events)

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {events?.map((eventId) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <ParticipatedEventsCard id={eventId} href={`/${eventId}`} />
                )
            })}
        </div>
    )
}
