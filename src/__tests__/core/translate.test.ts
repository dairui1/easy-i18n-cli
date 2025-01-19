import { translateChunks } from '../../core/translate';
import dotenv from 'dotenv';

dotenv.config();

describe('Translation Core', () => {
  it('should translate JSON correctly', async () => {
    const input = JSON.stringify({
      greeting: 'hello',
      farewell: 'goodbye'
    });

    const result = await translateChunks(input, 'cn', 'json');
    
    expect(result).toEqual({
      greeting: '你好',
      farewell: '再见'
    });
  }, 30000); // 30 second timeout

  it('should translate TOML correctly', async () => {
    const input = `greeting = "hello"
farewell = "goodbye"`;

    const result = await translateChunks(input, 'cn', 'toml');

    expect(result).toEqual({
      greeting: '你好',
      farewell: '再见'
    });
  }, 30000); // 30 second timeout
}); 