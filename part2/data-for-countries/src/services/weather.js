import axios from "axios";
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const iconUrl = 'https://openweathermap.org/img/wn'
const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const getWeatherByName = (name) => {
    const request = axios.get(`${baseUrl}?q=${name}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
}

const getWeatherByCoords = (lat, lon) => {
    const request = axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}`)
    return request.then(response => response.data)
}

const getWeatherIcon = (code) => {
    // instead of making a request, just return the URL
    // <img src="..." /> automatically makes a GET request to fetch the image,
    // no need to do it manually with axios
    return `${iconUrl}/${code}@2x.png`
}

export default {
    getWeatherByName,
    getWeatherByCoords,
    getWeatherIcon
}
