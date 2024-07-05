import { IBasket, IProduct } from "../types";
import { formatNumber } from "../utils/utils";
import { Component } from "./base/component";
import { EventEmitter } from "./base/events";

export class Basket extends Component<IBasket> {
	protected _productList: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._productList = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this.items = [];
		if (this._button)
			this._button.addEventListener('click', () => events.emit('order:open'));
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._productList.replaceChildren(...items)
		} else {
			this._productList.replaceChildren("Корзина пуста");
			this.setDisabled(this._button, true);
		}
    }

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
	}

	set selectedItems(items: IProduct[]) {
		if (items.length) this.setDisabled(this._button, false);
	}
}