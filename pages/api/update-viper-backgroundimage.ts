import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function uploadViperFiles(
    req: NextApiRequest,
    res: NextApiResponse<{
        bgdata: {
            url: string | string[]
        } | null
        bgerror: string | null
    }>
) {
    console.log(req.body)
    console.log(`----------------------`)
    return new Promise(async (resolve, reject) => {
        const form = new Formidable({
            multiples: true,
            keepExtensions: true,
        })

        const url: string[] = []
        form.on("file", (name: string, file: File) => {
            const data = fs.readFileSync(file.filepath)
            file.filepath = file.newFilename

            fs.writeFileSync(`public/vipers/${file.newFilename}`, data)

            const url = file.filepath

            res.status(200).json({
                bgdata: {
                    url: url,
                },
                bgerror: null,
            })
        })
            .on("aborted", () => {
                reject(res.status(500))
            })
            .on("end", () => {
                resolve(res.status(200))
            })
        await form.parse(req)
    })
}
