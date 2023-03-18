import { Collection, Likes } from "@/types/viper"
import { CollectionEventCard } from "./CollectionEventCard"

export default async function ViperCollection({
    collectionPromise,
    viperId,
    isCollection,
}: {
    collectionPromise: Promise<Collection[] | Likes[]>
    viperId: string
    isCollection: boolean
}) {
    const collection: Collection[] | Likes[] = await collectionPromise
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {collection.map((event: Collection | Likes) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <CollectionEventCard
                        viperId={viperId}
                        key={JSON.stringify(event._id)}
                        eventId={JSON.stringify(event._id)}
                        href={`${JSON.stringify(event._id)}`}
                        isCollection={isCollection}
                    />
                )
            })}
        </div>
    )
}
