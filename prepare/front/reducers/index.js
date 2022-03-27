import user from './user';
import post from './post';
import {combineReducers} from "redux";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    user: {},
    post: {}
}


//(이전상태, 액션) => 다음상태
// const rootReducer = (state.action)
// combineReducers({
//     index: (state = {}, action) => {
//         switch (action.type) {
//             case 'HYDRATE':
//                 console.log('HYDRATE', action);
//                 return {...state, ...action.payload};
//             default:
//                 return state;
//         }
//     },
//     user,
//     post,
// });

//이전상태, 액션 => 다음상태
const rootReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE:
            console.log('HYDRATE', action);
            return action.payload;
        default: {
            const combinedReducer = combineReducers({
                user,
                post
            });
            return combinedReducer(state, action)
        }
    }
};

export default rootReducer;
