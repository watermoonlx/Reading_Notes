///<reference path="./interfaces.d.ts" />
///<reference path="../typings/tsd.d.ts" />

class CalculatorWidget implements CalculatorWidgetInterface{

 private _math : MathInterface;
 private $base: JQuery;
 private $exponent: JQuery;
 private $result: JQuery;
 private $btn: JQuery;

 constructor(math : MathInterface) {
   if(math == null) throw new Error("Argument null exception!");
   this._math = math;
 }

 public render(id : string) {
   $(id).html(template);
   this.$base = $("#base");
   this.$exponent = $("#exponent");
   this.$result = $("#result");
   this.$btn = $("#submit");
   this.$btn.on("click", (e) => {
     this.onSubmit();
   });
 }

 public onSubmit() {
   var base = parseInt(this.$base.val());
   var exponent = parseInt(this.$exponent.val());

   if(isNaN(base) || isNaN(exponent)) {
     alert("Base and exponent must be a number!");
   }
   else {
     this.$result.val(this._math.pow(base, exponent));
   }
 }
}

// normally we will use a template system
var template = '<div class="well">' +
  '<div class="row">' +
    '<div class="col-md-3">' +
      '<div class="form-group">' +
        '<label>Base</label>' +
        '<input type="text" class="form-control" id="base" placeholder="0">' +
        '</div>' +
      '</div>' +
    '<div class="col-md-3">' +
      '<div class="form-group">' +
        '<label>Exponent</label>' +
          '<input type="text" class="form-control" id="exponent" placeholder="0">' +
        '</div>' +
      '</div>' +
    '<div class="col-md-3">' +
      '<div class="form-group">' +
        '<label>Result</label>' +
          '<input type="text" class="form-control" id="result" placeholder="1" disabled="disabled">' +
        '</div>' +
      '</div>' +
    '<div class="col-md-3">' +
      '<div class="form-group">' +
        '<button id="submit" type="submit" class="btn btn-primary">Submit</button>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</div>';

export { CalculatorWidget };
