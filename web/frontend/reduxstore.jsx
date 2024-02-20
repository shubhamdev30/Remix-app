import { configureStore } from "@reduxjs/toolkit";
import filterslice from "./filterslice";

const reduxstore = configureStore({
    reducer:{
        users: filterslice
    },
})

export default reduxstore;