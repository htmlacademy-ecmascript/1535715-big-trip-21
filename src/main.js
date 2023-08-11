import BoardPresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = headerElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(eventListElement);
const headerPresenter = new HeaderPresenter(tripInfoElement, filterElement);

boardPresenter.init();
headerPresenter.init();
