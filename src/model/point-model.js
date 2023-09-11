import { generateRandomWayPoint } from '../mock/point-mock.js';
import { generateRandomInteger } from '../util.js';
import Observable from '../framework/observable.js';

const POINTS_COUNT = generateRandomInteger(4, 8);
export default class PointsModel extends Observable{
  #points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    this.#points = this.#points.map((point) => point.id === update.id ? update : point);

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [...this.#points, update];

    this._notify(updateType, update);
  }

  removePoint(updateType, update) {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType, update);
  }
}
