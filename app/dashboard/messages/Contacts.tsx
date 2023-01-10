import { getViperById } from "../../../lib/vipers"
import Image from "next/image"
import Link from "next/link"

export default async function Contacts({ id }: { id: string }) {
    const viper = await getViperById(id!)

    return (
        <Link href={`/dashboard/messages/${id}`} className="space-y-2 ">
            <div className="h-6 w-6 rounded-full bg-gray-700 ">
                {" "}
                <Image
                    src={`/vipers/${viper?.image}`}
                    alt={`/vipers/${viper?.image}`}
                    width={50}
                    height={50}
                    className="rounded-full col-start-1 my-2"
                />
            </div>
            <span className="text-sm text-white my-5 ">{viper?.name}</span>
        </Link>
    )
}
