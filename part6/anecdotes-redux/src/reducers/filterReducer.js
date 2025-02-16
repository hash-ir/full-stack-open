const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET FILTER':
            return action.payload
        default:
            return state
    }
}

export const filterChange = (filter) => {
    return {
        type: 'SET FILTER',
        payload: filter
    }
}

export default filterReducer