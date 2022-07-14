import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const axios = require("axios").default;

function validateGeocodeData(geocodeData) {
  let valid = true;

  if (!geocodeData) {
    valid = valid && false;
  }

  if (geocodeData && geocodeData.data.data.length === 0) {
    valid = valid && false;
  }

  return valid;
}

export async function getServerSideProps(context) {
  let locationValid = true;
  let success = true;

  let location = "";
  let latitude = "";
  let longitude = "";
  let sunrise = "";
  let sunset = "";
  let temp = "";
  let feelsLike = "";
  let pressure = "";
  let humidity = "";
  let weatherID = "";
  let weatherMain = "";
  let weatherDescription = "";
  let weatherIcon = "";

  if (context.query.location) {
    console.log("Getting geocode data...");
    await axios
      .get(
        `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${context.query.location}&limit=1`
      )
      .then(
        (response) => {
          console.log("✅ Geocode data received.");

          const geocodeData = response;

          console.log("Validating geocode data...");

          if (validateGeocodeData(geocodeData)) {
            console.log("✅ Geocode data is valid.");
            logGeocodeData(geocodeData);

            location = geocodeData.data.data[0].label;
            console.log("Getting weather data...");

            return axios.get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${geocodeData.data.data[0].latitude}&lon=${geocodeData.data.data[0].longitude}&exclude=hourly,daily&appid=${process.env.OPEN_WEATHER_API_KEY}`
            );
          } else {
            console.log("❌ Geocode data is invalid.");
            success = false;
            locationValid = false;
          }
        },
        (error) => {
          console.log(
            "❌ Geocode error:",
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
            console.log("✅ Weather data received.");
            logWeatherData(response.data);
            latitude = response.data.lat;
            longitude = response.data.lon;
            sunrise = response.data.current.sunrise;
            sunset = response.data.current.sunset;
            temp = response.data.current.temp;
            feelsLike = response.data.current.feels_like;
            pressure = response.data.current.pressure;
            humidity = response.data.current.humidity;
            weatherID = response.data.current.weather[0].id;
            weatherMain = response.data.current.weather[0].main;
            weatherDescription = response.data.current.weather[0].description;
            weatherIcon = response.data.current.weather[0].icon;
          }
        },
        (error) => {
          console.log("❌ Open weather error.");
          success = false;
        }
      );
  }

  function logGeocodeData(geocodeData) {
    console.log("----- Geocode Data -----");
    console.log("Status:", geocodeData.status);
    console.log("Status Text:", geocodeData.statusText);
    console.log("Data:", geocodeData.data);
  }

  function logWeatherData(weatherData) {
    console.log("----- Weather Data -----");
    console.log("Lat:", weatherData.lat);
    console.log("Lon:", weatherData.lon);
    console.log("Sunrise:", weatherData.current.sunrise);
    console.log("Sunset:", weatherData.current.sunset);
    console.log("Temp:", weatherData.current.temp);
    console.log("Feels like:", weatherData.current.feels_like);
    console.log("Pressure:", weatherData.current.pressure);
    console.log("Pressure:", weatherData.current.humidity);
    console.log("Weather:", weatherData.current.weather);
  }

  const data = {
    success: success,
    locationValid: locationValid,
    location: location,
    latitude: latitude,
    longitude: longitude,
    sunrise: sunrise,
    sunset: sunset,
    temp: temp,
    feelsLike: feelsLike,
    pressure: pressure,
    humidity: humidity,
    weatherID: weatherID,
    weatherMain: weatherMain,
    weatherDescription: weatherDescription,
    weatherIcon: weatherIcon,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default function Home({ data }) {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    router.push(`?location=${location}`);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const longitude = data.longitude;
  const latitude = data.latitude;
  const locationInvalidMessage = "Location not found. Please try again.";

  console.log(data);

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
        <h1>Welcome to Helios Weather!</h1>
        <button onClick={handleClick}>Update route</button>
        <input type="text" onChange={handleLocationChange}></input>
        <p>
          Location Valid: {data.locationValid ? "True" : locationInvalidMessage}
        </p>
        <p>Location: {data.location}</p>
        <p>Lat: {latitude}</p>
        <p>Long: {longitude}</p>
        <p>Sunrise: {data.sunrise}</p>
        <p>Sunset: {data.sunset}</p>
        <p>Temperature: {data.temp}</p>
        <p>Feels Like: {data.feelsLike}</p>
        <p>Pressue: {data.pressure}</p>
        <p>Humidity: {data.humidity}</p>
        <p>Weather ID: {data.weatherID}</p>
        <p>Weather Main: {data.weatherMain}</p>
        <p>Weather Description: {data.weatherDescription}</p>
        <p>Weather Icon: {data.weatherIcon}</p>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
