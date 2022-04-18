import { createAction,props } from "@ngrx/store";
import { User } from "src/app/components/model/user/User";

export const recoverPassword =createAction("[Recover Password]",props<{email:string}>());
export const recoverPasswordSuccess =createAction("[Recover Password] success");
export const recoverPasswordFail =createAction("[Recover Password] fail",props<{error:any}>());

export const login=createAction("[login]",props<{email:string,password:string}>());
export const loginSuccess=createAction("[login] success",props<{user:User}>());
export const loginFail=createAction("[login] fail",props<{error:any}>());