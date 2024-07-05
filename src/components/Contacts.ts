import { Form } from './common/Form';
import { IOrder } from '../types';
import { IEvents } from './base/events';

export class Contacts extends Form<IOrder> {
	protected _paymentButton: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

}