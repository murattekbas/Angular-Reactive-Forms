import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder,Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import { Customer } from './customer';

//Customer validator
/* function ratinRange(c:AbstractControl): {[key:string]:boolean}|null {
  if (c.value!==null&&(isNaN(c.value)|| c.value<1 || c.value>5)){
    return {'range':true};
  }
  return null;

} */

//Custom validator with parameters - return ValidatorFn 
function ratingRange(min:number,max:number):ValidatorFn{
  return (c:AbstractControl):{[key:string]:boolean}|null=>{
    if (c.value!==null&&(isNaN(c.value)|| c.value<min || c.value>max)){
      return {'range':true};
    }
    return null;
  }
}

//Cross-field custom validator
function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl= c.get('email');
  const confirmControl= c.get('confirmEmail');
  let emailMessage:string;

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  emailMessage!: string;

  private validationMessages:{[key:string]:string}={
    required:'Please enter your email address.',
    email:'Please enter a valid email address.'
  }

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    //Form Model
    //Array syntax is the one we use to set validation rules for the FormControl
    this.customerForm=this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      // lastName:{value:'n/a',disabled:true},
      lastName:['',[Validators.required,Validators.maxLength(50)]],
      emailGroup:this.fb.group({
        email:['',[Validators.required,Validators.email]],
        confirmEmail:['',[Validators.required]]
      },{validator:emailMatcher}),
      phone:'',
      notification:'email',
      rating:[null,ratingRange(1,5)],
      sendCatalog:true,
    });

    this.customerForm.get('notification')?.valueChanges.subscribe(value=>this.setNotification(value));

    const emailControl=this.customerForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(debounceTime(1000)).subscribe(
      value=>this.setMessage(emailControl));


/* 
    this.customerForm=new FormGroup({
      firstName:new FormControl(),
      lastName:new FormControl(),
      email:new FormControl(),
      sendCatalog:new FormControl(true),

    }); */
  }

  save(){
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(){
    //use patchValue for setting partial members
    this.customerForm.setValue({
      firstName:'Jack',
      lastName:'Harkness',
      email:'jack@torchwood.com',
      rating:null,
      sendCatalog:false
    });

    
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }


  //Adjusting validation rule at runtime
  setNotification(notifyVia:string):void{
    const phoneControl=this.customerForm.get('phone');
    if (notifyVia==='text'){
      phoneControl?.setValidators(Validators.required);
    }else{
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
      
  }

}

