import { productModel1 } from "../models/product.model.js";

const dbCreateProduct = async(newProduct) => {
 return await productModel1.create(newProduct)
}

export{ 
    dbCreateProduct 
}