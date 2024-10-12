const Filter = ({ search, handleNameSearch }) => (
    <div>
        filter shown with
            <input value={search} onChange={handleNameSearch}/>
    </div>
)

export default Filter;