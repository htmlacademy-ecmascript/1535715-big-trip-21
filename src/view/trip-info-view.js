import { createElement } from '../render.js';
import { createTripInfoView } from '../template/trip-info-template.js';

export default class TripInfoView {
  getTemplate() {
    return createTripInfoView();
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
