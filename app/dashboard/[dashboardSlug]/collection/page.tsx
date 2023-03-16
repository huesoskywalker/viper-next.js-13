import { getCurrentViper } from "../../../../lib/session"
import { getViperCollection } from "../../../../lib/vipers"
import { Suspense } from "react"
import Loading from "../loading"
import { Collection } from "../../../../types/viper"
import ViperCollection from "./ViperCollection"

export default async function CollectionPage() {
    const viper = await getCurrentViper()
    if (!viper) throw new Error("No Viper bro")

    const collection: Promise<Collection[]> = getViperCollection(viper.id)

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    collectionPromise={collection}
                    viperId={viper.id}
                    isCollection={true}
                />
            </Suspense>
        </div>
    )
}
