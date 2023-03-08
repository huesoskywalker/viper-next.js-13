"use client"

import { useState, useTransition, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { EventInterface } from "../../../../lib/events"
import Image from "next/image"
import { format } from "date-fns"

export function EditForm({ toEditEvent }: { toEditEvent: EventInterface }) {
    const [title, setTitle] = useState<string>(toEditEvent.title)
    const [content, setContent] = useState<string>(toEditEvent.content)
    const [location, setLocation] = useState<string>(toEditEvent.location)
    const [date, setDate] = useState<string>(toEditEvent.date.toString())
    const [category, setCategory] = useState<string>(toEditEvent.category)
    const [image, setImage] = useState<string>(toEditEvent.image)
    const [createObjectURL, setCreateObjectURL] = useState<string>()
    const [price, setPrice] = useState<string>(toEditEvent.price.toString())
    // const [newEventPreview, setNewEventPreview] = useState<boolean>(false)
    const [pendingEdit, setPendingEdit] = useState<boolean>(false)
    // const [pendingDelete, setPendingDelete] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsFetching(true)
        setPendingEdit(!pendingEdit)
        try {
            // const file = new FormData()
            // console.log("file", image)
            // file.append("file", image)
            // const uploadImage = await fetch(`/api/upload`, {
            //     method: "POST",
            //     body: file,
            // })
            // const {
            //     data,
            //     error,
            // }: {
            //     data: {
            //         url: string | string[]
            //     } | null
            //     error: string | null
            // } = await uploadImage.json()

            // console.log(`----------------data------------`)
            // console.log(data?.url)

            // const imageUrl = data?.url

            const response = await fetch(`/api/form`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    _id: toEditEvent._id,
                    title,
                    content,
                    location,
                    date,
                    category,
                    price,
                    // imageUrl,
                }),
            })
            await response.json()
            setIsFetching(false)

            startTransition(() => {
                setTitle("")
                setContent("")
                setLocation("")
                setDate("")
                setCategory("")
                setImage("")
                setCreateObjectURL("")
                setPrice("")
                // router.refresh()
                router.prefetch(`/${toEditEvent._id}`)
            })
            // same in EditProfile, Want to try prefetch inside transition and push outside.
            router.push(`/${toEditEvent._id}`)
        } catch (error) {
            console.error(error)
        }
    }

    const deleteEvent = async (e: any) => {
        e.preventDefault()
        // setPendingDelete(!pendingDelete)
        try {
            const response = await fetch(`/api/create-event`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    _id: toEditEvent._id,
                    image: toEditEvent.image,
                }),
            })
            await response.json()
            startTransition(() => {
                router.refresh()
            })
            // added the prefetch and did not try it. if this works , DELETE this comment.
            router.prefetch("/dashboard/myevents")
            router.push("/dashboard/myevents")
        } catch (error) {
            console.error(error)
        }
    }

    // const showPreview = () => {
    //     setNewEventPreview(!newEventPreview)
    // }

    // const uploadToClient = (event: any) => {
    //     if (event.target.files && event.target.files[0]) {
    //         const i = event.target.files[0]

    //         setImage(i)
    //         setCreateObjectURL(URL.createObjectURL(i))
    //     }
    // }

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
                                <option value={"bars"}>Bars</option>
                                {/* <option value={"restaurants"}>
                                    Restaurants
                                </option> */}
                                <option value={"clubs"}>Clubs</option>
                                <option value={"music"}>Music</option>
                                <option value={"sports"}>Sport</option>
                                <option value={"art"}>Art</option>
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
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Where is it happening?
                            </span>
                            <select
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
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

                        {/* <div>
                            {createObjectURL !== "" ? (
                                <Image
                                    src={createObjectURL}
                                    className="hidden rounded-lg grayscale lg:block"
                                    alt={"createObjectURL"}
                                    height={400}
                                    width={400}
                                />
                            ) : (
                                <div></div>
                            )}
                        </div> */}
                        {/* <label className="block py-1">
                            <span className="text-gray-300">
                                Select an image
                            </span>
                            <input
                                type="file"
                                name="myImage"
                                onChange={uploadToClient}
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </label> */}
                        {/* <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={uploadToServer}
                            >
                                Send to server
                            </button> */}

                        <label className="text-gray-300">
                            Price
                            <input
                                type="number"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        <div className="flex justify-center gap-6">
                            {/* <button
                                className="relative w-4/6 items-center space-x-2 rounded-lg bg-gray-700 my-3 ml-16 py-2 text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                                disabled={isPending}
                                onClick={() => showPreview()}
                            >
                                Preview
                            </button> */}
                            <button
                                className={`${
                                    isMutating
                                        ? "bg-opacity-60"
                                        : "bg-opacity-100"
                                } relative w-2/6 items-center space-x-2 rounded-lg bg-gray-700 my-3  py-2 text-sm font-medium text-gray-200 hover:bg-yellow-700 hover:text-white disabled:text-white/70`}
                                disabled={isPending}
                                onClick={(e) => handleSubmit(e)}
                            >
                                Submit Edition
                                {isPending && pendingEdit ? (
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
                            <button
                                className="relative w-2/6 items-center  space-x-2 rounded-lg bg-red-800 my-3  py-2 text-sm font-medium text-black hover:bg-red-600 hover:text-white disabled:text-white/70"
                                disabled={isPending}
                                onClick={(e) => deleteEvent(e)}
                            >
                                Delete
                                {isPending && !pendingEdit ? (
                                    <div
                                        className="absolute right-10 top-1.5"
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
            {/* <div className="w-full">
                {newEventPreview ? (
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-full lg:col-span-1">
                            <div className="space-y-2">
                                <Image
                                    src={`/upload/${toEditEvent.image}`}
                                    className="hidden rounded-lg grayscale lg:block"
                                    alt={toEditEvent.title}
                                    height={400}
                                    width={400}
                                />

                                <div className="flex space-x-2">
                                    <div className="w-1/3">
                                        <Image
                                            src={`/upload/${toEditEvent.image}`}
                                            className="rounded-lg grayscale"
                                            alt={toEditEvent.title}
                                            height={180}
                                            width={180}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <Image
                                            src={`/upload/${toEditEvent.image}`}
                                            className="rounded-lg grayscale"
                                            alt={toEditEvent.title}
                                            height={180}
                                            width={180}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <Image
                                            src={`/upload/${toEditEvent.image}`}
                                            className="rounded-lg grayscale"
                                            alt={toEditEvent.title}
                                            height={180}
                                            width={180}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full space-y-4 lg:col-span-2">
                            <div className="truncate text-xl font-medium text-white lg:text-2xl">
                                {title}
                            </div>


                            <div className="space-y-4 text-sm text-gray-200">
                                {content}
                            </div>
                        </div>
                        <div className="space-y-4 rounded-lg bg-gray-900 p-3">
                            <div>
                                <strong className="font-bold text-gray-100">
                                    {format(new Date(date), "MMM d yyyy")}
                                </strong>
                            </div>
                            <div>
                                <h1 className="text-gray-300">{location}</h1>
                            </div>
                            <div className="flex">
                                {Number(price) === 0 ? (
                                    <h1 className="text-lg font-bold leading-snug text-white">
                                        {" "}
                                        FREE{" "}
                                    </h1>
                                ) : (
                                    <div>
                                        <div className="text-sm leading-snug text-white">
                                            ${price}
                                        </div>
                                        <div className="text-lg font-bold leading-snug text-white"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div> */}
        </div>
    )
}
