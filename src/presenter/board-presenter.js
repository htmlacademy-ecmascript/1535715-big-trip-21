import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import dayjs from 'dayjs';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../util.js';
// import { updateItem } from '../util.js';

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};
export default class BoardPresenter{
  #sortComponent = null;
  #eventListNoPoints = null;
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #newPointPresenter = null;
  #eventListContainer = new EventListView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({container, pointsModel, filterModel, onNewPointDestroy}){
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch(this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.dates.start)));
      case SortType.TIME:
        return filteredPoints.sort(((a, b) => dayjs(b.dates.end).diff(dayjs(b.dates.start)) - dayjs(a.dates.end).diff(dayjs(a.dates.start))));
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.cost - a.cost);
    }

    return filteredPoints;
  }

  init() {
    // this.#boardPoints = [...this.#pointsModel.points.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.start)))];

    if(!this.points.length) {
      remove(this.#sortComponent);
      this.#renderNoPoints();
      return;
    }

    if(this.#currentSortType === SortType.DAY && !this.#sortComponent) {
      this.#renderSort();
    }
    render(this.#eventListContainer, this.#container);

    this.#renderPoints();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetPointView());
  };

  #handlePointChange = (updatedPoint) => {
    // this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    // this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.REMOVE_POINT:
        this.#pointsModel.removePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#handlePointChange(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.init();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList(true);
        this.init();
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleModelEvent(UpdateType.MINOR, this.#pointsModel.points);
  };

  // #sortPoints(sortType) {
  //   switch(sortType) {
  //     case SortType.DAY:
  //       this.#boardPoints.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.start)));
  //       break;
  //     case SortType.TIME:
  //       this.#boardPoints.sort(((a, b) => dayjs(b.dates.end).diff(dayjs(b.dates.start)) - dayjs(a.dates.end).diff(dayjs(a.dates.start))));
  //       break;
  //     case SortType.PRICE:
  //       this.#boardPoints.sort((a, b) => b.cost - a.cost);
  //   }
  // }

  #clearPointsList(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#eventListNoPoints);

    if(resetSortType) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({onSortChange: this.#handleSortChange});
    render(this.#sortComponent, this.#container);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange});

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    // for(let i = 0; i < this.#boardPoints.length; i++){
    //   this.#renderPoint(this.#boardPoints[i]);
    // }
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#eventListNoPoints = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#eventListNoPoints, this.#container);
  }
}
