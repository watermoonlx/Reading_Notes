///<reference path="../source/interfaces.d.ts" />

import { MathDemo } from "../source/math_demo";
import { CalculatorWidget } from "../source/calculator_widget";

// Here we will write some tests for the demos in the source
// directory using a BDD style. BDD style assertions are
// provided by expect() and should() which use a chainable
// language to construct assertions. The should()
// function has some issues when used in Internet Explorer,
// so it will not be used in this demo.

var expect = chai.expect; // http://chaijs.com/guide/styles/#expect

// describe() is used to declare a test suite
describe('BDD test example for MathDemo class \n', () => {

  // before() is invoked once before ALL tests
  before(function(){
    console.log("before() invoked!");
  });

  // after() invoked once after ALL tests
  after(function(){
    console.log("after() invoked!");
  });

  // beforeEach() is invoked once before EACH test
  beforeEach(function(){
    console.log("beforeEach() invoked!");
  });

  // afterEach() is invoked once before EACH test
  afterEach(function(){
    console.log("afterEach() invoked!");
  });

  // it() is a single test containing one or more assertions
  it('should return the correct numeric value for PI \n', () => {
    var math : MathInterface = new MathDemo();
    expect(math.PI).to.equals(3.14159265359);
    expect(math.PI).to.be.a('number');
  });

  it('should return the correct numeric value for pow \n', () => {
    var math : MathInterface = new MathDemo();
    var result = math.pow(2, 3);
    var expected = 8;
    expect(result).to.be.a('number');
    expect(result).to.equal(expected);
  });

  // to test async code we need to invoke done() when the execution is completed
  it('should return the correct numeric value for pow (async) \n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsync(2, 3, function(result) {
      var expected = 8;
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });

  /*
  // When testing async code mocha will let us know if a function takes too long
  // to finish its execution. There are 3 levels of warning
  // 1. >   40ms low warning
  // 2. >  100ms warning
  // 3. > 2000ms fatal error (execution of test will not continue)

  // this function takes over 2000ms to complete and
  // will thereofore stop the test execution

  it('too slow will cause build to fail\n', (done) => {
    var math : MathInterface = new MathDemo();
    math.powAsyncTooSlow(2, 3, function(result){
      var expected = 8;
      expect(result).to.be.a('number');
      expect(result).to.equal(expected);
      done(); // invoke done() inside your call back or fulfilled promises
    });
  });
  */

  // how to test for errors
  it('should throw an exception when no parameters passed \n', () => {
    var math : MathInterface = new MathDemo();
    expect(math.bad).to.throw(Error);
  });

});


describe('BDD test example for CalculatorWidget class \n', () => {

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
    expect(onSubmitSpy.called).to.equal(true);
    expect(onSubmitSpy.callCount).to.equal(1);
    expect($("#result").val()).to.equal('8');
  });

  // showcases how to use stub to isolate a component being
  // tested (CalculatorWidget) from its dependencies (MathDemo)
  // also showcases how to test async code
  it('onSubmit should set #result value when #submit.click is triggered \n', (done) => {
    var math : MathInterface = new MathDemo();

    // replace pow method with stub
    sinon.stub(math, "pow", function(a, b) {
      // assert that CalculatorWidget.onSubmit is invoking
      // math.pow with the rigth arguments
      expect(a).to.equal(2);
      expect(b).to.equal(3);

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
