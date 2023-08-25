import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { updateItem } from '../util.js';

const EmptyListTexts = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};
export default class BoardPresenter{
  #sortComponent = new SortView();
  #eventListContainer = new EventListView();
  #eventListNoPoints = new EmptyListView(EmptyListTexts.EVERYTHING);
  #container = null;
  #pointsModel = null;
  #boardPoints = [];
  #pointPresenters = new Map();

  constructor(container, pointsModel){
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init(){
    this.#boardPoints = [...this.#pointsModel.points];

    if(!this.#boardPoints.length) {
      return this.#renderNoPoints();
    }

    render(this.#sortComponent, this.#container);
    render(this.#eventListContainer, this.#container);

    for(let i = 0; i < this.#boardPoints.length; i++){
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetPointView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point){
    const pointPresenter = new PointPresenter(
      this.#eventListContainer.element,
      this.#handlePointChange,
      this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNoPoints(){
    render(this.#eventListNoPoints, this.#container);
  }
}
