import AbstractView from '../framework/view/abstract-view.js';

function createListTemplate(text) {
  return `<p class="trip-events__msg">${text}</p>`;
}
export default class EmptyListView extends AbstractView{
  #placeholderText = null;

  constructor(text) {
    super();
    this.#placeholderText = text;
  }

  get template() {
    return createListTemplate(this.#placeholderText);
  }
}
