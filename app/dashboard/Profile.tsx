import Image from "next/image"
import { Viper } from "../../lib/vipers"
import { Follow } from "../../components/Follow"
import { cookies } from "next/headers"
import ShowFollows from "./ShowFollows"
import Link from "next/link"
import ViperInfo from "../vipers/ViperInfo"

export const Profile = async ({
    fullViper,
    params,
}: {
    fullViper: Viper
    params: string
}) => {
    const string: string = JSON.stringify(fullViper._id)
    const id: string = string.slice(1, -1)

    const followCookie = cookies().get("_is_followed")?.value || "Follow"

    return (
        <div className="grid grid-cols-4">
            <div className="col-span-4">
                <Image
                    src={`/vipers/${fullViper.backgroundImage}`}
                    width={580}
                    height={80}
                    className="-z-10 rounded-xl  group-hover:opacity-80"
                    alt={fullViper.name}
                    placeholder="blur"
                    blurDataURL={fullViper.image}
                ></Image>
                <div className="z-10 relative bottom-9 left-7">
                    <Image
                        src={`/vipers/${fullViper.image}`}
                        width={100}
                        height={100}
                        className="  rounded-full border-solid border-2 border-yellow-600 group-hover:opacity-80"
                        alt={fullViper.name}
                        placeholder="blur"
                        blurDataURL={fullViper.image}
                    />
                    <div className="grid grid-cols-2">
                        <h1 className="text-sm text-gray-300 mt-3">
                            {fullViper.name}
                            <p className="text-sm text-gray-300 mt-1">
                                {fullViper.email}
                            </p>
                        </h1>
                        <div className="relative left-10 ">
                            {params === undefined ? (
                                <Link
                                    href={`/dashboard/edit/${fullViper?._id}`}
                                    className="block row-end-4 rounded-md  px-3 py-2 text-sm font-medium text-yellow-600 hover:text-gray-300"
                                >
                                    Edit profile
                                </Link>
                            ) : null}
                            {params !== undefined ? (
                                <Follow id={id} followCookie={followCookie} />
                            ) : null}
                        </div>
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
                        >
                            {fullViper.follows.map((followsId) => {
                                /* @ts-expect-error Async Server Component */
                                return <ViperInfo id={followsId} />
                            })}
                        </ShowFollows>

                        <ShowFollows
                            follows={fullViper.followers?.length}
                            followers={true}
                        >
                            {fullViper.followers.map((followsId) => {
                                /* @ts-expect-error Async Server Component */
                                return <ViperInfo id={followsId} />
                            })}
                        </ShowFollows>
                    </div>
                </div>
            </div>
        </div>
    )
}
