import { getViperBasicProps, getViperById } from "@/lib/vipers"
import Image from "next/image"
import Link from "next/link"
import { firstLogin } from "@/lib/utils"
import { Viper, ViperBasicProps } from "@/types/viper"

export default async function Contacts({ id }: { id: string }) {
    const viperId: string = id.replace(/['"]+/g, "")
    const viper: ViperBasicProps | null = await getViperBasicProps(viperId)
    if (!viper) throw new Error("No viper bro")

    return (
        <div>
            <Link
                data-test="contact-name"
                href={`/dashboard/messages/${viperId}`}
                className="flex justify-start items-center space-x-1 text-xs text-white "
            >
                <Image
                    data-test="contact-image"
                    src={`${firstLogin(viper.image) ? viper.image : `/vipers/${viper.image}`}`}
                    alt={`/vipers/${viper?.image}`}
                    width={50}
                    height={50}
                    className="h-6 w-6 rounded-full"
                />
                {/* <span data-test="contact-name" className=""> */}
                {viper.name}
                {/* </span> */}
            </Link>
        </div>
    )
}
