import { generateRandomWayPoint } from '../mock/point-mock.js';

const POINTS_COUNT = 5;

export default class PointsModel {
  points = Array.from({length: POINTS_COUNT}, generateRandomWayPoint);

  getPoints() {
    return this.points;
  }
}
