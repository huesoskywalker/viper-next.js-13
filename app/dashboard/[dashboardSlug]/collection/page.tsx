import { getCurrentViper } from "../../../../lib/session"
import { Collection, getViperCollection } from "../../../../lib/vipers"
import { CollectionEventCard } from "./CollectionEventCard"
import { Suspense } from "react"
import Loading from "../loading"

export default async function CollectionPage() {
    const viper = await getCurrentViper()
    if (!viper) return

    const collection: Collection[] = await getViperCollection(viper.id)
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Suspense fallback={<Loading />}>
                    {collection.map((event: Collection) => {
                        return (
                            /* @ts-expect-error Async Server Component */
                            <CollectionEventCard
                                viperId={viper.id}
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
