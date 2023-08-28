import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isCheked) {

  return(
    `<div class="trip-filters__filter">
    <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${isCheked ? '' : 'checked'} ${filter.pointsCount === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
    </div>`);
}

function createFilterTemplate(filters) {
  const filterItems = filters.map((filter, index) => createFilterItemTemplate(filter, index)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterItems}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class FilterView extends AbstractView{
  #filters = [];

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
