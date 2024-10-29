import requests from './http.api';

const authService = {
  Login(body) {
    return requests.post('/api/v1/login', body);
  }
};

export default authService;
