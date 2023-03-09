import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function uploadViperFiles(
    req: NextApiRequest,
    res: NextApiResponse<{
        data: {
            url: string | string[] | null
        } | null
        error: string | null
    }>
) {
    if (req.readableLength > 500) {
        return new Promise(async (resolve, reject) => {
            const form = new Formidable({
                multiples: true,
                keepExtensions: true,
            })
            form.on("file", (name: string, file: File) => {
                const data = fs.readFileSync(file.filepath)
                file.filepath = file.newFilename
                fs.writeFileSync(`public/vipers/${file.newFilename}`, data)
                const url = file.filepath

                res.status(200).json({
                    data: {
                        url: url,
                    },
                    error: null,
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
    return res.status(200).json({
        data: {
            url: null,
        },
        error: null,
    })
}
