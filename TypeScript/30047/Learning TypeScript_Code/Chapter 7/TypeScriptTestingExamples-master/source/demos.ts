///<reference path="./interfaces.d.ts" />

// This file contains some classes that are not related
// they are just delcared in order to have some code that we
// can test.

import { MathDemo } from "./math_demo";
import { CalculatorWidget } from "./calculator_widget";

var math = new MathDemo();

var calculator : CalculatorWidgetInterface = new CalculatorWidget(math);
(<any>window).calculator = calculator;

calculator.render('#widget');
