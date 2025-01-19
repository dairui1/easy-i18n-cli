import consola from "consola";

export const retryFetch = async (url: string, options: RequestInit, retries = 3, retryDelay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      consola.error(`Fetch attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      consola.log(`Retrying... (${retries - i - 1} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  // This should never be reached due to the throw in the catch block
  throw new Error('Failed to fetch after all retries');
};