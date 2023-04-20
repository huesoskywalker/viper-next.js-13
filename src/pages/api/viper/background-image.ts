import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function uploadBackgroundImage(
    req: NextApiRequest,
    res: NextApiResponse<{
        bgData: {
            url: string | string[] | null
        }
        bgError: string | null
    }>
) {
    return new Promise(async (resolve, reject) => {
        const form = new Formidable({
            multiples: false,
            keepExtensions: true,
        })
        form.on("file", (name: string, file: File) => {
            const data = fs.readFileSync(file.filepath)
            file.filepath = file.newFilename
            fs.writeFileSync(`public/vipers/${file.newFilename}`, data)
            let url: string = file.filepath
            return res.status(200).json({
                bgData: {
                    url: url,
                },
                bgError: null,
            })
        })
            .on("aborted", () => {
                reject(res.status(500))
            })
            .on("end", () => {
                resolve(res.status(200))
            })

        form.parse(req)
    })
}
