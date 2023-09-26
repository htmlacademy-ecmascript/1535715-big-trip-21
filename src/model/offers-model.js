export default class OffersModel {
  #offersApiService = null;
  #offers = [];

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
    } catch(err) {
      this.#offers = [];
      this.isLoadingFailed = true;
    }
  }

  getOffersByIds(point) {
    if(!point.offers.length) {
      return [];
    }

    const typeOffers = this.getOffersByType(point.type);
    const filteredTypeOffers = typeOffers.filter((offer) => point.offers.includes(offer.id));

    return filteredTypeOffers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type)?.offers || [];
  }
}
