import Image from "next/image"
import getViperFollowById, { Viper } from "../../lib/vipers"
import { Follow } from "../../components/Follow"
import { cookies } from "next/headers"
import ShowFollows from "./ShowFollows"
import Link from "next/link"
import ViperInfo from "./ViperInfo"
import { firstLogin } from "../../lib/utils"

export const Profile = async ({
    fullViper,
    params,
    currentViper,
}: {
    fullViper: Viper
    params: string
    currentViper: string
}) => {
    const string: string = JSON.stringify(fullViper!._id)
    const id: string = string.slice(1, -1)

    const isViperFollowed = await getViperFollowById(id, currentViper)
    type Truthy = "true" | "false"
    const isFollowed: Truthy = `${isViperFollowed ? true : false}`

    return (
        <div className="grid grid-cols-4">
            <div className="col-span-4 overflow-hidden">
                <Image
                    src={
                        fullViper.backgroundImage !== undefined
                            ? `/vipers/${fullViper.backgroundImage}`
                            : fullViper.image
                    }
                    // src={`/vipers/${fullViper.backgroundImage}`}
                    width={580}
                    height={80}
                    className="-z-10 rounded-xl  group-hover:opacity-80 max-h-44 object-cover object-center -mb-2"
                    alt={fullViper.name}
                    placeholder="blur"
                    blurDataURL={fullViper.image}
                ></Image>
                <div className="z-10 relative bottom-9 left-7">
                    <Image
                        src={`${
                            firstLogin(fullViper.image)
                                ? fullViper.image
                                : `/vipers/${fullViper.image}`
                        }`}
                        width={100}
                        height={100}
                        className="  rounded-full border-solid border-2 border-yellow-600 group-hover:opacity-80 max-h-24 max-w-24 object-cover object-top"
                        alt={fullViper.name}
                        placeholder="blur"
                        blurDataURL={fullViper.image}
                        loading="lazy"
                    />
                    <div className="grid grid-cols-2">
                        <h1 className="text-sm text-yellow-700 mt-4">
                            {fullViper.name}
                            <p className="text-xs text-gray-300 mt-1">
                                {fullViper.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Settled in{" "}
                                <span className="text-gray-200 ">
                                    {fullViper.location ?? "Planet Earth"}
                                </span>
                            </p>
                        </h1>
                        {params === undefined ? (
                            <div className="relative left-10 ">
                                <Link
                                    href={`/profile/edit/${id}`}
                                    className="block row-end-4 rounded-md  px-3 py-2 text-sm font-medium text-yellow-600 hover:text-gray-300"
                                >
                                    Edit profile
                                </Link>
                            </div>
                        ) : null}
                        {/* <div className="relative left-20"> */}
                        {params !== undefined ? (
                            <div className="flex justify-start">
                                <Follow
                                    id={id}
                                    isFollowed={isFollowed}
                                    event={true}
                                />
                            </div>
                        ) : null}
                        {/* </div> */}
                    </div>
                    <div className="break-after-column">
                        <h1 className="text-gray-300 text-sm mt-5">
                            {fullViper.biography}
                        </h1>
                    </div>
                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                        <ShowFollows
                            follows={fullViper.follows?.length}
                            followers={false}
                            profile={true}
                        >
                            {fullViper.follows?.map((followsId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo
                                        key={JSON.stringify(followsId)}
                                        id={JSON.stringify(followsId)}
                                    />
                                )
                            })}
                        </ShowFollows>

                        <ShowFollows
                            follows={fullViper.followers?.length}
                            followers={true}
                            profile={true}
                        >
                            {fullViper.followers?.map((followersId) => {
                                return (
                                    /* @ts-expect-error Async Server Component */
                                    <ViperInfo
                                        key={JSON.stringify(followersId)}
                                        id={JSON.stringify(followersId)}
                                    />
                                )
                            })}
                        </ShowFollows>
                    </div>
                </div>
            </div>
        </div>
    )
}
