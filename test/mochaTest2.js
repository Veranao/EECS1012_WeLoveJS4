assert = chai.assert;

// describe() is a function by which you can define a collection of tests. 
// It takes two parameters, the 1st one is a description of what is being tested, and 
// the 2nd one is a function which contains one or multiple tests each defined by one it().
describe('Testing function compare(a,b) of server', function () {
  var user1 = {
    Name: "User1",
    HighScore: 55
  };

  var user2 = {
    Name: "User2",
    HighScore: 50
  };

  var result = compare(user1,user2);
  

  // it() is a function by which you should define one single test.
  // It takes two parameters, the 1st one is a description of what is being tested, and 
  // the 2nd one is a function which normally contains one assert. 
  it('Test 1: compare(a,b) returns something', function () {

    // assert is the core component of automated testing, by which we can verify wether
    // some condition is true or false. true represents the test has passed, and false 
    // represents a failure. See https://www.chaijs.com/api/assert/
    assert.exists(result, 'the return value is not null or undefined');
  });

  it('Test 2: the returned value is from type number', function () {
    assert.typeOf(result, 'number');
  });

  it('Test 3: the returned values are not null', function () {
    assert.equal(result,  -1) 
  });
})
