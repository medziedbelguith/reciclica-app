import { loadingReducer } from "./loading.reducers";
import {hide,show} from "./loading.actions";
import { LoadingState } from "./LoadingState";
import { createAction } from "@ngrx/store";
describe('Loading store',()=>{
    it('show',()=>{
        const initialSate: LoadingState={show: false};
        const newState=loadingReducer(initialSate, show());

        expect(newState).toEqual({show:true});
    })
    it('hide',()=>{
        const initialSate: LoadingState={show: true};
        const newState=loadingReducer(initialSate, hide());

        expect(newState).toEqual({show:false});
    })

    it('should keep state if action is unknown',()=>{
        const initialSate: LoadingState={show: true};
        const action=createAction("UNKNOWN")
        const newState=loadingReducer(initialSate, action);

        expect(newState).toEqual({show:true});
    })
})