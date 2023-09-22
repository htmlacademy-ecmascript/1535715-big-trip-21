import TripInfoView from '../view/trip-info-view.js';
import dayjs from 'dayjs';
import { RenderPosition, remove, render, replace } from '../framework/render.js';
import { sort } from '../sort.js';
import { SortType } from '../const.js';
// import { getMaxDate } from '../utils/dates';

const DESTINATIONS_LENGTH = 3;

export default class TripInfoPresenter {
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #sortedPoints = null;

  constructor({tripInfoContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#sortedPoints = sort[SortType.DAY](pointsModel.points);

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if(!this.#pointsModel.points) {
      remove(this.#tripInfoComponent);
      return;
    }

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      cities: this.#getTripCities(),
      dates: this.#getTripDates(),
      price: this.#getGeneralPrice(),
    });

    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #getTripCities() {
    const sortedPoints = sort[SortType.DAY](this.#pointsModel.points);

    const destinationNames = sortedPoints.map((point) => this.#destinationsModel.getDestinationById(point.destination).name);

    return destinationNames.length <= DESTINATIONS_LENGTH
      ? destinationNames.join(' — ')
      : `${destinationNames[0]} — ... — ${destinationNames.at(-1)}`;
  }

  #getTripDates() {
    const sortedPoints = sort[SortType.DAY](this.#pointsModel.points);

    return sortedPoints.length > 0
      ? `${dayjs(sortedPoints[0].dates.start).format('MMM DD')} — ${dayjs(sortedPoints.at(-1).dates.end).format('MMM DD')}`
      : '';
  }

  #getGeneralPrice() {
    const points = this.#pointsModel.points;
    const offers = this.#offersModel.offers;
    const generalPointsPrice = points.reduce((sum, point) => sum + point.cost, 0);
    const allPointsOfferIds = points.reduce((accumulator, point) => [...accumulator, ...point.offers], []);
    const allOffers = offers.reduce((accumulator, offer) => [...accumulator, ...offer.offers], []);
    const allOffersPrice = allPointsOfferIds.reduce((sum, pointOfferId) => sum + allOffers.find((offer) => offer.id === pointOfferId)?.price, 0);

    return generalPointsPrice + allOffersPrice;
  }
}
