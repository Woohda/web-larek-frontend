import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { IApi, IOrder, IProduct } from './types';
import { Page } from './components/Page';
import { AppData } from './components/AppData';
import { Product } from './components/Product';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Success } from './components/Success';

// Экземпляр событий
const events = new EventEmitter();
// Вывод всех событий в консоль
events.onAll((event) => {
    console.log(event);
})

// Экземпляр API
const baseApi: IApi = new Api(API_URL, CDN_URL);
const api = new AppApi(baseApi);

// Модель данных приложения
const appData = new AppData({}, events);

// Темплейты
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Экземпляры компонентов
const page = new Page(document.querySelector('.page'), events);
const modal = new Modal(document.querySelector('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// Получение данных с сервера
api.getData()
    .then(appData.setCatalog.bind(appData))
    .then(() => events.emit('cards:loaded'))
    .catch((error) => {
        console.error(error);
    })

// Событие успешной загрузки данных. Рендер коллекции карточек
events.on('cards:loaded', () => {
    const cardsArray = appData.catalog.map((item) => {
        const cardInstant = new Product(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
        return cardInstant.render(item);
    });
    page.render({ catalog: cardsArray });
}); 

// Событие выбора карточки
events.on('card:select', (item: IProduct) => appData.setPreview(item));

// Событие открытия карточки в модальном окне
events.on('preview:changed', (item: IProduct) => {
	const cardInstantPreview = new Product(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			cardInstantPreview.button = appData.checkItem(item);
		},
	});

	modal.render({
		content: cardInstantPreview.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			button: appData.checkItem(item),
			price: item.price,
		}),
	});
});

// Событие открытия модального окна. Блокировка скролла 
events.on('modal:open', () => {
	page.locked = true;
});

// Событие закрытия модального окна. Разблокировка скролла
events.on('modal:close', () => {
	page.locked = false;
});

// Событие нажатия на кнопку в корзину
events.on('item:check', (item: IProduct) => {
	if (appData.basket.indexOf(item) === -1) {
        events.emit('item:add', item)
        ;}
	    else {events.emit('item:remove', item);}
});

// Событие добавления товара в корзину
events.on('item:add', (item: IProduct) => {
	appData.addToBasket(item);
});

// Событие удаления товара из корзины
events.on('item:remove', (item: IProduct) => {
	appData.removeFromBasket(item);
});

// Событие открытия корзины 
events.on('basket:open', () => {
    basket.selectedItems = appData.basket;
    modal.render({
        content: basket.render()});
})

// Событие изменения состояния корзины
events.on('basket:changed', (items: IProduct[]) => {
	basket.items = items.map((item, indexItem) => {
		const cardInstantBasket = new Product(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:remove', item);
			},
		});
		return cardInstantBasket.render({
			indexItem: (indexItem + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	// Обновление суммы заказа
	appData.order.total = basket.setTotal(appData.basket);

});

// Собыьтие изменения счетчика товаров корзины
events.on('count:changed', () => (page.counter = appData.basket.length));

// Событие открытия модального окна оформления доставки
events.on('order:open', () => {
    appData.order.items = appData.basket.map((item) => item.id);
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Событие проверки выбора способа оплаты
events.on('order:change', ({ name }: { name: string }) => {
	appData.order.payment = name;
	appData.validateForm();
});

// Событие открытия формы контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Событие изменения состояния полей ввода форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей в форме доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей в форме контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);


// Событие отправки формы заказа
events.on('contacts:submit', () => {
	api
		.order(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			success.total = `Списано ${appData.order.total} синапсов`;
			appData.clearBasket();
			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => console.error(err));
});




