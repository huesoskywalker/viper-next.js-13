import { NextApiRequest, NextApiResponse } from "next"
import { shopifyAdmin } from "../../lib/adminApi"
import { STAGE_UPLOAD } from "../../graphql/mutation/stageUploadCreate"
import { loadSession } from "../../lib/SHPPIFY-SESSION-STORAGE"

const stageUploadCreate = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body
    const session = shopifyAdmin.session.customAppSession(
        "vipers-go.myshopify.com"
    )
    const client = new shopifyAdmin.clients.Graphql({ session })

    const STAGE_INPUT = {
        input: [
            {
                // here we should use the file.name and file.type from the uploaded image from the Event.
                filename: body.filename,
                fileSize: body.size,
                mimeType: body.type,
                httpMethod: "POST",
                resource: "FILE", //2021 someone recommended "FILE"
            },
        ],
    }
    const stageUpload = await client.query({
        data: {
            query: STAGE_UPLOAD,
            variables: STAGE_INPUT,
        },
    })

    return res.status(200).json(stageUpload)
}

export default stageUploadCreate
