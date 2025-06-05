const API_URL = 'http://localhost:3000/api/items';

export async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
