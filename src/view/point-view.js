import { createElement } from '../render.js';
import { createListItemView } from '../template/point-template';

export default class PointView{
  getTemplate() {
    return createListItemView();
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
