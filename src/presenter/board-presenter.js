import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

const POINT_COUNT = 3;

export default class BoardPresenter{
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor(container){
    this.container = container;
  }

  init(){
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render(new PointEditView(), this.eventListComponent.getElement());

    for(let i = 0; i < POINT_COUNT; i++){
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
