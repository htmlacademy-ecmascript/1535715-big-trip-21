import { generateRandomInteger, getRandomArrayElement } from '../util.js';

const DESTINATION_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. '];

function getRandomDescriptionSentences() {
  let description = '';
  const sentecesCount = generateRandomInteger(1, 5);
  for (let i = 0; i < sentecesCount; i++) {
    description += getRandomArrayElement(DESTINATION_DESCRIPTIONS);
  }

  return description;
}

function getRandomDescriptionPhotos() {
  const photosArray = [];
  const photosCount = generateRandomInteger(1, 4);
  for (let i = 0; i < photosCount; i++) {
    photosArray.push(`https://loremflickr.com/248/152?random=${generateRandomInteger(0, 100)}`);
  }

  return photosArray;
}

function getBoolean() {
  return Boolean(generateRandomInteger(0, 1));
}

function generateRandomDate() {
  const startYear = 2020;
  const endYear = 2025;

  const year = generateRandomInteger(startYear, endYear);

  const firstMonth = generateRandomInteger(1, 12);
  const secondMonth = generateRandomInteger(firstMonth, 12);

  const firstDay = generateRandomInteger(1, 31);
  const secondDay = generateRandomInteger(firstDay, 31);

  const firstHour = generateRandomInteger(0, 23);
  const secondHour = generateRandomInteger(firstHour, 23);

  const firstMinutes = generateRandomInteger(0, 59);
  const secondMinutes = generateRandomInteger(firstMinutes, 59);

  return [
    `${year}-${firstMonth}-${firstDay} ${firstHour}:${firstMinutes}`,
    `${year}-${secondMonth}-${secondDay} ${secondHour}:${secondMinutes}`
  ];
}

const PointTypes = {
  TAXI: 'Taxi',
  BUS: 'Bus',
  TRAIN: 'Train',
  SHIP: 'Ship',
  DRIVE: 'Drive'
  // FLIGHT: {
  //   name: 'Flight',
  //   icon: './img/icons/flight.png'
  // },
  // CHECK_IN: {
  //   name: 'Check-in',
  //   icon: './img/icons/check-in.png'
  // },
  // SIGHTSEEING: {
  //   name: 'Sightseeing',
  //   icon: './img/icons/sightseeing.png'
  // },
  // RESTARAUNT: {
  //   name: 'Restaraunt',
  //   icon: './img/icons/restaraunt.png'
  // }
};

const typeOffers = {
  [PointTypes.TAXI]: [
    {
      name: 'Transfer',
      cost: 70,
      checked: getBoolean()
    },
    {
      name: 'Meet in Airport',
      cost: 100,
      checked: getBoolean()
    }
  ],

  [PointTypes.BUS]: [
    {
      name: 'Switch to comfort',
      cost: 80,
      checked: getBoolean()
    }
  ],

  [PointTypes.TRAIN]: [
    {
      name: 'Switch to coupe',
      cost: 50,
      checked: getBoolean()
    }
  ],

  [PointTypes.SHIP]: [
    {
      name: 'Restaurant Entrance',
      cost: 200,
      checked: getBoolean()
    },
    {
      name: 'Massage Treatments',
      cost: 250,
      checked: getBoolean()
    }
  ],

  [PointTypes.DRIVE]: [
    {
      name: 'Extra Luggage',
      cost: 100,
      checked: getBoolean()
    },
    {
      name: 'Choose radio station',
      cost: 10,
      checked: getBoolean()
    }
  ],
};

const destinations = [
  {
    name: 'Krasnodar',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Moscow',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Novosibirsk',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  },
  {
    name: 'Kazan',
    description: getRandomDescriptionSentences(),
    photos: getRandomDescriptionPhotos(),
  }
];

function generateRandomWayPoint() {
  const randomPointType = getRandomArrayElement(Object.values(PointTypes));
  const [firstDate, secondDate] = generateRandomDate();

  return ({
    id: crypto.randomUUID(),
    type: randomPointType,
    destination: getRandomArrayElement(destinations),
    dates: {
      start: firstDate,
      end: secondDate
    },
    offers: typeOffers[randomPointType],
    cost: generateRandomInteger(500, 7000),
    isFavorite: getBoolean()
  });
}

export { generateRandomWayPoint, PointTypes, typeOffers, destinations };
