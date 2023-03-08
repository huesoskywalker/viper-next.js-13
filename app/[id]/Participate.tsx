"use client"

// This Started happening when I installed @shopify/shopify-api
import { useTransition, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// type Order = {
//     fulfillmentStatus: string
//     financialStatus: string
// }

export function Participate({
    eventId,
    productId,
    viperOnList,
    viperRequest,
    isCheckoutPaid,
    eventEntries,
    totalInventory,
}: {
    eventId: string
    productId: string
    viperOnList: boolean
    viperRequest: boolean
    isCheckoutPaid: false | string
    eventEntries: number
    totalInventory: number
}) {
    const [isCheckout, setIsCheckout] = useState<string>("")
    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isPending || isFetching

    const router = useRouter()

    const { data: session } = useSession()
    const viper = session?.user
    const viperAccessToken = session?.user.customerAccessToken

    // --------------------------------------------------------------------------------
    const addParticipant = async (e: any) => {
        e.preventDefault()
        setIsFetching(true)
        // --------------------------------------------------------------------------
        const checkoutCreate = await fetch(`/api/create-checkout-shopify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                productId: productId,
                viperEmail: viper?.email,
            }),
        })
        const checkout = await checkoutCreate.json()
        console.log(`------------checkout from Participate----------------`)
        console.log(checkout.body.data.checkoutCreate.checkout)

        const checkoutId = checkout.body.data.checkoutCreate.checkout.id

        // --------------------------------------------------------------------------
        const checkoutCustomerAssociate = await fetch(
            `/api/associate-checkout-customer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    checkoutId,
                    customerAccessToken: viperAccessToken,
                }),
            }
        )
        const association = await checkoutCustomerAssociate.json()
        console.log(`------------association-------------------------`)
        console.log(association.body.data.checkoutCustomerAssociateV2)
        const webUrl =
            association.body.data.checkoutCustomerAssociateV2.checkout.webUrl
        setIsCheckout(webUrl)

        // ------------------------------------------------------------------------------------------- //
        const requestParticipation = await fetch(
            `/api/request-participation-event`,
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    viper: viper?.id,
                    eventId,
                    checkoutId,
                }),
            }
        )

        const eventRequest = await requestParticipation.json()
        console.log(`-----------------eventRequest--------------------`)
        console.log(eventRequest)

        setIsFetching(false)

        startTransition(() => {
            router.refresh()
        })
    }

    const claimCard = async (e: any) => {
        e.preventDefault()
        setIsFetching(true)

        const addCardToViper = await fetch(`/api/claim-event-card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventId,
                viperId: viper?.id,
            }),
        })

        const eventCard = await addCardToViper.json()
        console.log(`------------eventCard------------------------`)
        console.log(eventCard)

        setIsFetching(false)
        startTransition(() => {
            router.refresh()
        })
    }

    useEffect(() => {
        router.refresh()
        console.log(isCheckoutPaid)
    }, [viperOnList, isCheckoutPaid])

    // const holdForOrder = () => {
    //     router.refresh()
    // }
    return (
        <div className="space-y-2">
            <div className="flex justify-start items-center text-[16px] text-gray-300">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-2 text-yellow-600"
                >
                    <path
                        fillRule="evenodd"
                        d="M13 3v1.27a.75.75 0 001.5 0V3h2.25A2.25 2.25 0 0119 5.25v2.628a.75.75 0 01-.5.707 1.5 1.5 0 000 2.83c.3.106.5.39.5.707v2.628A2.25 2.25 0 0116.75 17H14.5v-1.27a.75.75 0 00-1.5 0V17H3.25A2.25 2.25 0 011 14.75v-2.628c0-.318.2-.601.5-.707a1.5 1.5 0 000-2.83.75.75 0 01-.5-.707V5.25A2.25 2.25 0 013.25 3H13zm1.5 4.396a.75.75 0 00-1.5 0v1.042a.75.75 0 001.5 0V7.396zm0 4.167a.75.75 0 00-1.5 0v1.041a.75.75 0 001.5 0v-1.041zM6 10.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 2.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                    />
                </svg>
                {totalInventory} of {eventEntries}
            </div>

            {totalInventory > 0 ? (
                !viperOnList ? (
                    !viperAccessToken ? (
                        <Link
                            href={`/${eventId}/customer`}
                            className={` flex w-full justify-center  rounded-lg bg-gray-700  py-1  text-sm font-medium text-white hover:text-black hover:bg-yellow-600 disabled:text-white/70`}
                        >
                            Participate
                        </Link>
                    ) : !viperRequest ? (
                        <button
                            className={`${
                                isMutating
                                    ? "bg-opacity-60 animate-pulse"
                                    : "bg-opacity-100"
                            }  relative w-full items-center space-x-2 rounded-lg bg-gray-700 px-3 py-1  text-sm font-medium text-white hover:text-black hover:bg-yellow-600 disabled:text-white/70`}
                            onClick={addParticipant}
                            disabled={isPending}
                        >
                            {isMutating ? "Preparing..." : "Participate"}
                            {isPending ? (
                                <div
                                    className="absolute right-2 top-1.5"
                                    role="status"
                                >
                                    <div
                                        className="
        h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
                                    />
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : null}
                        </button>
                    ) : !isCheckoutPaid ? (
                        // <form method="POST" action={isCheckout} target="_blank">
                        //     <button
                        //         onClick={holdForOrder}
                        //         className="flex w-full justify-center space-x-2 rounded-lg animate-pulse px-3 py-1  text-sm font-medium  bg-black text-yellow-600 disabled:text-white/70"
                        //     >
                        //         VIPER GO
                        //     </button>
                        // </form>
                        <a
                            href={isCheckout}
                            target="_blank"
                            className="flex w-full justify-center space-x-2 rounded-lg animate-pulse px-3 py-1  text-sm font-medium  bg-black text-yellow-600 disabled:text-white/70"
                        >
                            <span>VIPER GO</span>
                        </a>
                    ) : isCheckoutPaid !== "PAID" ? (
                        <button
                            disabled={true}
                            className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-xs font-medium  bg-black text-gray-300 hover:animate-pulse disabled:text-white/70"
                        >
                            PENDING
                        </button>
                    ) : (
                        <button
                            onClick={claimCard}
                            className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-xs font-medium  bg-black text-green-600 hover:animate-pulse hover:cursor-grab disabled:text-white/70"
                        >
                            {isMutating ? "Sending..." : "CLAIM CARD"}
                            {isPending ? (
                                <div
                                    className="absolute right-2 top-1.5"
                                    role="status"
                                >
                                    <div
                                        className="
        h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
                                    />
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : null}
                        </button>
                    )
                ) : (
                    <button
                        disabled={true}
                        className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-sm font-medium  bg-black  hover:animate-pulse hover:cursor-grabbing disabled:text-green-600"
                    >
                        V
                        <span className="text-yellow-400 hover:animate-none">
                            i
                        </span>
                        PER
                    </button>
                )
            ) : (
                <button
                    disabled={true}
                    className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-sm font-medium  bg-black  hover:animate-pulse hover:cursor-grabbing disabled:text-yellow-400"
                >
                    full ViPERS
                </button>
            )}
        </div>
    )
}
