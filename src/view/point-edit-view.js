import { createElement } from '../render.js';
import { createPointEditView } from '../template/point-edit-template.js';

export default class PointEditView{
  getTemplate() {
    return createPointEditView();
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
