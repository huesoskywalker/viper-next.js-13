import { NextApiRequest, NextApiResponse } from "next"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"
import { getProductInventoryCount } from "../../../helpers/productInventory"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body
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
