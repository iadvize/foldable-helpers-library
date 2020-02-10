import { hello } from '../src/index';

describe('index', () => {
  describe('hello', () => {
    it('should return hello', () => {
      expect(hello()).toEqual('hello world');
    });
  });
});
