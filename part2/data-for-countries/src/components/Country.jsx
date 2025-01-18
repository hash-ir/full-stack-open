const Country = ({ info }) => {
    return (
        <div>
            <h2>{info.name.common}</h2>
            <p>capital {info.capital[0]}<br />area {info.area}</p>
            <h3>languages:</h3>
            <ul>
                {Object.values(info.languages).map(lang => (
                <li key={lang.toLowerCase()}>
                    {lang}
                </li>
                ))}
            </ul>
            <img src={info.flags['svg']} alt={info.flags['alt']} width={150}/>
        </div>
    )
}

export default Country