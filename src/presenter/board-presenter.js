import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import dayjs from 'dayjs';
import { render } from '../framework/render.js';
import { updateItem } from '../util.js';

const SORT_TYPES = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};

const EmptyListTexts = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};
export default class BoardPresenter{
  #sortComponent = null;
  #eventListContainer = new EventListView();
  #eventListNoPoints = new EmptyListView({text: EmptyListTexts.EVERYTHING});
  #container = null;
  #pointsModel = null;
  #boardPoints = [];
  #pointPresenters = new Map();

  constructor({container, pointsModel}){
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init(){
    this.#boardPoints = [...this.#pointsModel.points.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.start)))];

    if(!this.#boardPoints.length) {
      return this.#renderNoPoints();
    }

    this.#renderSort();
    render(this.#eventListContainer, this.#container);

    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetPointView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };

  #sortPoints(sortType) {
    switch(sortType) {
      case SORT_TYPES.DAY:
        this.#boardPoints.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.start)));
        break;
      case SORT_TYPES.TIME:
        this.#boardPoints.sort(((a, b) => dayjs(b.dates.end).diff(dayjs(b.dates.start)) - dayjs(a.dates.end).diff(dayjs(a.dates.start))));
        break;
      case SORT_TYPES.PRICE:
        this.#boardPoints.sort((a, b) => b.cost - a.cost);
    }
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort() {
    this.#sortComponent = new SortView({onSortChange: this.#handleSortChange});
    render(this.#sortComponent, this.#container);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#eventListContainer.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange});

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    for(let i = 0; i < this.#boardPoints.length; i++){
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #renderNoPoints() {
    render(this.#eventListNoPoints, this.#container);
  }
}
