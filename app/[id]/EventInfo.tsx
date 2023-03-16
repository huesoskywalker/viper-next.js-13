import { EventPrice } from "./EventPrice"
import { isViperOnTheList } from "../../lib/events"
import { EventDate } from "./EventDate"
import { EventLocation } from "./EventLocation"
import { Participate } from "./Participate"
import { requestEventParticipation } from "../../lib/vipers"
import isCheckoutFulFilled from "../../helpers/isCheckoutFulFilled"
import { productInventoryCount } from "../../helpers/productInventoryCount"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"
import { FulfillmentOrder } from "@shopify/shopify-api/rest/admin/2023-01/fulfillment_order"

export async function EventInfo({
    currentViperId,
    eventId,
    eventDate,
    eventLocation,
    eventPrice,
    productId,
    eventEntries,
}: {
    currentViperId: string
    eventId: string
    eventDate: Date
    eventLocation: string
    eventPrice: number
    productId: string
    eventEntries: number
}) {
    // // Normally you would fetch data here
    const productInventoryData: Promise<InventoryItem> =
        productInventoryCount(productId)

    const viperOnListData: Promise<boolean> = isViperOnTheList(
        eventId,
        currentViperId
    )
    const viperRequestData: Promise<boolean> = requestEventParticipation(
        currentViperId,
        eventId
    )
    const checkoutFulfillmentData: Promise<FulfillmentOrder | undefined> =
        isCheckoutFulFilled(currentViperId, eventId)

    const [productInventory, viperOnList, viperRequest, checkoutFulfillment] =
        await Promise.all([
            productInventoryData,
            viperOnListData,
            viperRequestData,
            checkoutFulfillmentData,
        ])

    return (
        <div className="space-y-1 rounded-lg bg-gray-900 p-3">
            <EventDate date={eventDate} collection={false} />
            <EventLocation location={eventLocation} />
            <EventPrice price={eventPrice} />
            {/* @ts-expect-error Async Server Component */}
            <Participate
                eventId={eventId}
                productId={productId}
                viperOnList={viperOnList}
                viperRequest={viperRequest}
                isCheckoutPaid={checkoutFulfillment?.financialStatus}
                eventEntries={eventEntries}
                totalInventory={productInventory.totalInventory}
            />
        </div>
    )
}

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
