import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FilterType } from './const';

dayjs.extend(duration);

function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function leadZero(time) {
  return time.toString().padStart(2, '0');
}

function getTimeDifference(endTime, startTime) {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const timeDifference = dayjs.duration(end.diff(start));
  const days = leadZero(timeDifference.days());
  const hours = leadZero(timeDifference.hours());
  const minutes = leadZero(timeDifference.minutes());

  if(days > 0){
    return `${days}D ${hours}H ${minutes}M`;
  }

  if(hours > 0){
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
}

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

export {humanizePointDate, getTimeDifference, filter};
