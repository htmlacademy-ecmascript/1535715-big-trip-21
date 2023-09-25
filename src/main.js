import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button.js';
import EventsApiService from './events-api-service.js';

import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic 3fJDs93hjt';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const headerMainElement = headerElement.querySelector('.trip-main');
const tripInfoElement = headerElement.querySelector('.trip-controls');
const filterElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  pointApiService: eventsApiService
});

const destinationsModel = new DestinationModel({
  destinationApiService: eventsApiService
});

const offersModel = new OffersModel({
  offersApiService: eventsApiService
});

const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer: tripInfoElement,
  pointsModel,
  offersModel,
  destinationsModel
});

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  pointsModel,
  filterModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
  // boardPresenter.init();
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

boardPresenter.init();
filterPresenter.init();

offersModel.init()
  .then(() => destinationsModel.init())
  .then(() => pointsModel.init())
  .then(() => tripInfoPresenter.init())
  .finally(() => {
    render(newPointButtonComponent, headerMainElement);
  });
