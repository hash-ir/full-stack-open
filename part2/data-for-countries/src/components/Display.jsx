import Country from "./Country"

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
  } else {  // infoType is 'one'
    return (
      <Country info={info} />
    )
  }
}

export default Display