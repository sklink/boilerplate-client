import { BASE_API_URL, HTTP_PROTOCOL } from '../_constants';

class RestService {
  static async post(endpoint: string, payload = {}) {
    return fetch(`${HTTP_PROTOCOL}://${BASE_API_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(response => response.status === 200 ? response.json() : response)
  }
}

export default RestService;
