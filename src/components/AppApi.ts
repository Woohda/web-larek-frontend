import { IProduct, IApi, IOrder, IOrderResult } from "../types";
import { ApiListResponse } from "./base/api";

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
        this._baseApi = baseApi;
	}

	getData(): Promise<IProduct[]> {
		return this._baseApi.get(`/product`)
        .then((data: ApiListResponse<IProduct>) => 
            data.items.map((item) => ({
                ...item,
                image: `${this._baseApi.cdn}${item.image}`
            }))
        );
           
    }
    order(order: IOrder): Promise<IOrderResult> {
		return this._baseApi.post('/order', order).then((data: IOrderResult) => data);
	}
}