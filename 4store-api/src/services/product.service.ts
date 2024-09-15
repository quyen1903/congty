import { BadRequestError, NotFoundError } from '../core/error.response'
import Product from '../models/product.model'

interface getAllProduct {
    featured?: string;
    company?: string;
    name?: string;
    sort?: string;
    fields?: string;
    numericFilters?: string;
    page?: string;
    limit?: string;
}
//use index signature to indicate that key's string
interface query{
    [key: string]: any; 
}

export class ProductService{
    static async getAllProductsStatic(){
        const products = await Product.find({ }).sort('price').select('name price');
        return products;
    }
    static async getAllProducts({ featured, company, name, sort, fields, numericFilters, page, limit }:getAllProduct){

        const queryObject: query = {};
      
        if (featured) {
            queryObject.featured = featured === 'true' ? true : false;
          }
        if (company) {
            queryObject.company = company;
        }
        //partial text search
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' };
        }
        if (numericFilters) {
            //use index signature to indicate that key's type are string
            const operatorMap:{[key: string]: string} = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
            };
            const regEx = /\b(<|>|>=|=|<|<=)\b/g;

            // price>30,rating>=4  price-$gt-30,rating-$gte-4.
            let filters = numericFilters.replace( regEx,(match) => `-${operatorMap[match]}-` );
            const options = ['price', 'rating'];
            console.log(filters)
            filters.split(',').forEach((item) => {
                const [field, operator, value] = item.split('-');
                if (options.includes(field)) {
                queryObject[field] = {  [operator]: Number(value) };
                }
            });
        }
        console.log(queryObject)
        let result = Product.find(queryObject);
        // sort
        if (sort) {
          const sortList = sort.split(',').join(' ');
          result = result.sort(sortList);
        } else {
          result = result.sort('createdAt');
        }
        //field
        if (fields) {
          const fieldsList = fields.split(',').join(' ');
          result = result.select(fieldsList);
        }
        //paginate
        const pagePaginate = Number(page) || 1;
        const limitPaginate = Number(limit) || 10;
        const skip = (pagePaginate - 1) * limitPaginate;
      
        result = result.skip(skip).limit(limitPaginate);
        // 23
        // 4 7 7 7 2
      
        const products = await result;
        return{ products, numberOfItem: products.length };
      };
}