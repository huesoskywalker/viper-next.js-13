import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { STAGE_UPLOAD } from "../../graphql/mutation/stageUploadCreate"
import { Image } from "@shopify/shopify-api/rest/admin/2023-01/image"
import { RequestReturn } from "@shopify/shopify-api"

const stageUploadCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const filename: string | null | undefined = body.filename
    const size: string | undefined = body.size
    const type: string | null | undefined = body.type
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    if (req.method === "POST") {
        const client = new shopifyAdmin.clients.Graphql({ session })
        try {
            const STAGE_INPUT = {
                input: [
                    {
                        // here we should use the file.name and file.type from the uploaded image from the Event.
                        filename: filename,
                        fileSize: size,
                        mimeType: type,
                        httpMethod: "POST",
                        resource: "FILE", //2021 someone recommended "FILE"
                    },
                ],
            }
            // const stageUpload: RequestReturn<Image>
            const stageUpload = await client.query({
                data: {
                    query: STAGE_UPLOAD,
                    variables: STAGE_INPUT,
                },
            })

            return res.status(200).json(stageUpload)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}

export default stageUploadCreate
