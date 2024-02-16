import { createSlice } from "@reduxjs/toolkit";

const filterslice = createSlice({
    name: "tags",
    initialState:{columns:[],
    activeobj: {},
    plan:{},
    currency:""
},
    reducers:{
        addtag(state,action){
            if(action.payload.start != undefined){
            state.start = action.payload.start;
            }
            if(action.payload.end != undefined){
            state.end = action.payload.end;
            }
            if(action.payload.tags != undefined){
            state.tags=action.payload.tags
            }
            if(action.payload.querydata != undefined){
            state.querydata=action.payload.querydata
            }
            if(action.payload.columns != undefined){
                state.columns=action.payload.columns
            }
            if(action.payload.currency != undefined){
                state.currency=action.payload.currency
            }
            if(action.payload.activeobj!= undefined){
                state.activeobj = action.payload.activeobj;
            }
            if(action.payload.plan!= undefined){
                state.plan = action.payload.plan;
            }
        },
        removetag(state,action){},
        deletetag(state,action){}
    }
});

export default filterslice.reducer;
export const {addtag} = filterslice.actions;