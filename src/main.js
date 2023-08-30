import BoardPresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import PointsModel from './model/point-model.js';
import { generateFilter } from './util.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filters = generateFilter(pointsModel.points);

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  pointsModel});
const headerPresenter = new HeaderPresenter({
  infoContainer: tripInfoElement,
  filterContainer: filterElement,
  filters
});

headerPresenter.init();
boardPresenter.init();
