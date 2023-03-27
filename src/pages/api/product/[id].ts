import { NextApiRequest, NextApiResponse } from "next"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"
import { getProductInventoryCount } from "@/helpers/productInventory"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    {
        /**
         * Let's build it properly, as GET request with the req.query
         * As well , figure out the return type of query
         */
    }
    // const query = req.query
    // console.log(req.query)
    try {
        const productInventory: InventoryItem = await getProductInventoryCount(
            body.productId
        )
        return res.status(200).json({
            totalInventory: productInventory,
        })
    } catch (error) {
        return res.status(400).json(error)
    }
}
