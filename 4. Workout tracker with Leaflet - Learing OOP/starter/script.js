'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// popup for adding new workout configuration
const popupConfig = {
  maxWidth: 250,
  minWidth: 100,
  autoClose: false,
  closeOnClick: false,
};

// Workout is the parent class of both Cycling and Running class
// It is designed, so that the common properties and methods such as
// distance, duration, co-ordinates and more could follow DRY
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // defined in min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // defined in km/h
    this.speed = this.distance / (this.duration * 60);
    return this.speed;
  }
}

// all the document elements required
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// DESIGNING THE APP ARCHITECTURE WITH OOP
// App will be the main class of the entire project,
// it'll contain all the initiators, event listners, and app-data
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    // Adding form event listner on-enter click for saving workout
    form.addEventListener('submit', this._newWorkout.bind(this));

    // adding event listner for input type change
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    // getting user location through navigator
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Couldn't fetch your location!");
        }
      );
    }
  }

  _loadMap(position) {
    const { longitude: long, latitude: lat } = position.coords;

    // preparing map near the location
    this.#map = L.map('map').setView([lat, long], 13);

    // setting tile theme through openstreetmap (I can use google map here too)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // setting the default map marker
    L.marker([lat, long])
      .addTo(this.#map)
      .bindPopup('This is your current location!')
      .openPopup();

    // handling clicks on map to add new workout
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapEventPosition) {
    this.#mapEvent = mapEventPosition;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    //  Handling the workout type change
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    // helper functions for validating if inputs are number
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    // helper functions for positive numbers
    const allPositive = (...inputs) => inputs.every(input => input > 0);

    // handle on add new workout submit click (there is no submit button but his is cool right
    // we're handling on enter click here)
    event.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // data validation
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive number');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // data validation
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive number');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(`💎 this.#workouts: `, this.#workouts);

    // Render workout map as marker // adding marker to the map
    this.renderWorkoutMarker(workout);

    // Render workout on the list

    // Hide form + clear input fields // clearing all the input fields
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        '';
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords) // creates the marker
      .addTo(this.#map) // adds this to map
      .bindPopup(
        L.popup({
          ...popupConfig,
          className: `${workout.type}-popup`,
        })
      ) // create and binds popup to the market
      .setPopupContent(`${workout.distance}`)
      .openPopup();
  }
}

const app = new App();
