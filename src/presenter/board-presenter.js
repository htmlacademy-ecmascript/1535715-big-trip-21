import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType, FilterType, SortType } from '../const.js';
import { filter } from '../filter.js';
import { sort } from '../sort.js';

const FAILED_TYPE = 'isFailed';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter{
  #sortComponent = null;
  #eventListNoPoints = null;
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #newPointPresenter = null;
  #newPointButtonComponent = null;
  #eventListContainer = new EventListView();
  #loadingComponent = new LoadingView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isNewPoint = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, pointsModel, destinationsModel, offersModel, filterModel, newPointButtonComponent, onNewPointDestroy}){
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButtonComponent = newPointButtonComponent;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListContainer.element,
      offers: this.#offersModel,
      destinations: this.#destinationsModel,
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
    const sortedPoints = sort[this.#currentSortType](filteredPoints);

    return sortedPoints;
  }

  init() {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.#pointsModel.isLoadingFailed || this.#destinationsModel.isLoadingFailed || this.#offersModel.isLoadingFailed) {
      this.#renderNoPoints(FAILED_TYPE);
      this.#newPointButtonComponent.element.disabled = true;
      return;
    }

    if(!this.points.length && !this.#isNewPoint) {
      remove(this.#sortComponent);
      this.#renderNoPoints(this.#filterType);
      return;
    }

    if(this.#currentSortType === SortType.DAY && !this.#sortComponent && this.points.length) {
      this.#renderSort();
    }
    render(this.#eventListContainer, this.#container);

    this.#renderPoints();
  }

  createPoint() {
    this.#isNewPoint = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    this.#isNewPoint = false;
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetPointView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.REMOVE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.removePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange});

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderNoPoints(messageType) {
    this.#eventListNoPoints = new EmptyListView({
      messageType
    });
    render(this.#eventListNoPoints, this.#container);
  }
}
