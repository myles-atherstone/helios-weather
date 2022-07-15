import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Sidebar from '../components/containers/sidebar/sidebar';
import DataBox from '../components/widgets/data-box/data-box';
import DateDisplay from '../components/widgets/date-display/date-display';
import Location from '../components/widgets/location/location';
import PrimaryWeather from '../components/widgets/primary-weather/primary-weather';
import Rain from '../components/widgets/rain/rain';
import Sun from '../components/widgets/sun/sun';
import TemperatureChart from '../components/widgets/temperature-chart/temperature-chart';
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
  const defaultLocation = 'Rhodes';
  let currentWeather;
  let forecasts = [];

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
      this.main.humidity = weatherData.main.humidity;
      this.visibility = weatherData.visibility;
      this.wind.speed = weatherData.wind.speed;
      this.wind.degree = weatherData.wind.degree;
      this.cloudiness = weatherData.clouds.all;
      this.sun.sunrise = weatherData.sys.sunrise;
      this.sun.sunset = weatherData.sys.sunset;
    }
  }

  class Forecast {
    unixTime;
    timezoneOffset;
    main = {
      temp: null,
    };
    rainChance;

    constructor(forecastData, timezoneOffset) {
      this.unixTime = forecastData.dt;
      this.timezoneOffset = timezoneOffset;
      this.main.temp = forecastData.main.temp;
      this.rainChance = forecastData.pop;
    }
  }

  context.query.location
    ? (location = context.query.location)
    : (location = defaultLocation);

  console.log('Getting geocode data...');

  await axios
    .get(
      `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${location}&limit=1`
    )
    .then(
      (response) => {
        console.log('✅ Geocode data received.');

        const geocodeData = response.data.data;
        // logGeocodeData(geocodeData);

        console.log('Validating geocode data...');

        if (validateGeocodeData(geocodeData)) {
          console.log('✅ Geocode data is valid.');

          location = new Location(geocodeData[0]);

          console.log('Getting weather data...');

          return axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
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

          // logWeatherData(weatherData);

          currentWeather = new CurrentWeather(weatherData);

          console.log('Getting forecast data...');

          return axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`
          );
        }
      },
      (error) => {
        console.log('❌ Open Weather - weather API error.');
        console.log(error);
        success = false;
      }
    )
    .then(
      (response) => {
        console.log('✅ Forecast data received.');

        const forecastData = response.data;

        // console.log('----- Forecast Data -----');
        // console.log(response.data);

        const timezoneOffset = forecastData.city.timezone;

        forecastData.list.forEach((forecast) => {
          forecasts.push(new Forecast(forecast, timezoneOffset));
        });
      },
      (error) => {
        console.log('❌ Open Weather - forecast API error.');
        console.log(error);
        success = false;
      }
    );

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
    forecasts: JSON.stringify(forecasts),
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default function Home({ data }) {
  const success = data.success;
  const locationValid = data.locationValid;
  const [temperatureScale, setTemperatureScale] = useState('C');
  const location = JSON.parse(data.location);
  const currentWeather = JSON.parse(data.currentWeather);
  const forecasts = JSON.parse(data.forecasts);
  console.log(forecasts);

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

  // console.log('Current Weather', currentWeather);
  // console.log('Location', location);

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
        <div className="primary-view">
          <div className="date-search-widget">
            <div className="date-widget">
              <h1 className="app-name">Helios Weather</h1>
              <DateDisplay
                day={dateValues[2]}
                month={dateValues[1]}
                year={dateValues[0]}
              />
            </div>
            <div className="search-widget">
              <div className="wrapper">
                <button
                  className="search-button"
                  onClick={handleClick}
                  aria-label="Search location"
                ></button>
                <input
                  className="search-box"
                  type="text"
                  onChange={handleLocationChange}
                  placeholder="Search location here"
                ></input>
              </div>
            </div>
          </div>
          <div className="data-box-container">
            <DataBox
              title="Humidity"
              data={currentWeather.main.humidity}
              unit="%"
              icon="/images/humidity.png"
            />
            <DataBox
              title="Cloudiness"
              data={currentWeather.cloudiness}
              unit="%"
              icon="/images/clouds.png"
            />
            <DataBox
              title="Pressure"
              data={currentWeather.main.pressure}
              unit=" hPa"
              icon="/images/pressure.png"
            />
            <DataBox
              title="Wind"
              data={currentWeather.wind.speed}
              unit="m/s"
              icon="/images/wind.png"
            />
          </div>
          <div className="temperature-chart-widget">
            <span className="title">Weekly Temperature</span>
            <TemperatureChart
              forecasts={forecasts}
              temperatureScale={temperatureScale}
            />
          </div>
        </div>

        <Sidebar>
          <div className="sidebar-top">
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
              temperatureScale={temperatureScale}
              setTemperatureScale={setTemperatureScale}
            />
          </div>
          <div className="sidebar-bottom">
            <Rain forecasts={forecasts} displayNumber={4} />
            <Sun
              sunriseTime={currentWeather.sun.sunrise}
              sunsetTime={currentWeather.sun.sunset}
              currentDate={currentDate}
              timezoneOffset={currentWeather.timezoneOffset}
            />
          </div>
        </Sidebar>

        {/* <p>
          Location Valid: {data.locationValid ? "True" : locationInvalidMessage}
        </p>
        */}
      </main>

      {/* <footer>
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
      </footer> */}
    </div>
  );
}
