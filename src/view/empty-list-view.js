import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  isFailed: 'Failed to load latest route information'
};

function createListTemplate(placeholderText) {
  return `<p class="trip-events__msg">${NoPointsText[placeholderText]}</p>`;
}
export default class EmptyListView extends AbstractView{
  #messageType = null;

  constructor({messageType}) {
    super();
    this.#messageType = messageType;
  }

  get template() {
    return createListTemplate(this.#messageType);
  }
}
