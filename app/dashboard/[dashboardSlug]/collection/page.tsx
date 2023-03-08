import { getCurrentViper } from "../../../../lib/session"
import { getViperParticipatedEvents } from "../../../../lib/vipers"
import { ParticipatedEventsCard } from "../../../../components/ParticipatedEventsCard"
import { Suspense } from "react"
import Loading from "../loading"

export default async function CollectionPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const participated = await getViperParticipatedEvents(viper!.id)
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Suspense fallback={<Loading />}>
                    {participated?.map((event) => {
                        return (
                            /* @ts-expect-error Async Server Component */
                            <ParticipatedEventsCard
                                viperId={viper!.id}
                                key={JSON.stringify(event._id)}
                                eventId={JSON.stringify(event._id)}
                                href={`${JSON.stringify(event._id)}`}
                                collection={true}
                            />
                        )
                    })}
                </Suspense>
            </div>
        </div>
    )
}
