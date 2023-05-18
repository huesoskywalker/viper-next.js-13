"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition, FormEvent, useEffect } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import Loading from "./loading"

export default function EditProfile({}: // viperId,
// name,
// image,
// backgroundImage,
// biography,
// location,
{
    // viperId: string
    // name: string
    // image: string
    // backgroundImage: string
    // biography: string
    // location: string
}) {
    const { data: session, status, update } = useSession()
    const viper = session?.user
    if (!viper) return <div className="text-gray-300 text-sm"> Loading... </div>
    const [newName, setNewName] = useState<string | undefined>()
    const [newBiography, setNewBiography] = useState<string>()
    const [newLocation, setNewLocation] = useState<string | undefined>()
    const [profileImageFile, setProfileImageFile] = useState<File>()
    const [backgroundImageFile, setBackgroundImageFile] = useState<File>()
    const [createObjectURL, setCreateObjectURL] = useState<string>("")
    const [showImage, setShowImage] = useState<boolean>(false)
    const [displayImage, setDisplayImage] = useState<string>("profile" || "background" || "")

    const router = useRouter()

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsFetching(true)

        try {
            const profileImage = new FormData()
            console.log(`---formData profileImage`)
            console.log(profileImage)
            if (profileImageFile) profileImage.append("file", profileImageFile)
            const uploadImage = await fetch(`/api/viper/profile-image`, {
                method: "PUT",
                body: profileImage,
            })
            const {
                data,
                error,
            }: {
                data: {
                    url: string | null
                }
                error: string | null
            } = await uploadImage.json()
            const imageUrl = data?.url
            // ---------------------------------------------------------------
            const backgroundImage = new FormData()
            if (backgroundImageFile) backgroundImage.append("file", backgroundImageFile)
            const bgUploadImage = await fetch(`/api/viper/background-image`, {
                method: "PUT",
                body: backgroundImage,
            })
            const {
                bgData,
                bgError,
            }: {
                bgData: {
                    url: string | null
                }
                bgError: string | null
            } = await bgUploadImage.json()
            const bgImageUrl = bgData?.url
            // -----------------------------------------------
            const response = await fetch(`/api/viper/edit`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    _id: viper._id,
                    name: newName,
                    biography: newBiography,
                    location: newLocation,
                    image: imageUrl,
                    backgroundImage: bgImageUrl,
                }),
            })
            const freshViper = await response.json()
            update({
                name: newName,
                biography: newBiography,
                location: newLocation,
                image: imageUrl,
            })

            setIsFetching(false)

            startTransition(() => {
                setNewName("")
                setNewBiography("")
                setNewLocation("")
                router.refresh()
            })
            router.prefetch("/profile")
            router.push(`/profile`)
        } catch (error) {
            console.error(error)
        }
    }

    const uploadProfileImage = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const profileFile = event.target.files[0]
            setProfileImageFile(profileFile)
            setCreateObjectURL(URL.createObjectURL(profileFile))
            setDisplayImage("profile")
            setShowImage(!showImage)
        }
    }
    const uploadBackgroundImage = async (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const backgroundFile = event.target.files[0]
            setBackgroundImageFile(backgroundFile)

            setCreateObjectURL(URL.createObjectURL(backgroundFile))
            setDisplayImage("background")
            setShowImage(!showImage)
        }
    }

    const acceptProfileImg = (): void => {
        setShowImage(!showImage)
        setCreateObjectURL("")
        setDisplayImage("")
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
                                    <form onSubmit={(e) => handleSubmit(e)} className="text-sm">
                                        <label className="block py-1">
                                            <span className="text-gray-300">Full name</span>
                                            <input
                                                data-test="new-name"
                                                type="text"
                                                className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                            />
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">Add a biography</span>
                                            <textarea
                                                data-test="new-biography"
                                                className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={newBiography}
                                                onChange={(e) => setNewBiography(e.target.value)}
                                                rows={2}
                                            ></textarea>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300">
                                                Where are you located?
                                            </span>
                                            <select
                                                data-test="new-location"
                                                className="block p-1 w-full rounded-lg border   sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                onChange={(e) => setNewLocation(e.target.value)}
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
                                            <label className="block py-1">
                                                <span className="text-gray-300">
                                                    Profile Image
                                                </span>
                                                <input
                                                    data-test="new-profile-image"
                                                    className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                    type={"file"}
                                                    onChange={(e) => uploadProfileImage(e)}
                                                />
                                            </label>

                                            <label className="block py-1">
                                                <span className="text-gray-300">
                                                    Background Image
                                                </span>
                                                <input
                                                    data-test="new-background-image"
                                                    className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                                                    type={"file"}
                                                    onChange={(e) => uploadBackgroundImage(e)}
                                                ></input>
                                            </label>
                                        </label>
                                        <div className="flex justify-center">
                                            <button
                                                data-test="submit-button"
                                                className={`${
                                                    isMutating
                                                        ? "bg-opacity-60 animate-pulse"
                                                        : "bg-opacity-100"
                                                } relative w-fit items-center space-x-3 rounded-lg bg-gray-700 my-3 py-2 px-5 text-sm font-medium text-gray-200 hover:text-white hover:bg-yellow-600/80 disabled:text-white/70`}
                                                disabled={isPending}
                                                type={"submit"}
                                            >
                                                {isMutating ? "Editing..." : "Edit"}
                                                {isPending ? (
                                                    <div
                                                        className="absolute right-2 top-1.5"
                                                        role="status"
                                                    >
                                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                ) : null}
                                            </button>
                                        </div>
                                    </form>
                                    {showImage ? (
                                        <div className="fixed top-60 left-50 z-10">
                                            <div className="flex justify-start">
                                                <button
                                                    data-test="accept-edit-image"
                                                    onClick={acceptProfileImg}
                                                    className="fixed rounded-full bg-black z-10"
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
                                                {displayImage === "profile" ? (
                                                    <Image
                                                        src={createObjectURL}
                                                        className={`max-h-24 max-w-24 hidden rounded-full border-solid border-2 border-yellow-600 lg:block`}
                                                        alt={createObjectURL}
                                                        width={100}
                                                        height={100}
                                                        placeholder="blur"
                                                        blurDataURL={"image"}
                                                        loading="lazy"
                                                    />
                                                ) : displayImage === "background" ? (
                                                    <Image
                                                        src={createObjectURL}
                                                        className={`max-h-32 max-w-auto hidden rounded-full border-solid border-2 border-yellow-600 lg:block `}
                                                        alt={createObjectURL}
                                                        width={580}
                                                        height={100}
                                                        placeholder="blur"
                                                        blurDataURL={"image"}
                                                        loading="lazy"
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
