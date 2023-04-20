import { getCurrentViper } from "@/lib/session"
import { getViperCollection } from "@/lib/vipers"
import { Suspense } from "react"
import Loading from "../loading"
import { Collection } from "@/types/viper"
import ViperCollection from "./ViperCollection"
import { Session } from "next-auth"

export default async function CollectionPage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user

    const collection: Promise<Collection[]> = getViperCollection(viper._id)

    return (
        <div>
            <Suspense fallback={<Loading />}>
                {/* @ts-expect-error Async Server Component */}
                <ViperCollection
                    collectionPromise={collection}
                    viperId={viper._id}
                    isCollection={true}
                />
            </Suspense>
        </div>
    )
}
