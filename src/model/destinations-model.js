
export default class DestinationModel {
  #destinationApiService = null;
  #destinations = [];

  constructor({destinationApiService}) {
    this.#destinationApiService = destinationApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#destinationApiService.destinations;
      this.#destinations = destinations;
      console.log(this.#destinations)
    } catch(err) {
      this.#destinations = [];
    }
  }

  getDestinationById(pointDestinationId) {
    return this.#destinations.find((destination) => destination.id === pointDestinationId);
  }
}
