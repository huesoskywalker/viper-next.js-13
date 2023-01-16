"use client"

import Link from "next/link"
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
                    url: string | string[] | null
                } | null
                error: string | null
            } = await uploadImage.json()

            const imageUrl = data?.url
            console.log(`--------imageUrl-------------`)
            console.log(imageUrl)

            const bgImage = new FormData()
            bgImage.append("backgroundImage", backgroundImage)
            const bgUploadImage = await fetch(
                `/api/update-viper-background-image`,
                {
                    method: "PUT",
                    body: bgImage,
                }
            )

            const {
                bgData,
                bgError,
            }: {
                bgData: {
                    url: string | string[] | null
                } | null
                bgError: string | null
            } = await bgUploadImage.json()

            const bgImageUrl = bgData?.url
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
                    imageUrl: imageUrl ?? profileImage,
                    bgImageUrl: bgImageUrl ?? backgroundImage,
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
            router.refresh()
            router.push(`/profile`)
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
        }
    }

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center min-h-screen px-4 py-2 ">
                <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
                    <div className="m-1 ">
                        <Link
                            href={`/profile`}
                            className="flex justify-start self-start text-red-800 hover:text-red-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </Link>

                        {/* aca para abajo, dejando 4 divs es el old edit */}

                        <div className="py-1">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">
                                    <form
                                        onSubmit={(e) => e.preventDefault()}
                                        className="text-sm"
                                    >
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Full name
                                            </span>
                                            <input
                                                type="text"
                                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Add a biography
                                            </span>
                                            <textarea
                                                className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={biography}
                                                onChange={(e) =>
                                                    setBiography(e.target.value)
                                                }
                                                rows={2}
                                            ></textarea>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Profile Image
                                            </span>
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
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
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
                                                className="relative w-full items-center space-x-3 rounded-lg bg-gray-700 my-3 mx-28 py-2 px-5 text-sm font-medium text-white disabled:text-white/70"
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
                    </div>
                </div>
            </div>
        </div>

        //ACA PARA ABAJO EDIT PROFILE

        // <div className="py-2">
        //     <div className="max-w-md">
        //         <div className="grid grid-cols-1 gap-6">
        //             <form
        //                 onSubmit={(e) => e.preventDefault()}
        //                 className="text-sm"
        //             >
        //                 <label className="block py-1">
        //                     <span className="text-gray-300">Full name</span>
        //                     <input
        //                         type="text"
        //                         className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                         value={name}
        //                         onChange={(e) => setName(e.target.value)}
        //                     />
        //                 </label>
        //                 <label className="block py-1">
        //                     <span className="text-gray-300">
        //                         Add a biography
        //                     </span>
        //                     <textarea
        //                         className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                         value={biography}
        //                         onChange={(e) => setBiography(e.target.value)}
        //                         rows={2}
        //                     ></textarea>
        //                 </label>
        //                 <label className="block py-1">
        //                     <span className="text-gray-300">Profile Image</span>
        //                     <input
        //                         className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                         type={"file"}
        //                         onChange={uploadProfileImage}
        //                     ></input>
        //                 </label>
        //                 <label className="block py-1">
        //                     <span className="text-gray-300">
        //                         Background Image
        //                     </span>
        //                     <input
        //                         className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                         type={"file"}
        //                         onChange={uploadBackgroundImage}
        //                     ></input>
        //                 </label>
        //                 <label className="block py-1">
        //                     <span className="text-gray-300">
        //                         Where are you located?
        //                     </span>
        //                     <select
        //                         className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        //                         value={location}
        //                         onChange={(e) => setLocation(e.target.value)}
        //                         // required
        //                     >
        //                         <option value={"Nowhere"}>
        //                             Select an Option
        //                         </option>
        //                         <option value={"Argentina"}>Argentina</option>
        //                         <option value={"California"}>California</option>
        //                         <option value={"Uruguay"}>Uruguay</option>
        //                         <option value={"Spain"}>Spain</option>
        //                         <option value={"Italy"}>Italy</option>
        //                         <option value={"Greece"}>Greece</option>
        //                         <option value={"New Zealand"}>
        //                             New Zealand
        //                         </option>
        //                     </select>
        //                 </label>
        //                 <div className="flex justify-center">
        //                     <button
        //                         className="relative w-full items-center space-x-3 rounded-lg bg-gray-700 my-3 mx-28 py-2 px-5 text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70"
        //                         disabled={isPending}
        //                         onClick={(e) => handleSubmit(e)}
        //                     >
        //                         Edit Profile
        //                         {isPending ? (
        //                             <div
        //                                 className="absolute right-2 top-1.5"
        //                                 role="status"
        //                             >
        //                                 <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
        //                                 {/* <span className="sr-only">
        //                                     Loading...
        //                                 </span> */}
        //                             </div>
        //                         ) : null}
        //                     </button>
        //                 </div>
        //             </form>
        //         </div>
        //     </div>
        // </div>
    )
}
