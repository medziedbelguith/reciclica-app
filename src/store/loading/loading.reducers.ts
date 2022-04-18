import { createReducer,on } from "@ngrx/store";
import {hide,show} from "./loading.actions";
import { LoadingState } from "./LoadingState";

const initialSate:LoadingState={
    show:false
}
const reducer = createReducer(
    initialSate,
    on(show, () => {
     return {show:true};
    }),
    on(hide, () => {
        return {show:false};
       })
       );


export function loadingReducer(state:LoadingState,action){
    return reducer(state,action);
}