import { generateRandomWayPoint } from '../mock/point-mock.js';
import { generateRandomInteger } from '../util.js';

const POINTS_COUNT = generateRandomInteger(0, 5);
export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  get points() {
    return this.#points;
  }
}
