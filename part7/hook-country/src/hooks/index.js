import { useState, useEffect } from "react"
import axios from 'axios'

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)
  
    useEffect(() => {
        // avoid unnecessary axios request if name is empty
        if (!name) return
        
        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
            .then(response => {
                setCountry({
                    found: true,
                    data: {
                        name: response.data.name.common,
                        capital: response.data.capital,
                        population: response.data.population,
                        flag: response.data.flags['svg']
                    }
                })
            })
            .catch(error => {
                setCountry({ found: false })
            })
    }, [name])
  
    return country
  }