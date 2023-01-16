import Link from "next/link"
import Image from "next/image"
import { getViperById } from "../../lib/vipers"

export default async function ViperInfo({ id }: { id: string }) {
    const viper = await getViperById(id)

    return (
        <div>
            <Link href={`vipers/${id}`} className="group-block">
                <div className="space-y-4">
                    <Image
                        src={`/vipers/${viper?.image}`}
                        width={80}
                        height={50}
                        className="rounded-xl  group-hover:opacity-80"
                        alt={viper!.name}
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                    />
                    <p className="text-sm text-gray-300">{viper?.name}</p>
                </div>
            </Link>
        </div>
    )
}
