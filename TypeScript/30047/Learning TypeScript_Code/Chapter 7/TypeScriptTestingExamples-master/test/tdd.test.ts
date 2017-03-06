///<reference path="../source/interfaces.d.ts" />

import { MathDemo } from "../source/math_demo";
import { CalculatorWidget } from "../source/calculator_widget";

// Here we will write some test for the demos in the source
// directory using a TDD style.TBDD style assertions are
// provided by assert() which use a chainable language to
// construct assertions.

var assert = chai.assert; // http://chaijs.com/guide/styles/#assert

// in theory in tdd we should use suite() not describe() but it
// is missing from the mocha types definitions file
describe('Test Suite \n', () => {

  // setup() is invoked once before ALL tests
  setup(function(){
    console.log("setup() invoked!");
  });

  // teardown() invoked once after ALL tests
  teardown(function(){
    console.log("teardown() invoked!");
  });

  // suiteSetup() is invoked once before EACH test
  suiteSetup(function(){
    console.log("suiteSetup() invoked!");
  });

  // suiteTeardown() is invoked once before EACH test
  suiteTeardown(function(){
    console.log("suiteTeardown() invoked!");
  });

  // in theory in tdd we should use test() not it() but
  // it is missing from the mocha types definitions file
  it('Unit Test \n', (done) => {
    var math = new MathDemo();
    assert.typeOf(math.PI, 'number');
    assert.equal(math.PI, 3.14159265359);
    done();
  });

  it('should return the correct numeric value for pow \n', () => {
    var math : MathInterface = new MathDemo();
    var result = math.pow(2, 3);
    var expected = 8;
    assert.typeOf(result, 'number');
    assert.equal(result, expected);
  });

  // to test asyn code we need to invoke done() when the execution is completed
  it('should return the correct numeric value for pow (async) \n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsync(2, 3, function(result){
      var expected = 8;
      assert.typeOf(result, 'number');
      assert.equal(result, expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });

  // When testing async code mocha will let us know if a function takes to long
  // to finish its execution. There are 3 levels of warning
  // 1. >   40ms low warning
  // 2. >  100ms warning
  // 3. > 2000ms fatal error (execution of test will not continue)

  // Is slow and we will get a warning
  it('should return the correct numeric value for pow (async) in slow networks\n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsyncSlow(2, 3, function(result){
      var expected = 8;
      assert.typeOf(result, 'number');
      assert.equal(result, expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });

  // Is really slow and we will get a warning
  it('should return the correct numeric value for pow (async) in really slow networks\n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsyncReallySlow(2, 3, function(result){
      var expected = 8;
      assert.typeOf(result, 'number');
      assert.equal(result, expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });

  /*

  // this function takes over 2000ms to complete and
  // will thereofore stop the test execution

  it('too slow will cause build to fail\n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsyncTooSlow(2, 3, function(result){
      var expected = 8;
      assert.typeOf(result, 'number');
      assert.equal(result, expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });

  */

  // how to test for errors
  it('should throw an exception when no parameters passed \n', () => {
    var math : MathInterface = new MathDemo();
    assert.throw(math.bad);
  });


});



describe('TDD test example for CalculatorWidget class \n', () => {

  before(function() {
    $("body").append('<div id="widget"/>');
  });

  beforeEach(function() {
    $("#widget").empty();
  });

  // showcases how to spy on functions to assert that a function has been invoked
  it('should invoke onSubmit when #submit.click is triggered \n', () => {
    var math : MathInterface = new MathDemo();
    var calculator = new CalculatorWidget(math);

    calculator.render("#widget");
    // spy on onSubmit
    var onSubmitSpy = sinon.spy(calculator, "onSubmit");

    // initialize inputs and trigger click on #submit
    $('#base').val("2");
    $('#exponent').val("3");
    $("#submit").trigger("click");

    // assert calculator.onSubmit was invoked
    assert.equal(onSubmitSpy.called, true);
    assert.equal(onSubmitSpy.callCount, 1);
    assert.equal($("#result").val(), '8');
  });

  // showcases how to use stub to isolate a component being
  // tested (CalculatorWidget) from its dependencies (MathDemo)
  // also showcases how to test asyn code
  it('onSubmit should set #result value when #submit.click is triggered \n', (done) => {
    var math : MathInterface = new MathDemo();

    // replace pow method with stub
    sinon.stub(math, "pow", function(a, b) {
      // assert that CalculatorWidget.onSubmit is invoking
      // math.pow with the rigth arguments
      assert.equal(a, 2);
      assert.equal(b, 3);

      done();
    });

    // initialize inputs and trigger click on #submit
    var calculator = new CalculatorWidget(math);

    calculator.render("#widget");
    $('#base').val("2");
    $('#exponent').val("3");

    $("#submit").trigger("click");
  });

});
