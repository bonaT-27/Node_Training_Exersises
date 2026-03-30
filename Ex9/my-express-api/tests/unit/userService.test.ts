import { describe, it, expect } from 'vitest';
import { getUser } from '../../src/services/userService.js';

describe('User Service', () => {
  it('should return valid user', () => {
    const user = getUser(1);
    expect(user.id).toBe(1);
  });

  it('should throw error for invalid id', () => {
    expect(() => getUser(0)).toThrow('Invalid ID');
  });
});