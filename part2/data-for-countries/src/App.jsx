import { useState, useEffect } from 'react'
import countryService from './services/countries'
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
        console.log(countriesToShow)
        setInfo(countriesToShow[0])
        setInfoType('one')
      }
    }
  }, [search, allCountries])

  const handleCountrySearch = (event) => {
    newSearch(event.target.value)
    console.log(event.target.value)
  }

  const handleShowClick = (country) => {
    console.log(country)
    setInfo(country)
    setInfoType('one')  // set 'infoType' to "one" to display the selected country
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