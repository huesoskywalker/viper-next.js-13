import { getCurrentViper } from "../../../../lib/session"
import { getViperParticipatedEvents } from "../../../../lib/vipers"
import { ParticipatedEventsCard } from "../../../../components/ParticipatedEventsCard"
import { Suspense } from "react"
import Loading from "../loading"

export default async function ParticipationsPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const participated = await getViperParticipatedEvents(viper!.id)
    // const events = participated.map((event) => {
    //     return event._id
    // })
    // console.log(events)
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Suspense fallback={<Loading />}>
                    {participated?.map((eventId) => {
                        return (
                            /* @ts-expect-error Async Server Component */
                            <ParticipatedEventsCard
                                key={JSON.stringify(eventId._id)}
                                id={JSON.stringify(eventId._id)}
                                href={`${JSON.stringify(eventId._id)}`}
                            />
                        )
                    })}
                </Suspense>
            </div>
        </div>
    )
}
