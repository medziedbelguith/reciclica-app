import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { findAdressNumber, findCity, findNeighborhood, findState, findStreet, findzipCode } from "src/app/utils/adress-utils";


export class RegisterPageForm{
    private formBuilder:FormBuilder;
    private form:FormGroup;
    constructor(formBuilder:FormBuilder)
    {
        this.formBuilder=formBuilder;
        this.form=this.createForm();
    }
    private createForm():FormGroup{
      let form= this.formBuilder.group({
        name: ['',[Validators.required]],
        email: ['',[Validators.required,Validators.email]],
        password: ['',[Validators.required,Validators.minLength(6)]],
        repeatPassword: ['',[Validators.required]],
        phone: ['',[Validators.required]],
        address:this.formBuilder.group({
            street: ['',[Validators.required]],
            number: ['',[Validators.required]],
            neighborhood: ['',[Validators.required]],
            complement: ['',[Validators.required]],
            zipCode: ['',[Validators.required]],
            state: ['',[Validators.required]],
            city: ['',[Validators.required]]
        })

      });
      form.get('repeatPassword').setValidators(matchPasswordAndRepeatPassword(form));
      return form;
    }
    setAddress(place){
      const adressForm=this.form.get('adress');
      adressForm.get('street').setValue(findStreet(place.adress_components));
      adressForm.get('number').setValue(findAdressNumber(place.adress_components));
      adressForm.get('neighborhood').setValue(findNeighborhood(place.adress_components));
      adressForm.get('zipCode').setValue(findzipCode(place.adress_components));
      adressForm.get('state').setValue(findState(place.adress_components));
      adressForm.get('city').setValue(findCity(place.adress_components));
    }
    getForm():FormGroup{
       return this.form;
    }
}
function matchPasswordAndRepeatPassword(form:FormGroup):ValidatorFn{
 const password=form.get('password');
 const repeatPassword=form.get('repeatPassword');

 const validator=()=>{
     return password.value==repeatPassword.value ? null:{isntMatching:true}
 }
 return validator;
}