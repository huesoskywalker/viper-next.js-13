"use client"

// useTransition error after installing @shopify/shopify-api
import { useState, useTransition, Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Loading from "./loading"

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
    const [entries, setEntries] = useState<string>("")

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const { data: session } = useSession()
    const viper = session?.user
    const organizer = {
        id: viper?.id,
        name: viper?.name,
        email: viper?.email,
        image: viper?.image,
    }

    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsFetching(true)

        try {
            const file = new FormData()
            file.append("file", image)

            const uploadImage = await fetch(`/api/upload-image`, {
                method: "POST",
                body: file,
            })
            const {
                data,
                error,
            }: {
                data: {
                    url: string | string[]
                    filename: string | null
                    type: string | null
                    size: string
                    // file: File
                } | null
                error: string | null
            } = await uploadImage.json()

            const imageUrl = data?.url

            // ----------------------------------------------------------------------------------
            const stageUpload = await fetch(`/api/stage-upload-shopify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename: data?.filename,
                    fileSize: data?.size,
                    type: data?.type,
                }),
            })

            const stageUploadCreate = await stageUpload.json()
            const target =
                stageUploadCreate.body.data.stagedUploadsCreate.stagedTargets[0]
            const parameters = target.parameters
            const resourceUrl = target.resourceUrl
            const url = target.url
            console.log(
                `-----------------stageUploadCreate--------------------`
            )
            console.log(stageUploadCreate)

            parameters.forEach(({ name, value }: any) => {
                file.append(name, value)
            })
            //---------------------------------------------------------------------------------
            //IMAGE must be resized. height: 150px, width: 100px works fine for both.
            const uploadStagedUrl = await fetch(url, {
                headers: {
                    "Content-Length": data!.size + 5000,
                },
                method: "POST",
                body: file,
            })
            console.log(`-----------------uploadStagedUrl--------------------`)
            console.log(uploadStagedUrl)

            // ------------------------------------------------------------------------------
            const createProduct = await fetch(`/api/create-product-shopify`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",

                body: JSON.stringify({
                    // the resources like title and all those stuff yo
                    // eventId: newEvent.insertedId,
                    organizer: organizer?.name,
                    resourceUrl: resourceUrl,
                    title: title,
                    description: content,
                    location: location,
                    address: address,
                    category: category,
                    price: price,
                    entries: entries,
                }),
            })
            const newProduct = await createProduct.json()
            console.log(`-----------------newProduct---------------------`)
            console.log(newProduct)
            const productId = newProduct.body.data.productCreate.product.id

            // ------------------------------------------------------------------------------
            const productCreateMedia = await fetch(
                `/api/create-media-product-shopify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: productId,
                        resourceUrl: resourceUrl,
                    }),
                }
            )
            const productDone = await productCreateMedia.json()
            console.log(`----------------productDone--------------------`)
            console.log(productDone)
            // --------------------------------------------------------------------------
            const publishProduct = await fetch(`/api/publish-product-shopify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: productId,
                    viperApp: "gid://shopify/Publication/121066586402",
                }),
            })
            const productPublished = await publishProduct.json()
            console.log(`----------------productPublished--------------------`)
            console.log(productPublished)
            // ---------------------------------------------------------------------------------------------

            const createEvent = await fetch(`/api/create-event`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    entries,
                    imageUrl,
                    productId,
                }),
            })

            const newEvent = await createEvent.json()

            console.log(`---------------newEvent------------------`)
            console.log(newEvent)

            setIsFetching(false)

            startTransition(() => {
                setTitle("")
                setContent("")
                setLocation("")
                setDate("")
                setTime("")
                setCategory("")
                setImage("")
                setCreateObjectURL("")
                setAddress("")
                setPrice("")
                setEntries("")

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
    useEffect(() => {
        console.log("Image settled")
    }, [image])
    return (
        // <div className="fixed inset-0 z-10 overflow-y-auto">
        //     <div className="flex items-center min-h-screen px-4 py-2 ">
        //         <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
        //             <div className="m-1 ">
        //                 <button
        //                     onClick={() => router.back()}
        //                     className="flex justify-start self-start w-fit text-gray-400 hover:text-red-600"
        //                 >
        //                     <svg
        //                         xmlns="http://www.w3.org/2000/svg"
        //                         fill="none"
        //                         viewBox="0 0 24 24"
        //                         strokeWidth={1.7}
        //                         stroke="currentColor"
        //                         className="w-5 h-5"
        //                     >
        //                         <path
        //                             strokeLinecap="round"
        //                             strokeLinejoin="round"
        //                             d="M6 18L18 6M6 6l12 12"
        //                         />
        //                     </svg>
        //                 </button>
        <div className="py-2 flex justify-center">
            <div className="w-4/5">
                <div className="grid grid-cols-1 gap-6">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="text-sm"
                    >
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                Event name
                            </span>
                            <input
                                type="text"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                Additional details
                            </span>
                            <textarea
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                                required
                            ></textarea>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                What type of event is it?
                            </span>
                            <select
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
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
                                <option value={"sports"}>Sports</option>
                                <option value={"art"}>Art</option>
                            </select>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                When is your event?
                            </span>
                            <input
                                type="date"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                At what time?
                            </span>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                Where is it happening?
                            </span>
                            <select
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
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
                            <span className="text-gray-300 ml-1">Address</span>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                required
                            />
                        </label>
                        <Suspense fallback={<Loading />}>
                            <div>
                                {createObjectURL !== "" ? (
                                    <Image
                                        src={createObjectURL}
                                        className="hidden rounded-lg lg:block"
                                        alt={createObjectURL}
                                        height={400}
                                        width={400}
                                        loading="lazy"
                                    />
                                ) : null}
                            </div>
                        </Suspense>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">
                                Select an image
                            </span>
                            <input
                                type="file"
                                name="myImage"
                                onChange={uploadToClient}
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">Price</span>
                            <input
                                type="number"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        {price && price !== "0" ? (
                            <label className="block py-1">
                                <span className="text-gray-300 ml-1">
                                    Entries
                                </span>
                                <input
                                    type="number"
                                    className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                    value={entries}
                                    onChange={(e) => setEntries(e.target.value)}
                                />
                            </label>
                        ) : null}

                        <div className={`flex justify-center`}>
                            <button
                                className={`${
                                    isMutating
                                        ? "bg-opacity-60 animate-pulse"
                                        : "bg-opacity-100"
                                } relative w-full items-center space-x-2 rounded-lg bg-gray-700 my-3 mx-32 py-2 text-sm font-medium text-gray-100 hover:bg-yellow-600/80 hover:text-white disabled:text-white/70`}
                                disabled={isPending}
                                onClick={(e) => handleSubmit(e)}
                            >
                                {isMutating ? "Creating..." : "Create Event"}
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
        //              </div>
        //         </div>
        //     </div>
        // </div>
    )
}
