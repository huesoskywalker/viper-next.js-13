import { getViper } from "../../../lib/vipers"
import { PageProps } from "../../../lib/utils"

export default async function ViperPage({ params }: PageProps) {
    const id: string = params.id
    const viper = await getViper(id)

    return (
        <div>
            <h3>viper</h3>
            <div>
                <h1>{viper?.name}</h1>
                <h5>{viper?.email}</h5>
                <p>{viper?.image}</p>
            </div>
        </div>
    )
}
