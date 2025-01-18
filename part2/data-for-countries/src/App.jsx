import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import Country from './components/Country'

const Display = ({ info, infoType, handleShowClick }) => {
  if (info === null) {
    return null
  }

  if (infoType === 'tooMany') {
    return <div>{info}</div>
  } else if (infoType === 'many') {
    return (
      <div>
        {info.map(countryInfo => 
          <div key={countryInfo.name.common}>
            {countryInfo.name.common}
            <button onClick={() => handleShowClick(countryInfo)}>show</button>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <Country info={info} />
    )
  }
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [search, newSearch] = useState('')
  const [info, setInfo] = useState(null)
  const [infoType, setInfoType] = useState(null)

  useEffect(() => {
    countryService
    .getAllCountries()
    .then(allCountries => {
      console.log('promise fulfilled')
      setAllCountries(allCountries)
    })
  }, [])

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
    newSearch(event.target.value)
  }

  const handleShowClick = (countryInfo) => {
    setWeatherInfo(countryInfo)
  }

  const setWeatherInfo = (countryInfo) => {
    const capitalCity = countryInfo.capital

    // weather of capital city
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
  }

  return (
    <div>
      find countries 
      <input 
        value={search}
        onChange={handleCountrySearch}
      />
      <Display 
        info={info} 
        infoType={infoType} 
        handleShowClick={handleShowClick}
      />
    </div>
  )
}

export default App