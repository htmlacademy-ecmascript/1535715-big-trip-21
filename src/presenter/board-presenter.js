import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { render, replace } from '../framework/render.js';

const EmptyListTexts = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

export default class BoardPresenter{
  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #container = null;
  #pointsModel = null;
  #boardPoints = [];

  constructor(container, pointsModel){
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  #renderPoint(point){
    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView(
      point,
      () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    );

    const pointEditComponent = new PointEditView(
      point,
      () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    );

    function replacePointToEditForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListComponent.element);
  }

  init(){
    this.#boardPoints = [...this.#pointsModel.points];

    if(!this.#boardPoints.length) {
      render(new EmptyListView(EmptyListTexts.PAST), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    for(let i = 0; i < this.#boardPoints.length; i++){
      this.#renderPoint(this.#boardPoints[i]);
    }
  }
}
