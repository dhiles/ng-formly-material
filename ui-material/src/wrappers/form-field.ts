import { Component, ViewChild, ViewContainerRef, OnInit, AfterViewInit, ElementRef, OnDestroy, NgZone, Renderer2 } from '@angular/core';
import { FieldWrapper } from '../../../core';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operator/takeUntil';

@Component({
  selector: 'formly-wrapper-mat-form-field',
  template: `
    <mat-form-field 
    [fxFlex]="to.fxFlex ? to.fxFlex : null" 
    [fxFlexOffset]="to.fxFlexOffset ? to.fxFlexOffset : null" 
    [floatPlaceholder]="to.floatPlaceholder" [style.width]="'100%'">
      <ng-container #fieldComponent></ng-container>
      <mat-placeholder *ngIf="to.placeholder">{{ to.placeholder }}</mat-placeholder>
      <mat-error [id]="null">
        <formly-validation-message [fieldForm]="formControl" [field]="field"></formly-validation-message>
      </mat-error>
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: FormlyWrapperFormField }],
})
export class FormlyWrapperFormField extends FieldWrapper implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<any> {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
  // @ViewChild('.mat-form-field-underline', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;  
  @ViewChild(MatFormField) formField: MatFormField;

  placeholder: string;
  shouldPlaceholderFloat: boolean;

  value: any;
  empty: boolean;
  //stateChanges: Observable<void> = new Subject<void>();
  stateChanges = new Subject<void>();
  
  _errorState = false;
  focused = false;
  get errorState() { return this.showError; }

  get showError() {
    const showError = this.options.showError(this);
    if (showError !== this._errorState) {
      this._errorState = showError;
      this.stateChanges.next();
    }

    return showError;
  }

  get ngControl() { return this.formControl as any; }
  get required() { return this.to.required; }
  get disabled() { return this.to.disabled; }

  private destroy$ = new Subject<void>();

  constructor(private _focusMonitor: FocusMonitor, private ngZone: NgZone, private renderer: Renderer2, private elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    this.focused = !!this.field.focus;
    this.formField._control = this;
    this.field['__formField__'] = this.formField;
  }

  ngAfterViewInit() {
    if (this.field.type === 'checkbox' || this.field.type === 'multicheckbox' || this.field.type === 'radio') {
      var underline = this.elementRef.nativeElement.querySelector('.mat-form-field-underline')
      underline.remove();
    }
  }

  focusMonitor(elements = []) {
    elements.map(element => {
      takeUntil.call(
        this._focusMonitor.monitor(element, this.renderer, false),
        this.destroy$,
      ).subscribe(focusOrigin => {
        if (this.focused !== !!focusOrigin) {
          this.ngZone.run(() => {
            this.focused = !!focusOrigin;
            this.stateChanges.next();
          });
        }
      });
    });
  }

  setDescribedByIds(ids: string[]): void { }
  onContainerClick() {}

  ngOnDestroy() {
    delete this.field['__formField__'];
    //this.stateChanges.complete();
    this.stateChanges.next();
    this.destroy$.complete();
  }
}
