const { expect } = require('chai');

const add = (a, b) => (a + b);

describe('Add function', () => {
  it('should sum up numbers', () => {
    expect(add(1, 2)).to.equal(3);
  })
});
