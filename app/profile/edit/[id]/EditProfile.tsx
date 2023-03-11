"use client"
// Use transition broke after installing shopify-api
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition, FormEvent } from "react"
// import { Viper } from "../../../../lib/vipers"
import Image from "next/image"

export default function EditProfile({
    // viper,
    viperId,
    name,
    biography,
    location,
}: {
    // viper: Viper
    viperId: string
    name: string
    biography: string
    location: string
}) {
    const [newName, setNewName] = useState<string>(name)
    const [newBiography, setNewBiography] = useState<string>(biography)
    const [newLocation, setNewLocation] = useState<string>(location)
    const [profileImage, setProfileImage] = useState<string>("")
    const [backgroundImage, setBackgroundImage] = useState<string>("")
    const [createObjectURL, setCreateObjectURL] = useState<string>("")
    const [showProfileImg, setShowProfileImg] = useState<boolean>(false)

    const router = useRouter()

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault()
        setIsFetching(true)
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
                    viperId,
                    newName,
                    newBiography,
                    newLocation,
                    imageUrl: imageUrl ?? profileImage,
                    bgImageUrl: bgImageUrl ?? backgroundImage,
                }),
            })
            await response.json()
            setIsFetching(false)
            startTransition(() => {
                setNewName("")
                setNewBiography("")
                setNewLocation("")
                setProfileImage("")
                setBackgroundImage("")
                // router.refresh()
                router.prefetch("/profile")
            })
            // Same in EditForm, if works, DELETE
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
            setCreateObjectURL(URL.createObjectURL(i))
            setShowProfileImg(!showProfileImg)
        }
    }

    const acceptProfileImg = (): void => {
        setShowProfileImg(!showProfileImg)
    }

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center min-h-screen px-4 py-2 ">
                <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
                    <div className="m-1 ">
                        <Link
                            href={`/profile`}
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
                        </Link>

                        <div className="flex justify-center">
                            <div className="w-full mx-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <form
                                        onSubmit={(e) => handleSubmit(e)}
                                        className="text-sm"
                                    >
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Full name
                                            </span>
                                            <input
                                                type="text"
                                                className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                value={newName}
                                                onChange={(e) =>
                                                    setNewName(e.target.value)
                                                }
                                            />
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Add a biography
                                            </span>
                                            <textarea
                                                className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={newBiography}
                                                onChange={(e) =>
                                                    setNewBiography(
                                                        e.target.value
                                                    )
                                                }
                                                rows={2}
                                            ></textarea>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Profile Image
                                            </span>
                                            <input
                                                className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                type={"file"}
                                                onChange={(e) =>
                                                    uploadProfileImage(e)
                                                }
                                            ></input>
                                        </label>
                                        {showProfileImg ? (
                                            <div className="fixed inset-auto">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={
                                                            acceptProfileImg
                                                        }
                                                        className="fixed j rounded-full bg-black z-10"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className="w-5 h-5 text-yellow-300 hover:text-yellow-300/80"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <Image
                                                        src={createObjectURL}
                                                        className="hidden rounded-full border-solid border-2 border-yellow-600 lg:block"
                                                        alt={createObjectURL}
                                                        width={100}
                                                        height={100}
                                                        placeholder="blur"
                                                        blurDataURL={"image"}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Background Image
                                            </span>
                                            <input
                                                className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                type={"file"}
                                                onChange={uploadBackgroundImage}
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Where are you located?
                                            </span>
                                            <select
                                                className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={newLocation}
                                                onChange={(e) =>
                                                    setNewLocation(
                                                        e.target.value
                                                    )
                                                }
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
                                                        ? "bg-opacity-60 animate-pulse"
                                                        : "bg-opacity-100"
                                                } relative w-fit items-center space-x-3 rounded-lg bg-gray-700 my-3 py-2 px-5 text-sm font-medium text-gray-200 hover:text-white hover:bg-yellow-600/80 disabled:text-white/70`}
                                                disabled={isPending}
                                                // onClick={(e) => handleSubmit(e)}
                                                type={"submit"}
                                            >
                                                {isMutating
                                                    ? "Editing..."
                                                    : "Edit Profile"}
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
