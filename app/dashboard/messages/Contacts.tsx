import { Viper, getViperById } from "../../../lib/vipers"
import Image from "next/image"
import Link from "next/link"
import { firstLogin } from "../../../lib/utils"

export default async function Contacts({ id }: { id: string }) {
    const viperId: string = id.replace(/['"]+/g, "")
    const viper: Viper | undefined = await getViperById(viperId)
    if (!viper) return

    return (
        <div>
            <Link
                href={`/dashboard/messages/${viperId}`}
                className="flex justify-start items-center space-x-1"
            >
                <Image
                    src={`${
                        firstLogin(viper.image)
                            ? viper.image
                            : `/vipers/${viper.image}`
                    }`}
                    alt={`/vipers/${viper?.image}`}
                    width={50}
                    height={50}
                    className="h-6 w-6 rounded-full"
                />
                <span className="text-xs text-white ">{viper.name}</span>
            </Link>
        </div>
    )
}
