import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate({cities, dates, price}){
  return(`<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${cities}</h1>
    <p class="trip-info__dates">${dates}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>
</section>`);
}
export default class TripInfoView extends AbstractView {
  #tripCities = null;
  #tripDates = null;
  #generalPrice = null;

  constructor({cities, dates, price}) {
    super();
    this.#tripCities = cities;
    this.#tripDates = dates;
    this.#generalPrice = price;
  }

  get template() {
    return createTripInfoTemplate({
      cities: this.#tripCities,
      dates: this.#tripDates,
      price: this.#generalPrice
    });
  }
}
