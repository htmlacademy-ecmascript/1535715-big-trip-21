// import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class HeaderPresenter{
  #tripInfoComponent = new TripInfoView();
  #infoContainer = null;
  #filterContainer = null;
  #filters = [];

  constructor({infoContainer, filterContainer}){
    this.#infoContainer = infoContainer;
    this.#filterContainer = filterContainer;
    // this.#filters = filters;
  }

  init(){
    render(this.#tripInfoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
    // render(new FilterView({filters: this.#filters}), this.#filterContainer);
  }
}
