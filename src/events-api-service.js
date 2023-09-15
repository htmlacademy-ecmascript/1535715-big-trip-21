import ApiService from './framework/api-service.js';

const RequestUrl = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class EventsApiService extends ApiService {
  get points() {
    return this.#getData(RequestUrl.POINTS);
  }

  get destinations() {
    return this.#getData(RequestUrl.DESTINATIONS);
  }

  get offers() {
    return this.#getData(RequestUrl.OFFERS);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addEvent(event) {
    const response = await this._load({
      url: RequestUrl.EVENTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteEvent(event) {
    const response = await this._load({
      url: `${RequestUrl.EVENTS}/${event.id}`,
      method: Method.DELETE
    });

    return response;
  }

  async #getData(url) {
    const response = await this._load({ url });

    return ApiService.parseResponse(response);
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

    return adaptedPoint;
  }
}
