import { getCurrentViper } from "../../../../lib/session"
import { getViperLikedEvents } from "../../../../lib/vipers"
import { CollectionEventCard } from "../collection/CollectionEventCard"
import { Suspense } from "react"
import Loading from "./loading"
import { Likes } from "../../../../lib/events"

export default async function LikedPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const liked: Likes[] = await getViperLikedEvents(viper.id)

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Suspense fallback={<Loading />}>
                {liked.map((event: Likes) => {
                    return (
                        /* @ts-expect-error Async Server Component */
                        <CollectionEventCard
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
