import { FormErrors, IAppData, IOrder, IProduct } from "../types";
import { Model } from "./base/model";


export class AppData extends Model<IAppData> {
	basket: IProduct[] = [];
	catalog: IProduct[];
	preview: string | null;
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	}
	formErrors: FormErrors = {};
	
setCatalog(items: IProduct[]) {
	this.catalog = items;
	this.emitChanges('catalog:changed', items);
}
	
setPreview(item: IProduct) {
	this.preview = item.id;
	this.emitChanges('preview:changed', item);	
}

addToBasket(item: IProduct) {
	if (item.price !== null && this.basket.indexOf(item) === -1) {
		this.basket.push(item);
		this.emitChanges('count:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}
}
removeFromBasket(item: IProduct) {
	this.basket = this.basket.filter((el) => el != item);
	this.emitChanges('count:changed', this.basket);
	this.emitChanges('basket:changed', this.basket);
}

clearBasket() {
	this.basket = [];
	this.emitChanges('count:changed', this.basket);
	this.emitChanges('basket:changed', this.basket);
}

checkItem(item: IProduct) { 
	if (this.basket.indexOf(item) === -1) {
		return 'В корзину' 
	} else {
		return 'Убрать из корзины'
	}
}
setOrderField(field: keyof IOrder, value: string | number) {
	if (field === 'total') this.order[field] = value as number;
	else if (field === 'items') {
		this.order[field].push(value as string);
	} else this.order[field] = value as string;

	if (this.validateForm()) this.events.emit('order:ready', this.order);
}

validateForm() {
	const errors: typeof this.formErrors = {};
	if (!this.order.payment) {
		errors.payment = 'Необходимо указать способ оплаты';
	}
	if (!this.order.address) {errors.address = 'Необходимо указать адрес';
	}
	if (!this.order.email) {errors.email = 'Необходимо указать email';
	} else {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)){
			errors.email = 'Некорректный формат email';
		}
		if (!this.order.phone) { errors.phone = 'Необходимо указать телефон';
		} else {
			if (!/^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}\s?\d{2}\s?\d{2}$/.test(this.order.phone)) {
				errors.phone = 'Некорректный формат телефона';
			}
		}
	}	
	this.formErrors = errors;
	this.events.emit('formErrors:change', this.formErrors);
	return Object.keys(errors).length === 0;
	}
}

