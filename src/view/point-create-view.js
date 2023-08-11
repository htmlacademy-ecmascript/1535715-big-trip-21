import { createElement } from '../render.js';
import { createPointCreateView } from '../template/point-create-template.js';

export default class FormCreateView{
  getTemplate() {
    return createPointCreateView();
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
