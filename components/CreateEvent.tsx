"use client"

import { useState, useTransition, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Loading from "../app/dashboard/[dashboardSlug]/create/loading"

export function CreateEvent() {
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [location, setLocation] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [time, setTime] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [createObjectURL, setCreateObjectURL] = useState<string>("")
    const [price, setPrice] = useState<string>("")

    const [isPending, startTransition] = useTransition()

    const { data: session } = useSession()
    const organizer = session?.user

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const file = new FormData()
            file.append("file", image)
            const uploadImage = await fetch(`/api/upload`, {
                method: "POST",
                body: file,
            })
            const {
                data,
                error,
            }: {
                data: {
                    url: string | string[]
                } | null
                error: string | null
            } = await uploadImage.json()

            const imageUrl = data?.url

            const response = await fetch(`/api/form`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    organizer,
                    title,
                    content,
                    date,
                    time,
                    location,
                    address,
                    category,
                    creationDate: new Date(),
                    price,
                    imageUrl,
                }),
            })

            await response.json()
            startTransition(() => {
                setTitle("")
                setContent("")
                setLocation("")
                setDate("")
                setTime("")
                setCategory("")
                setImage("")
                setCreateObjectURL("")
                setPrice("")
                setAddress("")

                router.refresh()
            })
        } catch (error) {
            console.error(error)
        }
    }

    const uploadToClient = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setImage(i)
            setCreateObjectURL(URL.createObjectURL(i))
        }
    }

    return (
        <div className="py-2">
            <div className="max-w-md">
                <div className="grid grid-cols-1 gap-6">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="text-sm"
                    >
                        <label className="block py-1">
                            <span className="text-gray-300">Event name</span>
                            <input
                                type="text"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Additional details
                            </span>
                            <textarea
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={2}
                                required
                            ></textarea>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                What type of event is it?
                            </span>
                            <select
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value={"All"}>Select an Option</option>
                                <option value={"Music"}>Music</option>
                                <option value={"Food"}>Food</option>
                                <option value={"Drinks"}>Drinks</option>
                                <option value={"Sports"}>Sports</option>
                            </select>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                When is your event?
                            </span>
                            <input
                                type="date"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">At what time?</span>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Where is it happening?
                            </span>
                            <select
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            >
                                <option value={"Nowhere"}>
                                    Select an Option
                                </option>
                                <option value={"Argentina"}>Argentina</option>
                                <option value={"California"}>California</option>
                                <option value={"Uruguay"}>Uruguay</option>
                                <option value={"Spain"}>Spain</option>
                                <option value={"Italy"}>Italy</option>
                                <option value={"Greece"}>Greece</option>
                                <option value={"New Zealand"}>
                                    New Zealand
                                </option>
                            </select>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">Address</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </label>
                        <Suspense fallback={<Loading />}>
                            <div>
                                {createObjectURL !== "" ? (
                                    <Image
                                        src={createObjectURL}
                                        className="hidden rounded-lg grayscale lg:block"
                                        alt={createObjectURL}
                                        height={400}
                                        width={400}
                                    />
                                ) : null}
                            </div>
                        </Suspense>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Select an image
                            </span>
                            <input
                                type="file"
                                name="myImage"
                                onChange={uploadToClient}
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </label>
                        <div>
                            <label className="text-gray-300">Price</label>
                            <input
                                type="number"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="relative w-full items-center space-x-2 rounded-lg bg-gray-700 my-3 mx-32 py-2 text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                                disabled={isPending}
                                onClick={(e) => handleSubmit(e)}
                            >
                                Create Event
                                {isPending ? (
                                    <div
                                        className="absolute right-2 top-1.5"
                                        role="status"
                                    >
                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                        {/* <span className="sr-only">
                                            Loading...
                                        </span> */}
                                    </div>
                                ) : null}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
