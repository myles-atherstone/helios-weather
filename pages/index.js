import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Sidebar from '../components/containers/sidebar/sidebar';
import Location from '../components/widgets/location/location';
import PrimaryWeather from '../components/widgets/primary-weather/primary-weather';
import Sun from '../components/widgets/sun/sun';
import formatDate from '../util/dateHelper';

const axios = require('axios').default;

function validateGeocodeData(geocodeData) {
  let valid = true;

  if (!geocodeData) {
    valid = valid && false;
  }

  if (geocodeData && geocodeData.length === 0) {
    valid = valid && false;
  }

  return valid;
}

export async function getServerSideProps(context) {
  let locationValid = true;
  let success = true;
  let location;
  let currentWeather;

  class Location {
    lat;
    lon;
    locationName;
    region;
    country;

    constructor(locationData) {
      this.lat =
        typeof locationData.latitude !== 'undefined'
          ? locationData.latitude
          : null;
      this.lon =
        typeof locationData.longitude !== 'undefined'
          ? locationData.longitude
          : null;
      this.locationName =
        typeof locationData.name !== 'undefined' ? locationData.name : null;
      this.region =
        typeof locationData.region !== 'undefined' ? locationData.region : null;
      this.country =
        typeof locationData.country !== 'undefined'
          ? locationData.country
          : null;
    }
  }

  class CurrentWeather {
    unixTime;
    timezoneOffset;
    coord = {
      lat: null,
      lon: null,
    };
    weather = {
      main: null,
      description: null,
      icon: null,
    };
    main = {
      temp: null,
      feelsLike: null,
      pressure: null,
      humidity: null,
    };
    visibility;
    wind = {
      speed: null,
      degree: null,
    };
    cloudiness;
    sun = {
      sunrise: null,
      sunset: null,
    };

    constructor(weatherData) {
      this.coord.lat = weatherData.coord.lat;
      this.coord.lon = weatherData.coord.lon;
      this.unixTime = weatherData.dt;
      this.timezoneOffset = weatherData.timezone;
      this.weather.main = weatherData.weather[0].main;
      this.weather.description = weatherData.weather[0].description;
      this.weather.icon = weatherData.weather[0].icon;
      this.main.temp = weatherData.main.temp;
      this.main.feelsLike = weatherData.main.feels_like;
      this.main.pressure = weatherData.main.pressure;
      this.main.humidity = weatherData.main.humidty;
      this.visibility = weatherData.visibility;
      this.wind.speed = weatherData.wind.speed;
      this.wind.degree = weatherData.wind.degree;
      this.cloudiness = weatherData.clouds.all;
      this.sun.sunrise = weatherData.sys.sunrise;
      this.sun.sunset = weatherData.sys.sunset;
    }
  }

  if (context.query.location) {
    console.log('Getting geocode data...');

    await axios
      .get(
        `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${context.query.location}&limit=1`
      )
      .then(
        (response) => {
          console.log('✅ Geocode data received.');

          const geocodeData = response.data.data;
          logGeocodeData(geocodeData);

          console.log('Validating geocode data...');

          if (validateGeocodeData(geocodeData)) {
            console.log('✅ Geocode data is valid.');

            location = new Location(geocodeData[0]);

            console.log('Getting weather data...');

            return axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${geocodeData[0].latitude}&lon=${geocodeData[0].longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}`
            );
          } else {
            console.log('❌ Geocode data is invalid.');
            success = false;
            locationValid = false;
          }
        },
        (error) => {
          console.log(
            '❌ Geocode error:',
            error.response.data.error.context.query.message
          );
          success = false;
          locationValid = false;
          return false;
        }
      )
      .then(
        (response) => {
          if (response) {
            console.log('✅ Weather data received.');

            const weatherData = response.data;

            logWeatherData(weatherData);

            currentWeather = new CurrentWeather(weatherData);
          }
        },
        (error) => {
          console.log('❌ Open weather error.');
          console.log(error);
          success = false;
        }
      );
  }

  function logGeocodeData(geocodeData) {
    console.log('----- Geocode Data -----');
    console.log(geocodeData);
  }

  function logWeatherData(weatherData) {
    console.log('----- Weather Data -----');
    console.log(weatherData);
  }

  const data = {
    success: success,
    locationValid: locationValid,
    location: JSON.stringify(location),
    currentWeather: JSON.stringify(currentWeather),
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default function Home({ data }) {
  const success = data.success;
  const locationValid = data.locationValid;
  const location = JSON.parse(data.location);
  const currentWeather = JSON.parse(data.currentWeather);

  const router = useRouter();
  const [locationInput, setLocationInput] = useState('');

  const currentDate = new Date(
    (currentWeather.unixTime + currentWeather.timezoneOffset) * 1000
  );
  const dateValues = formatDate(currentDate);

  const handleClick = (e) => {
    e.preventDefault();
    router.push(`?location=${locationInput}`);
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const locationInvalidMessage = 'Location not found. Please try again.';

  console.log('Current Weather', currentWeather);
  console.log('Location', location);

  return (
    <div>
      <Head>
        <title>Helios Weather</title>
        <meta
          name="description"
          content="Realtime weather data from around the globe."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>Welcome to Helios Weather!</h1>
          <button onClick={handleClick}>Update route</button>
          <input type="text" onChange={handleLocationChange}></input>
        </div>

        <Sidebar>
          <Location
            name={location.locationName}
            region={location.region}
            country={location.country}
            hours={dateValues[3]}
            minutes={dateValues[4]}
            period={dateValues[7]}
          />
          <PrimaryWeather
            temperature={currentWeather.main.temp}
            weatherMain={currentWeather.weather.main}
            weatherDescription={currentWeather.weather.description}
            icon={currentWeather.weather.icon}
          />
          <Sun
            sunriseTime={currentWeather.sun.sunrise}
            sunsetTime={currentWeather.sun.sunset}
            currentDate={currentDate}
            timezoneOffset={currentWeather.timezoneOffset}
          />
        </Sidebar>

        {/* <p>
          Location Valid: {data.locationValid ? "True" : locationInvalidMessage}
        </p>
        */}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
