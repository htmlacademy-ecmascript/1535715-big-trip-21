import dayjs from 'dayjs';
import { SortType } from './const';

const sort = {
  [SortType.DAY]: (points) => [...points.sort((a, b) => dayjs(b.dates.start).diff(dayjs(a.dates.start)))],
  [SortType.TIME]: (points) => [...points.sort(((a, b) => dayjs(b.dates.end).diff(dayjs(b.dates.start)) - dayjs(a.dates.end).diff(dayjs(a.dates.start))))],
  [SortType.PRICE]: (points) => [...points.sort((a, b) => b.cost - a.cost)]
};

export {sort};
