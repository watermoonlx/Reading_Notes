/*
* Before you can execute the e2e test:
* $ gulp e2e-test
*
* We need to run the application:
* $ gulp serve
*
* and start karma:
* $ npm install selenium-standalone@latest -g
* $ selenium-standalone install
* $ selenium-standalone start
*/
var test = {
  'Calculator pow e2e test example' : function (client) {
    client
      .url('http://localhost:8080/')
      .waitForElementVisible('body', 1000) // loading time 1 second
      .assert.title('TypeScriptTesting')
      .waitForElementVisible('input#base', 1000) // rendered by JS
      .assert.visible('input#base')
      .assert.visible('input#exponent')
      .setValue('input#base', '2')
      .setValue('input#exponent', '3')
      .click('button#submit')
      .pause(500) // pow() should be really fast
      .assert.value('input#result', '8')
      .end();
  }
};

export = test;
