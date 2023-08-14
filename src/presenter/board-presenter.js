import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';
export default class BoardPresenter{
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor(container, pointsModel){
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init(){
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    render(new PointEditView(this.boardPoints[0]), this.eventListComponent.getElement());

    for(let i = 1; i < this.boardPoints.length; i++){
      render(new PointView(this.boardPoints[i]), this.eventListComponent.getElement());
    }
  }
}
