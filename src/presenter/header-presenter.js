import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';

export default class HeaderPresenter{
  tripInfoComponent = new TripInfoView();
  filterComponent = new FilterView();

  constructor(infoContainer, filterContainer){
    this.infoContainer = infoContainer;
    this.filterContainer = filterContainer;
  }

  init(){
    render(this.tripInfoComponent, this.infoContainer, RenderPosition.AFTERBEGIN);
    render(this.filterComponent, this.filterContainer);
  }
}
