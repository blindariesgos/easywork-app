import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://52.8.72.245/v1',
});

export default instance;
