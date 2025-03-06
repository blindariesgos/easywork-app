'use server';

import axios from '../../axios';
import { endpoints } from './endpoints';

export const registerNewUser = data => {
  return axios().post(endpoints.registerNewUser, data);
};
