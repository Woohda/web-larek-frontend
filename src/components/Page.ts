import { IPage } from "../types";
import { Component } from "./base/component";
import { IEvents } from "./base/events";


export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = this.container.querySelector('.header__basket-counter');
		this._catalog = this.container.querySelector('.gallery');
		this._wrapper = this.container.querySelector('.page__wrapper');
		this._basket = this.container.querySelector('.header__basket');
		this._basket.addEventListener('click', () => {
            this.events.emit('basket:open', { element: this });
        });
		
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
	}
}