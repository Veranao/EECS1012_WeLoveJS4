assert = chai.assert;


// describe() is a function by which you can define a collection of tests. 
// It takes two parameters, the 1st one is a description of what is being tested, and 
// the 2nd one is a function which contains one or multiple tests each defined by one it().
describe('Testing function addUser() of server', function () {
  var result = addUser("Victor");

  // it() is a function by which you should define one single test.
  // It takes two parameters, the 1st one is a description of what is being tested, and 
  // the 2nd one is a function which normally contains one assert. 
  it('Test 1: addUser() returns something', function () {

    // assert is the core component of automated testing, by which we can verify wether
    // some condition is true or false. true represents the test has passed, and false 
    // represents a failure. See https://www.chaijs.com/api/assert/
    assert.exists(result, 'the return value is not null or undefined');
  });

  it('Test 2: the returned value is from type object', function () {
    assert.isObject(result, 'true');
  });

  it('Test 3: the user list is growing', function () {


    for (var i = 1; i < 11; i++) {
      result = addUser(i);
        assert.equal(Object.keys(result).length, i + 1);
        //i+1 because a user is added in the first test of mochaTest3
    }
  });
})
