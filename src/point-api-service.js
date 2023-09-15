import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class PointApiServie extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.cost,
      'date_from': point.dates.start,
      'date_to': point.dates.end,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.cost;
    delete adaptedPoint.dates;
    delete adaptedPoint.isFavorite;

    console.log(adaptedPoint)

    return adaptedPoint;
  }
}
