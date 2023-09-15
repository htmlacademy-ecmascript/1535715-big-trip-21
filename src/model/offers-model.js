export default class OffersModel {
  #offers = [];
  #offersApiService = null;

  constructor({offersApiService}) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
      console.log(this.#offers);
    } catch(err) {
      this.#offers = [];
    }
  }

  getOffersByIds(point) {
    if(!point.offers.length) {
      return ;
    }

    const typeOffers = this.#offers.find((offer) => offer.type === point.type).offers;
    const sortedTypeOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

    return sortedTypeOffers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
