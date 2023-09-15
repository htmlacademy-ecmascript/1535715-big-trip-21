// import FilterView from '../view/filter-view.js';
import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class HeaderPresenter{
  #tripInfoComponent = new TripInfoView();
  #infoContainer = null;

  constructor({infoContainer}){
    this.#infoContainer = infoContainer;
  }

  init(){
    render(this.#tripInfoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  }
}
