const Person = ({ name, number, removePerson }) => {
    return (
        <div>
            {name} {number}
            <button onClick={removePerson}>delete</button>
        </div>
    )
}

export default Person;