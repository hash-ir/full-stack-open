import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import Display from './components/Display'

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [search, setSearch] = useState('')
  const [info, setInfo] = useState(null)
  const [infoType, setInfoType] = useState(null)

  // run only once to fetch data from all countries
  useEffect(() => {
    countryService
      .getAllCountries()
      .then(allCountries => {
        console.log('promise fulfilled')
        setAllCountries(allCountries)
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
      })
  }, [])

  // run whenever the 'search' or 'allCountries' data is modified
  useEffect(() => {
    if (search === '') {
      setInfo(null)
      setInfoType(null)
      return
    }

    if (allCountries.length > 0) {
      const countriesToShow = allCountries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

      if (countriesToShow.length > 10) {
        setInfo('Too many matches, specify another filter')
        setInfoType('tooMany')
      } else if (countriesToShow.length > 1 && countriesToShow.length < 10) {
        setInfo(countriesToShow)
        setInfoType('many')
      } else if (countriesToShow.length === 1) {
        const countryInfo = countriesToShow[0]
        setWeatherInfo(countryInfo)
      }
    }
  }, [search, allCountries])

  const handleCountrySearch = (event) => {
    setSearch(event.target.value)
  }

  const handleShowClick = (countryInfo) => {
    setWeatherInfo(countryInfo)
  }

  const setWeatherInfo = (countryInfo) => {
    const capitalCity = countryInfo.capital

    // weather of capital city by name
    weatherService
      .getWeatherByName(capitalCity)
      .then(response => {
        const icon = weatherService.getWeatherIcon(response.weather[0].icon)
        setInfo({
          ...countryInfo,
          temperature: response.main.temp,
          wind: response.wind.speed,
          icon: icon
        })
        // set 'infoType' to "one" to display the selected country
        // this should be inside the .then to avoid race condition
        setInfoType('one')
      })
      .catch(error => {
        console.error(`Failed to fetch weather of ${capitalCity} by name, using coordinates:`)

        const latlng = countryInfo.capitalInfo.latlng
        // weather of capital city by geocoordinates
        weatherService
          .getWeatherByCoords(latlng[0], latlng[1])
          .then(response => {
            const icon = weatherService.getWeatherIcon(response.weather[0].icon)
            setInfo({
              ...countryInfo,
              temperature: response.main.temp,
              wind: response.wind.speed,
              icon: icon
            })
            // this should be inside the .then to avoid race condition
            setInfoType('one')
          })
      })
  }

  return (
    <div>
      find countries
      <input value={search} onChange={handleCountrySearch} />
      <Display info={info} infoType={infoType} handleShowClick={handleShowClick} />
    </div>
  )
}

export default App