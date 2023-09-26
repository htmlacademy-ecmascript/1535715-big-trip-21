import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDate } from '../util.js';
import { PointType } from '../const.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';

const POINT_EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const POINT_BLANK = {
  type: PointType.FLIGHT.toLowerCase(),
  destination: '',
  dates: {
    start: '',
    end: ''
  },
  offers: [],
  cost: 0,
  isFavorite: false,
};

const FLATPICKR_SAME_PROPERTIES = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
  minuteIncrement: 1,
};

function createEventTypes(pointTypes, currentType) {
  return Object.values(pointTypes).map((pointTypeName) =>
    `<div class="event__type-item">
    <input id="event-type-${pointTypeName.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointTypeName.toLowerCase()}" ${pointTypeName.toLowerCase() === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${pointTypeName.toLowerCase()}" for="event-type-${pointTypeName.toLowerCase()}-1">${pointTypeName}</label>
    </div>`).join('');
}

function createPointImagesTemplate(photos) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
      </div>
    </div>`;
}

function createEventOfferSelectorTemplate(allOffers, pointOffers, isDisabled) {
  let offerNumber = 0;

  return allOffers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${++offerNumber}" type="checkbox" name="event-offer-luggage" ${pointOffers.includes(offer.id) ? 'checked' : ''} value="${offer.id}" ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-luggage-${offerNumber}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
    </div>`).join('');
}

function createDatalistTemplate(allDestinations) {
  return allDestinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createPointEditTemplate({point, allDestinations, allOffers, isPointBlank}) {

  const { dates, type, cost, offers: pointOffers, destination: destinationId, isDisabled, isSaving, isDeleting } = point;
  const pointDestination = allDestinations.find((destination) => destination.id === destinationId);

  const startDate = humanizePointDate(dates.start, POINT_EDIT_DATE_FORMAT);
  const endDate = humanizePointDate(dates.end, POINT_EDIT_DATE_FORMAT);

  const deletingButtonText = isDeleting ? 'Deleting...' : 'Delete';

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="./img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createEventTypes(PointType, type)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination?.name ?? ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
        ${createDatalistTemplate(allDestinations)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate ?? ''}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate ?? ''}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${pointDestination?.name ? '' : 'disabled'} ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isPointBlank ? 'Cancel' : deletingButtonText}</button>
    ${isPointBlank ? '' :
      `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>`}
  </header>
  <section class="event__details">

    ${allOffers.length
      ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createEventOfferSelectorTemplate(allOffers, pointOffers, isDisabled)}
        </div>
        </section>`
      : ''}

    ${(pointDestination?.description || pointDestination?.pictures.length)
      ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${pointDestination.description ? `<p class="event__destination-description">${pointDestination.description}</p>` : ''}
        ${pointDestination.pictures.length ? createPointImagesTemplate(pointDestination.pictures) : ''}
        </section>`
      : ''}
  </section>
</form></li>`);
}

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleCloseButtonClick = null;
  #datepickerStartDate = null;
  #datepickerEndDate = null;
  #handleDeleteButtonClick = null;
  #point = null;
  #destinations = null;
  #getOffers = null;

  constructor({ point = POINT_BLANK, destinations, getOffers, onFormSubmit, onCloseButtonClick, onDeleteButtonClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#getOffers = getOffers;

    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseButtonClick = onCloseButtonClick;
    this.#handleDeleteButtonClick = onDeleteButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      allDestinations: this.#destinations,
      allOffers: this.#getOffers(this._state.type),
      isPointBlank: this.#point === POINT_BLANK
    });
  }

  reset(point) {
    this.updateElement(PointEditView.parseStateToPoint(point));
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    if(this.#point !== POINT_BLANK) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeButtonClickHandler);
    }

    if(this.#getOffers(this._state.type).length) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offersChangeHandler);
    }

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeInputChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepicker();
  }

  removeElement() {
    super.removeElement();
    this.#datepickerStartDate?.destroy();
    this.#datepickerEndDate?.destroy();
  }

  #firstDateChangeHandler = (newDate) => {
    let newEndDate = null;
    if (!newDate.length) {
      this.#datepickerStartDate.setDate(dayjs(this._state.dates.start).toISOString());
      return;
    }

    if (dayjs(newDate).isAfter(dayjs(this._state.dates.end))) {
      this.#datepickerEndDate.setDate(dayjs(newDate).toISOString());
      newEndDate = newDate;
    }

    this.#datepickerEndDate.set({
      minDate: dayjs(newDate).toISOString()
    });

    this._setState({
      dates: {
        start: dayjs(newDate[0]).toISOString(),
        end: newEndDate ?? this._state.dates.end
      }
    });
  };

  #secondDateChangeHandler = (newDate) => {
    if (!newDate.length) {
      this.#datepickerEndDate.setDate(dayjs(this._state.dates.end).toISOString());
      return;
    }

    this._setState({
      dates: {
        start: this._state.dates.start,
        end: newDate[0].toISOString()
      }
    });
  };

  #setDatepicker() {

    const startDateCal = this._state.dates.start;

    this.#datepickerStartDate = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...FLATPICKR_SAME_PROPERTIES,
        onChange: this.#firstDateChangeHandler
      }
    );

    this.#datepickerEndDate = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...FLATPICKR_SAME_PROPERTIES,
        onChange: this.#secondDateChangeHandler
      }
    );

    if(startDateCal) {
      const endDateCal = new Date(startDateCal);
      this.#datepickerEndDate.set('minDate', endDateCal);
    }

  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteButtonClick(PointEditView.parseStateToPoint(this._state));
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseButtonClick();
  };

  #offersChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const selectedOffers = this._state.offers;
    const offerId = evt.target.value;
    const offerIndex = selectedOffers.indexOf(offerId);

    if(offerIndex !== -1) {
      selectedOffers.splice(offerIndex, 1);
    } else {
      selectedOffers.push(offerId);
    }

    this._setState({
      offers: selectedOffers
    });
  };

  #typeInputChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!selectedDestination) {
      evt.target.value = '';
      this.element.querySelector('.event__save-btn').disabled = true;
      this.updateElement({
        destination: ''
      });
      return;
    }

    this.element.querySelector('.event__save-btn').disabled = false;

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    const priceInputValue = parseInt(evt.target.value, 10);

    if (isNaN(priceInputValue) || priceInputValue < 0 || !priceInputValue) {
      evt.target.value = 0;
      return;
    }

    if(evt.target.value.startsWith('0')) {
      evt.target.value = priceInputValue;
    }

    this._setState({
      cost: priceInputValue
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
