import Person from "./Person";

const Persons = ({ persons, removePerson }) => {
    return (  
        <div>
            {persons.map(person => 
                <Person key={person.name} name={person.name} number={person.number} removePerson={() => removePerson(person.name)}/>
            )}
        </div>
    )
}

export default Persons;