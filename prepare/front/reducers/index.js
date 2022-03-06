const initialState = {
    user: {
        isLoggedIn: false,
        user: null,
        signUpData: {},
        loginData: {}
    },
    post: {
        mainPosts: [],
    }
}

export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data,
    }
}

export const logoutAction = (data) => {
    return {
        type: 'LOG_OUT',
        data,
    }
}

//(이전상태, 액션) => 다음상태
const rootReducer = ((state = initialState, action) => {
    switch (action.type) {
        case 'HYDRATE':
            console.log('HYDRATE', action);
            return {...state, ...action.payload};
        case 'LOG_IN':
            return {
                ...state,
                user: {
                    ...state.user,
                    isLoggedIn: true,
                    user: action.data,
                }
            }
        case 'LOG_OUT':
            return {
                user: {
                    ...state.user,
                    isLoggedIn: false,
                    user: null,
                }
            };
        default:
            return state;
    }

});

export default rootReducer;