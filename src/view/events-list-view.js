import { createElement } from '../render.js';
import { createListTemplate } from '../template/events-list-template.js';

export default class EventListView {
  getTemplate() {
    return createListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
