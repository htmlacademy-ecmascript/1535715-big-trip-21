import dayjs from 'dayjs';
import { FilterType } from './const';

function isPointFuture(point) {
  return dayjs().isBefore(point.dates.start);
}

function isPointPresent(point) {
  return dayjs().isAfter(point.dates.start) && dayjs().isBefore(point.dates.end);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dates.end);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};

export {filter};
