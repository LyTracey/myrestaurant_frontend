// Update object reducer

const ACTIONS = {
    ADD_PROPERTY: "addProperty",
    UPDATE_PROPERTY: "updateProperty",
    ADD_CONTAINER: "addContainer",
    DELETE_CONTAINER: "deleteContainer"
};


interface stateActionObj {
    type: string,
    payload?: any
};

export function stateReducer (state: any, action: stateActionObj) {
    const newState = structuredClone(state);

    switch (action.type) {
        case ACTIONS.ADD_PROPERTY:
            return {...newState, [action.payload.key]: action.payload.value};
        case ACTIONS.UPDATE_PROPERTY:
            return {...newState, [action.payload.key]: action.payload.value}
        default: {
            return "Unknown action";
        }

    }
};