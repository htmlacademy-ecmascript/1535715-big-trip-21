import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
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

    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);

    // render(new PointEditView(this.#boardPoints[0]), this.#eventListComponent.element);

    for(let i = 1; i < this.#boardPoints.length; i++){
      this.#renderPoint(this.#boardPoints[i]);
    }
  }
}
