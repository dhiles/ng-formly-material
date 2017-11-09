import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FieldType } from '../templates/field.type';

@Component({
  selector: 'formly-group',
  template: `
    <formly-form [ngStyle]="layoutStyles" [fields]="field.fieldGroup" [model]="model" [form]="formlyGroup" [options]="newOptions" [ngClass]="field.fieldGroupClassName" [buildForm]="false"></formly-form>
  `,
})
export class FormlyGroup extends FieldType implements OnInit {
  layoutStyles: any = {
    'flex-direction': 'row', 
    'box-sizing': 'border-box', 
    'display': 'flex' 
  };

  ngOnInit() {
    if (this.field.elementAttributes) { 
      if (this.field.elementAttributes.layout) {
        this.layoutStyles['flex-direction'] = this.field.elementAttributes.layout;
      }
      if (this.field.elementAttributes.flexStyles) {
        this.layoutStyles = {...this.layoutStyles,...this.field.elementAttributes.flexStyles}
      }
    }
  }

  get newOptions() {
    return { ...this.options };
  }

  get formlyGroup(): AbstractControl {
    if (this.field.formControl) {
      return this.field.formControl;
    } else {
      return this.form;
    }
  }
}
