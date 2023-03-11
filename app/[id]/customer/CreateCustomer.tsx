"use client"

// this start happening after installing @shopify-api
import { MouseEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"
import { CustomerAddress } from "@shopify/shopify-api/rest/admin/2023-01/customer_address"
import { Viper } from "../../../lib/vipers"

export default function CreateCustomer({
    viperId,
    viperEmail,
    viperFirstName,
    viperLastName,
    viperLocation,
}: {
    viperId: string
    viperEmail: string
    viperFirstName: string
    viperLastName: string
    viperLocation: string
}) {
    const [email, setEmail] = useState<string>(viperEmail)
    const [password, setPassword] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [firstName, setFirstName] = useState<string>(viperFirstName)
    const [lastName, setLastName] = useState<string>(viperLastName)
    const [address, setAddress] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [province, setProvince] = useState<string>("")
    const [zip, setZip] = useState<string>("")
    const [country, setCountry] = useState<string>(viperLocation)

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isPending || isFetching

    const router = useRouter()

    const handleSubmit = async (
        e: MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        setIsFetching(true)
        try {
            const customerCreate = await fetch(`/api/create-customer-shopify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    phone,
                    firstName,
                    lastName,
                }),
            })
            const newCustomer: Customer = await customerCreate.json()

            const newCustomerId: string =
                newCustomer.body.data.customerCreate.customer.id

            // ---------------------------------------------------------------------------------------

            const customerAccessTokenCreate = await fetch(
                `/api/create-customer-access-token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            )

            const customerAccessToken: unknown =
                await customerAccessTokenCreate.json()
            const accessToken: string =
                customerAccessToken.body.data.customerAccessTokenCreate
                    .customerAccessToken.accessToken
            // ---------------------------------------------------------------------------------------
            const customerAddressCreate = await fetch(
                `/api/create-customer-address`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken,
                        lastName,
                        firstName,
                        phone,
                        address,
                        province,
                        country,
                        zip,
                        city,
                    }),
                }
            )
            const newAddress: CustomerAddress =
                await customerAddressCreate.json()
            // ---------------------------------------------------------------------------------------

            const postAccessTokenToUser = await fetch(
                `/api/update-viper-customer`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        viperId,
                        accessToken,
                        newCustomerId,
                        phone,
                        address,
                        city,
                        province,
                        zip,
                        country,
                    }),
                }
            )

            const updatedUser: Viper = await postAccessTokenToUser.json()

            // ---------------------------------------------------------------------------------------

            setIsFetching(false)

            startTransition(() => {
                setEmail("")
                setPassword("")
                setPhone("")
                setFirstName("")
                setLastName("")
                setAddress("")
                setCity("")
                setProvince("")
                setZip("")
                setCountry("")
                router.refresh()
            })
            router.back()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center min-h-screen px-4 py-2 ">
                <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
                    <div className="m-1 ">
                        <button
                            onClick={() => router.back()}
                            className="flex justify-start self-start w-fit text-gray-400 hover:text-red-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <span className="flex justify-center text-gray-100">
                            Join the store
                        </span>

                        <div className="flex justify-center">
                            <div className="w-full mx-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <form
                                        onSubmit={(e) => e.preventDefault()}
                                        className="text-sm"
                                    >
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                First name
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Last name
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Email
                                            </span>
                                            <input
                                                type="email"
                                                className="block p-1 w-full  rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Password
                                            </span>
                                            <input
                                                type="password"
                                                className="block p-1 w-full  rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                        </label>
                                        <label className="block py-1 ">
                                            <span className="text-gray-300 ml-[4px]">
                                                Phone
                                            </span>
                                            <input
                                                type="tel"
                                                className=" block p-1 w-full  rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500 "
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Address
                                            </span>
                                            <input
                                                className="block p-1 w-full hover:cursor-pointer rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                City
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={city}
                                                onChange={(e) =>
                                                    setCity(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Province
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={province}
                                                onChange={(e) =>
                                                    setProvince(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Zip Code
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={zip}
                                                onChange={(e) =>
                                                    setZip(e.target.value)
                                                }
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Country
                                            </span>
                                            <select
                                                className="block p-1 w-full  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={country}
                                                onChange={(e) =>
                                                    setCountry(e.target.value)
                                                }
                                                // required
                                            >
                                                <option value={"Nowhere"}>
                                                    Select an Option
                                                </option>
                                                <option value={"Argentina"}>
                                                    Argentina
                                                </option>
                                                <option value={"California"}>
                                                    California
                                                </option>
                                                <option value={"Uruguay"}>
                                                    Uruguay
                                                </option>
                                                <option value={"Spain"}>
                                                    Spain
                                                </option>
                                                <option value={"Italy"}>
                                                    Italy
                                                </option>
                                                <option value={"Greece"}>
                                                    Greece
                                                </option>
                                                <option value={"New Zealand"}>
                                                    New Zealand
                                                </option>
                                            </select>
                                        </label>
                                        <div className="flex justify-center">
                                            <button
                                                className={`${
                                                    isMutating
                                                        ? "opacity-70"
                                                        : "opacity-100"
                                                } relative w-fit items-center space-x-3 rounded-lg bg-gray-700 my-3 py-2 px-5 text-sm font-medium text-white hover:bg-black hover:text-yellow-600 disabled:text-white/70`}
                                                disabled={isPending}
                                                onClick={(e) => handleSubmit}
                                            >
                                                {isMutating
                                                    ? "Proceeding..."
                                                    : "Create Customer"}
                                                {isPending ? (
                                                    <div
                                                        className="absolute right-2 top-1.5"
                                                        role="status"
                                                    >
                                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                                        <span className="sr-only">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
