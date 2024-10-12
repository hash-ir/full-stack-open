const PersonForm = (props) => {
    const newName = props.nameProps[0]
    const handleNameChange = props.nameProps[1]
    const newNumber = props.numberProps[0]
    const handleNumberChange = props.numberProps[1]

    return ( 
        <form onSubmit={props.addName}>
            <div>
            name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>
            number: <input value={newNumber} onChange={handleNumberChange}/>
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm;