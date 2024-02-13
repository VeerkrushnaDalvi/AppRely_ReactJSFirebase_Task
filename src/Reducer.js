const initialState = {
    todos: [
        { id: 0, todoName: 'Task 1',todoDesc:'Todo desc 1',completed: true },
        { id: 1, todoName: 'Task 2',todoDesc:'Todo desc 2',completed: false },
        { id: 2, todoName: 'Task 3',todoDesc:'Todo desc 3',completed: false }
    ],
    filters: {
        status: 'All',
    }
}

// Use the initialState as a default value
export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        // Do something here based on the different types of actions
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state
    }
}