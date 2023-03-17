import { EventPrice } from "./EventPrice"
import { isViperOnTheList } from "../../lib/events"
import { EventDate } from "./EventDate"
import { EventLocation } from "./EventLocation"
import { Participate } from "./Participate"
import { requestEventParticipation } from "../../lib/vipers"
import isCheckoutFulFilled from "../../helpers/isCheckoutFulFilled"
import { FulfillmentOrder } from "@shopify/shopify-api/rest/admin/2023-01/fulfillment_order"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"

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

    const [viperOnList, viperRequest, checkoutFulfillment] = await Promise.all([
        viperOnListData,
        viperRequestData,
        checkoutFulfillmentData,
    ])

    {
        /** Probably will be good to resolve this promise with all the others , the thing is if this one
        will resolve all Promises on revalidation*/
    }
    const productInventoryData = await fetch(
        `http://localhost:3000/api/product/${eventId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId,
            }),
            next: { revalidate: 30 },
        }
    )
    const productInventory: InventoryItem = await productInventoryData.json()

    return (
        <div className="space-y-1.5 rounded-lg bg-gray-900 p-3">
            <EventDate date={eventDate} collection={false} />
            <EventLocation location={eventLocation} />
            <EventPrice price={eventPrice} />
            {/** We gotta fix this last button on full Vipers and as well on financial status and split
             * the Participate Components into smaller and more maintainable ones
             */}
            {productInventory.totalInventory <= 0 ? (
                <button
                    disabled={true}
                    className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1 text-sm font-medium  bg-black  hover:animate-pulse hover:cursor-grabbing disabled:text-red-500"
                >
                    <div className="flex justify-start items-center text-[16px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 mr-2 text-yellow-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M13 3v1.27a.75.75 0 001.5 0V3h2.25A2.25 2.25 0 0119 5.25v2.628a.75.75 0 01-.5.707 1.5 1.5 0 000 2.83c.3.106.5.39.5.707v2.628A2.25 2.25 0 0116.75 17H14.5v-1.27a.75.75 0 00-1.5 0V17H3.25A2.25 2.25 0 011 14.75v-2.628c0-.318.2-.601.5-.707a1.5 1.5 0 000-2.83.75.75 0 01-.5-.707V5.25A2.25 2.25 0 013.25 3H13zm1.5 4.396a.75.75 0 00-1.5 0v1.042a.75.75 0 001.5 0V7.396zm0 4.167a.75.75 0 00-1.5 0v1.041a.75.75 0 001.5 0v-1.041zM6 10.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 2.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z"
                                clipRule="evenodd"
                            />
                        </svg>
                        SOLD OUT
                    </div>
                </button>
            ) : (
                /* @ts-expect-error Async Server Component */
                <Participate
                    eventId={eventId}
                    productId={productId}
                    viperOnList={viperOnList}
                    viperRequest={viperRequest}
                    isCheckoutPaid={checkoutFulfillment?.financialStatus}
                    eventEntries={eventEntries}
                    totalInventory={productInventory.totalInventory}
                />
            )}
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
