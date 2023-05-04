"use client"

import { useState, useTransition, FormEvent } from "react"
import { useRouter } from "next/navigation"

export function EditEventForm({
    eventId,
    eventOrganizerId,
    eventTitle,
    eventContent,
    eventLocation,
    eventDate,
    eventCategory,
    eventImage,
    eventPrice,
}: {
    eventId: string
    eventOrganizerId: string
    eventTitle: string
    eventContent: string
    eventLocation: string
    eventDate: string
    eventCategory: string
    eventImage: string
    eventPrice: number
}) {
    const [title, setTitle] = useState<string>(eventTitle)
    const [content, setContent] = useState<string>(eventContent)
    const [location, setLocation] = useState<string>(eventLocation)
    const [date, setDate] = useState<string>(eventDate)
    const [category, setCategory] = useState<string>(eventCategory)
    const [image, setImage] = useState<string>(eventImage)
    const [createObjectURL, setCreateObjectURL] = useState<string>()
    const [price, setPrice] = useState<string>(eventPrice.toString())
    const [pendingEdit, setPendingEdit] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

            const response = await fetch(`/api/event/create/submit`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    _id: eventId,
                    title,
                    content,
                    location,
                    date,
                    category,
                    price: Number(price),
                    dateNow: Date.now(),
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
                router.prefetch(`/${eventId}`)
            })
            router.push(`/${eventId}`)
        } catch (error) {
            console.error(error)
        }
    }

    const deleteEvent = async (): Promise<void> => {
        // setPendingDelete(!pendingDelete)
        try {
            const response = await fetch(`/api/event/create/submit`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    eventId: eventId,
                    eventOrganizerId: eventOrganizerId,
                    image: eventImage,
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
        <div className="py-2 flex justify-center">
            <div className="w-4/5">
                <div className="grid grid-cols-1 gap-6">
                    <form onSubmit={(e) => handleSubmit(e)} className="text-sm">
                        <label className="block py-1">
                            <span className="text-gray-300">Event name</span>
                            <input
                                data-test="event-title"
                                type="text"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">Additional details</span>
                            <textarea
                                data-test="event-content"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                            ></textarea>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">What type of event is it?</span>
                            <select
                                data-test="event-category"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value={"All"}>Select an Option</option>
                                <option value={"bars"}>Bars</option>
                                <option value={"clubs"}>Clubs</option>
                                <option value={"music"}>Music</option>
                                <option value={"sports"}>Sport</option>
                                <option value={"art"}>Art</option>
                            </select>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">When is your event?</span>
                            <input
                                data-test="event-date"
                                type="date"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">Where is it happening?</span>
                            <select
                                data-test="event-location"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            >
                                <option value={"Nowhere"}>Select an Option</option>
                                <option value={"Argentina"}>Argentina</option>
                                <option value={"California"}>California</option>
                                <option value={"Uruguay"}>Uruguay</option>
                                <option value={"Spain"}>Spain</option>
                                <option value={"Italy"}>Italy</option>
                                <option value={"Greece"}>Greece</option>
                                <option value={"New Zealand"}>New Zealand</option>
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
                                data-test="event-price"
                                type="number"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        <div className="flex justify-center gap-6">
                            <button
                                data-test="edit-event-button"
                                className={`${
                                    isMutating ? "bg-opacity-60" : "bg-opacity-100"
                                } relative w-2/6 items-center space-x-2 rounded-lg bg-gray-700 my-3  py-2 text-sm font-medium text-gray-200 hover:bg-yellow-700 hover:text-white disabled:text-white/70`}
                                disabled={isPending}
                                // onClick={handleSubmit}
                                type={"submit"}
                            >
                                Submit Edition
                                {isPending && pendingEdit ? (
                                    <div className="absolute right-2 top-1.5" role="status">
                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : null}
                            </button>
                            <button
                                data-test="delete-event-button"
                                className="relative w-2/6 items-center  space-x-2 rounded-lg bg-red-800 my-3  py-2 text-sm font-medium text-black hover:bg-red-600 hover:text-white disabled:text-white/70"
                                disabled={isPending}
                                onClick={deleteEvent}
                                type={"button"}
                            >
                                Delete
                                {isPending && !pendingEdit ? (
                                    <div className="absolute right-10 top-1.5" role="status">
                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                        <span className="sr-only">Loading...</span>
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
