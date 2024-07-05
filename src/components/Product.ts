import { IProduct } from "../types";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductItem extends IProduct {
	indexItem?: string;
	button: string;
}
export class Product extends Component<IProductItem> {
	events: IEvents;
	protected _indexItem: HTMLElement;
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, actions?: IProductActions) {
        super(container);

		this._indexItem = this.container.querySelector('.basket__item-index');
        this._category = this.container.querySelector('.card__category');
        this._title = this.container.querySelector('.card__title');
        this._price = this.container.querySelector('.card__price');
        this._description = this.container.querySelector('.card__text');
        this._image = this.container.querySelector('.card__image');	
		this._button = this.container.querySelector('.card__button');
		
		if (actions.onClick) {
			if (this._button) this._button.addEventListener('click', actions.onClick);
			else container.addEventListener('click', actions.onClick);
		};	
	}

    set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set indexItem(value: string) {
		this.setText(this._indexItem, value);
	}

	categoryColor(value: string): string {
		switch (value) {
			case 'софт-скил':
				return 'card__category_soft';
			case 'хард-скил':
				return 'card__category_hard';
			case 'кнопка':
				return 'card__category_button';
			case 'дополнительное':
				return 'card__category_additional';
			default:
				return 'card__category_other';
		}
	}

	set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(this.categoryColor(value));
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		(value === null) ? this.setText(this._price, 'Бесценно')
		: this.setText(this._price, `${value.toString()} синапса(-ов)`);
	}

    set description(value: string | string[]) {
        this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		if (this._button) this.setText(this._button, value);
	}

}