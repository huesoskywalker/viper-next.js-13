import { getViperById } from "../../../lib/vipers"
import { PageProps } from "../../../lib/utils"
import { Profile } from "../../dashboard/Profile"

export default async function ViperPage({ params }: PageProps) {
    const id: string = params.id
    const viper = await getViperById(id)

    return (
        <div>
            <h3>viper</h3>
            <div className="flex justify-center">
                {/* @ts-expect-error Async Server Component */}
                <Profile fullViper={viper} params={id} />
                {/* {viper ? (
                    <div>
                        <Image
                            src={`/vipers/${viper.image}`}
                            width={80}
                            height={50}
                            className="rounded-xl grayscale group-hover:opacity-80"
                            alt={viper.name}
                            // placeholder="blur"
                            // blurDataURL={product.imageBlur}
                        />
                        <h1 className="text-sm text-gray-300">{viper.name}</h1>
                        <p className="text-sm text-gray-300">{viper.email} </p>
                    </div>
                ) : (
                    <div></div>
                )} */}
            </div>
        </div>
    )
}
