import Link from "next/link"
import Image from "next/image"
import { Viper, getViperById } from "../../lib/vipers"
import { firstLogin } from "../../lib/utils"

export default async function ViperInfo({ id }: { id: string }) {
    const viperId: string = id.replace(/['"]+/g, "")
    const viper: Viper | undefined = await getViperById(viperId)
    if (!viper) return

    return (
        <div>
            <Link href={`/dashboard/vipers/${viperId}`} className="group-block">
                <div className="space-y-4">
                    <Image
                        src={`${
                            firstLogin(viper.image)
                                ? viper.image
                                : `/vipers/${viper.image}`
                        }`}
                        width={50}
                        height={50}
                        className="rounded-full  group-hover:opacity-80"
                        alt={viper!.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <p className="text-xs text-gray-300">{viper?.name}</p>
                </div>
            </Link>
        </div>
    )
}
