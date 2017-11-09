ng-formly-material

flex layout for fieldGroups


To add flex layout to a fieldGroup, 
add an elementAttributes property above the fieldGroup fields array properties.
the elementAttributes property defines the properties of the flex container the contains the fieldGroup flex items. 

layout property of elementAttributes can be either 'row' or 'column'. To add any flex container style, add that property to 'flexStyles'. (see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes for all available properties)   


Following is an example ng-formly form definition with fieldGroup elementAttributes and a example field with fxFlex properties. 

      this.myFields = [{
        fieldGroupClassName: '',
        className: '',
        elementAttributes: {
          layout: 'row',
          flexStyles: { 
            'align-content': 'flex-start',
            'align-items': 'flex-start',
            'flex-wrap': 'wrap' 
          }
        },
        fieldGroup: [
          {
            key: "name",
            type: "input",
            templateOptions: {
              type: "text",
              label: "Name",
              placeholder: "Name",
              fxFlex: 50,
              fxFlexOffset: 25
            },
            //    validation: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(2)])

            ...

for any fieldGroup field, fxFlex and fxFlexOffset flex-layout directives can be set. see https://github.com/angular/flex-layout/wiki/fxFlex-API for more details. 

  




