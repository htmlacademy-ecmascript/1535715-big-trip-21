import BoardPresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button.js';
import { render } from './framework/render.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const headerPresenter = new HeaderPresenter({
  infoContainer: tripInfoElement,
  filterContainer: filterElement,
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
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, tripInfoElement);

headerPresenter.init();
boardPresenter.init();
filterPresenter.init();
