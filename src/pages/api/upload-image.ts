import { File, Formidable } from "formidable"
import fs from "fs"
import type { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function uploadFormFiles(
    req: NextApiRequest,
    res: NextApiResponse<{
        data: {
            url: string | string[]
            filename: string | null
            type: string | null
            size: string
        } | null
        error: string | null
    }>
) {
    return new Promise(async (resolve, reject) => {
        const form = new Formidable({
            multiples: true,
            keepExtensions: true,
        })

        form.on("file", (name: string, file: File) => {
            const data = fs.readFileSync(file.filepath)
            file.filepath = file.newFilename
            fs.writeFileSync(`public/upload/${file.newFilename}`, data)
            const url = file.filepath
            const filename = file.originalFilename
            const type = file.mimetype
            const size = file.size.toString()
            res.status(200).json({
                data: {
                    url,
                    filename,
                    type,
                    size,
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
