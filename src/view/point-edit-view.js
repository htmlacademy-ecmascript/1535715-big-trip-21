import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDate } from '../util.js';
import { PointTypes, typeOffers, destinations } from '../mock/point-mock.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';

const POINT_EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const POINT_BLANK = {
  id: crypto.randomUUID(),
  type: PointTypes.TAXI,
  destination: '',
  dates: '',
  offers: '',
  cost: 0,
  isFavorite: false
};

function createEventTypes(pointTypes) {
  return Object.values(pointTypes).map((pointTypeName) =>
    `<div class="event__type-item">
    <input id="event-type-${pointTypeName.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointTypeName.toLowerCase()}">
    <label class="event__type-label  event__type-label--${pointTypeName.toLowerCase()}" for="event-type-${pointTypeName.toLowerCase()}-1">${pointTypeName}</label>
    </div>`).join('');
}

function createPointImagesTemplate(photos) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `<img class="event__photo" src="${photo}">`).join('')}
      </div>
    </div>`;
}

function createEventOfferSelectorTemplate(offers) {
  let offerNumber = 0;

  return offers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${++offerNumber}" type="checkbox" name="event-offer-luggage" ${offer.checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-${offerNumber}">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.cost}</span>
    </label>
    </div>`).join('');
}

function createDatalistTemplate() {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createPointEditTemplate(point){
  const {dates, type, cost, offers, destination} = point;
  const startDate = humanizePointDate(dates.start, POINT_EDIT_DATE_FORMAT);
  const endDate = humanizePointDate(dates.end, POINT_EDIT_DATE_FORMAT);

  return(`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="./img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventTypes(PointTypes)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDatalistTemplate()}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">

    ${offers.length
      ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createEventOfferSelectorTemplate(offers)}
        </div>
        </section>`
      : ''}

    ${(destination.description && destination.photos.length)
      ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${createPointImagesTemplate(destination.photos)}
        </section>`
      : ''}
  </section>
</form></li>`);
}

export default class PointEditView extends AbstractStatefulView{
  #handleFormSubmit = null;
  #handleCloseButtonClick = null;
  #datepickerStartDate = null;
  #datepickerEndDate = null;

  constructor({point = POINT_BLANK, onFormSubmit, onCloseButtonClick}){
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseButtonClick = onCloseButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  reset(point) {
    this.updateElement(PointEditView.parseStateToPoint(point));
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeButtonClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.#setDatepicker();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseButtonClick();
  };

  #typeInputChangeHandler = (evt) => {
    evt.preventDefault();
    const typeName = evt.target.value;
    const capitalizedType = typeName.charAt(0).toUpperCase() + typeName.slice(1);

    this.updateElement({
      type: capitalizedType,
      offers: typeOffers[capitalizedType]
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedDestination = destinations.find((destination) => destination.name === evt.target.value);

    if(!selectedDestination) {
      evt.target.value = '';
      this.element.querySelector('.event__save-btn').disabled = true;
      return;
    }

    this.element.querySelector('.event__save-btn').disabled = false;

    this.updateElement({
      destination: selectedDestination
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    const priceInputValue = Number(evt.target.value);

    if(isNaN(priceInputValue) || priceInputValue < 0) {
      evt.target.value = '';
      return;
    }

    this._setState({
      cost: priceInputValue
    });
  };

  #firstDateChangeHandler = (newDate) => {

    if(!newDate.length) {
      this.#datepickerStartDate.setDate(dayjs(this._state.dates.start).toISOString());
      return;
    }

    if(dayjs(newDate).isAfter(dayjs(this._state.dates.end))) {
      this.#datepickerEndDate.setDate(dayjs(newDate).toISOString());
    }

    this.#datepickerEndDate.set({
      minDate: dayjs(newDate).toISOString()
    });

    this._setState({
      dates: {
        start: newDate,
        end: this._state.dates.end
      }
    });
  };

  #secondDateChangeHandler = (newDate) => {
    if(!newDate.length) {
      this.#datepickerEndDate.setDate(dayjs(this._state.dates.end).toISOString());
      return;
    }

    this._setState({
      dates: {
        start: this._state.dates.start,
        end: newDate
      }
    });
  };

  #setDatepicker() {

    const startDateCal = this._state.dates.start;

    this.#datepickerStartDate = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        onChange: this.#firstDateChangeHandler
      }
    );

    this.#datepickerEndDate = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minDate: new Date(startDateCal).toISOString(),
        minuteIncrement: 1,
        onChange: this.#secondDateChangeHandler
      }
    );
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
