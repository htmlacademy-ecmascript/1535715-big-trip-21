import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable{
  #pointApiService = null;
  #points = [];

  constructor({pointApiService}) {
    super();
    this.#pointApiService = pointApiService;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = this.#points.map((point) => point.id !== updatedPoint.id ? point : updatedPoint);
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can not update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [...this.#points, newPoint];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error ('Can not add new point');
    }
  }

  async removePoint(updateType, update) {
    try {
      await this.#pointApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can not delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      cost: point['base_price'],
      dates: {
        start: point['date_from'],
        end: point['date_to']
      },
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
