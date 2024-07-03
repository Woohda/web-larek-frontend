export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    preview: string | null;
    locked: boolean;
}

export interface IBasket {
    items: HTMLElement[];
    seletedItems: string[];
    total: number;  
}

export interface IAppData {
	catalog: IProduct[];
	preview: string | null;
}

export interface IProduct {
    id: string
    title: string
    price: number
    description: string
    category: string
    image: string
}

export interface IUserData {
    payment: string
    address: string
    email: string
    phone: string
}

export interface IOrder extends IUserData {
    total: number
    items: string[]
}
export interface IOrderResult { 
    id: string
    total: string
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' ;

export interface IApi {
    baseUrl: string;
    cdn: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}