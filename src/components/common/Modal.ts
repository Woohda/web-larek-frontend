import { Component } from "../base/component";
import { IEvents } from "../base/events";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;
      this._content = this.container.querySelector(".modal__content");
      this._content.addEventListener('click', (event) => event.stopPropagation());
      const closeButtonElement = this.container.querySelector(".modal__close");
      closeButtonElement.addEventListener("click", this.close.bind(this));
      this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
          this.close();
        }
      });
      this.handleEscUp = this.handleEscUp.bind(this);
    };

    set content(value: HTMLElement) {
      this._content.replaceChildren(value);
    };
  
    open() {
      this.container.classList.add("modal_active");
      document.addEventListener("keyup", this.handleEscUp);
      this.events.emit("modal:open", this._content);
    };
  
    close() {
      this.container.classList.remove("modal_active");
      document.removeEventListener("keyup", this.handleEscUp);
      this.events.emit("modal:close", this._content);
      this.content = null;
    };
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      };
     
    render(data?: IModal): HTMLElement {
      super.render(data);
      this.open();
      return this.container;
    }
    
  }
  