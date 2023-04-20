import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function uploadProfileImage(
    req: NextApiRequest,
    res: NextApiResponse<{
        data: {
            url: string | string[] | null
        }
        error: string | null
    }>
) {
    return new Promise(async (resolve, reject) => {
        const form = new Formidable({
            multiples: false,
            keepExtensions: true,
            maxFiles: 1,
        })
        form.on("file", (name: string, file: File) => {
            const data = fs.readFileSync(file.filepath)
            file.filepath = file.newFilename
            fs.writeFileSync(`public/vipers/${file.newFilename}`, data)
            let url: string = file.filepath
            console.log(`-----stop the looping here---------`)
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

        form.parse(req)
    })
}
