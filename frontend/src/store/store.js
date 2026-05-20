import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice';
import productReducer from "./productSlice";

const store = configureStore({
    reducer: {
        auth : authSlice,
         products: productReducer,
         //TODO: add more slices here for posts
    }
});


export default store;
