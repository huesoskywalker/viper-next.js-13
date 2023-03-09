import { getCurrentViper } from "../../../../lib/session"
import { getViperLikedEvents } from "../../../../lib/vipers"
import { ParticipatedEventsCard } from "../collection/ParticipatedEventsCard"
import { Suspense } from "react"
import Loading from "./loading"

export default async function LikedPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const liked = await getViperLikedEvents(viper!.id)

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Suspense fallback={<Loading />}>
                {liked?.map((event) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <ParticipatedEventsCard
                            key={JSON.stringify(event._id)}
                            viperId={viper.id}
                            eventId={JSON.stringify(event._id)}
                            href={`/${event}`}
                            collection={false}
                        />
                    )
                })}
            </Suspense>
        </div>
    )
}
