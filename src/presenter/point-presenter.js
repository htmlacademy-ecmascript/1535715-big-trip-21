import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const PointMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};
export default class PointPresenter {
  #pointContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #mode = PointMode.DEFAULT;

  constructor({pointContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#pointContainer = pointContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destinationsModel.getDestinationById(this.#point.destination).name,
      offers: this.#offersModel.getOffersByIds(this.#point),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick});

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      getOffers: (type) => this.#offersModel.getOffersByType(type),
      onFormSubmit: this.#handleFormSubmit,
      onCloseButtonClick: this.#handleCloseButtonClick,
      onDeleteButtonClick: this.#handleDeleteButtonClick});

    if(previousPointComponent === null || previousPointEditComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }

    if(this.#mode === PointMode.DEFAULT) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if(this.#mode === PointMode.EDITING) {
      replace(this.#pointComponent, previousPointComponent);
    }

    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetPointView() {
    if(this.#mode === PointMode.EDITING) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  setSaving() {
    if(this.#mode === PointMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if(this.#mode === PointMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting() {
    if(this.#mode === PointMode.DEFAULT) {
      return this.#pointComponent.shake();
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = PointMode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.DEFAULT;
    this.#handleModeChange();
  }

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape'){
      evt.preventDefault();
      this.resetPointView();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
  };

  #handleCloseButtonClick = () => {
    this.resetPointView();
  };

  #handleDeleteButtonClick = (point) => {
    this.#handleDataChange(UserAction.REMOVE_POINT, UpdateType.MINOR, point);
  };

  #handleFavoriteClick = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, this.#point);
  };
}
