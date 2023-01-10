"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Viper } from "../../../../lib/vipers"

export default function EditProfile({ viper }: { viper: Viper }) {
    const [name, setName] = useState<string>(viper.name)
    const [biography, setBiography] = useState<string>(viper.biography)
    const [profileImage, setProfileImage] = useState<string>(viper.image)
    const [backgroundImage, setBackgroundImage] = useState<string>(
        viper.backgroundImage
    )
    const [location, setLocation] = useState<string>(viper.location)

    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const image = new FormData()
            image.append("image", profileImage)
            const uploadImage = await fetch(`/api/update-viper-image`, {
                method: "PUT",
                body: image,
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
            console.log(`--------imageUrl-------------`)
            console.log(imageUrl)

            const bgImage = new FormData()
            bgImage.append("backgroundImage", backgroundImage)
            const bgUploadImage = await fetch(
                `/api/update-viper-backgroundimage`,
                {
                    method: "PUT",
                    body: bgImage,
                }
            )

            const {
                bgdata,
                bgerror,
            }: {
                bgdata: {
                    url: string | string[]
                } | null
                bgerror: string | null
            } = await bgUploadImage.json()

            const bgImageUrl = bgdata?.url
            console.log(`------bgImageUrl------------`)
            console.log(bgImageUrl)

            const response = await fetch(`/api/edit-viper`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    viperId: viper._id,
                    name,
                    biography,
                    imageUrl,
                    bgImageUrl,
                    location,
                }),
            })
            await response.json()

            startTransition(() => {
                setName("")
                setBiography("")
                setLocation("")
                setProfileImage("")
                setBackgroundImage("")
            })
            router.push(`/dashboard`)
        } catch (error) {
            console.error(error)
        }
    }

    const uploadBackgroundImage = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setBackgroundImage(i)
            // setCreateObjectURL(URL.createObjectURL(i))
        }
    }
    const uploadProfileImage = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setProfileImage(i)
            // setCreateObjectURL(URL.createObjectURL(i))
            putProfileImage()
        }
    }
    function putProfileImage() {}

    return (
        <div className="py-2">
            <div className="max-w-md">
                <div className="grid grid-cols-1 gap-6">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="text-sm"
                    >
                        <label className="block py-1">
                            <span className="text-gray-300">Full name</span>
                            <input
                                type="text"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Add a biography
                            </span>
                            <textarea
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={biography}
                                onChange={(e) => setBiography(e.target.value)}
                                rows={2}
                            ></textarea>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">Profile Image</span>
                            <input
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type={"file"}
                                onChange={uploadProfileImage}
                            ></input>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Background Image
                            </span>
                            <input
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type={"file"}
                                onChange={uploadBackgroundImage}
                            ></input>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">
                                Where are you located?
                            </span>
                            <select
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                // required
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
                        {/* <div>
                            <label className="text-gray-300">Price</label>
                            <input
                                type="number"
                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div> */}
                        <div className="flex justify-center">
                            <button
                                className="relative w-full items-center space-x-2 rounded-lg bg-gray-700 my-3 mx-32 py-2 text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
                                disabled={isPending}
                                onClick={(e) => handleSubmit(e)}
                            >
                                Edit Profile
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
