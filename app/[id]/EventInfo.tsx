import { EventPrice } from "./EventPrice"
import { EventInterface } from "../../lib/events"
import { EventDate } from "./EventDate"
import { EventLocation } from "./EventLocation"
import { Participate } from "./Participate"
import { Suspense } from "react"
import { delay } from "./delay"

const shimmer = `relative overflow-hidden rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`

function Skeleton() {
    return (
        <div className={`space-y-4`}>
            <div className="h-6 w-5/6 rounded-lg bg-gray-900" />
            <div className="h-4 w-2/6 rounded-lg bg-gray-900" />
            <div className="h-6 w-full rounded-lg bg-gray-900" />
        </div>
    )
}

export function InfoSkeleton() {
    return (
        <div className="space-y-6">
            <div className={`h-7 w-3/5 rounded-lg bg-gray-900 ${shimmer}`} />

            <div className="space-y-8">
                <Skeleton />
            </div>
        </div>
    )
}

export async function EventInfo({
    selectedEvent,
}: {
    selectedEvent: EventInterface
}) {
    // // Normally you would fetch data here
    // const price = dinero(selectedEvent.price as DineroSnapshot<number>)
    await delay(1500)

    const string: string = JSON.stringify(selectedEvent._id)
    const id: string = string.slice(1, -1)

    return (
        <div className="space-y-1 rounded-lg bg-gray-900 p-3">
            <EventDate date={selectedEvent.date} />
            <EventLocation location={selectedEvent.location} />
            <EventPrice price={selectedEvent.price} />
            <Participate id={id} participants={selectedEvent.participants} />

            {/* <ProductSplitPayments price={price} />
            {product.usedPrice ? (
                <ProductUsedPrice usedPrice={product.usedPrice} />
            ) : null} */}

            {/* <ProductEstimatedArrival
                leadTime={product.leadTime}
                hasDeliveryTime
            /> */}

            {/* {product.stock <= 1 ? (
                <ProductLowStockWarning stock={product.stock} />
            ) : null} */}

            {/* <div className="space-y-2">
                <AddToCart initialCartCount={Number(cartCount)} />
            </div> */}
        </div>
    )
}
