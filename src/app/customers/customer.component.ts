import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    //Form Model
    this.customerForm=this.fb.group({
      firstName:'',
      // lastName:{value:'n/a',disabled:true},
      lastName:'',
      email:'',
      sendCatalog:true,
    })


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
      sendCatalog:false
    });
  }
}
