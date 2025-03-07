'use server';

import authHttp from '../../axios';
import { endpoints } from './endpoints';

const baseURL = process.env.API_HOST;

export const generateLink = data => {
  return authHttp().post(endpoints.generateLink, data);
};

export const sendInvitations = data => {
  return authHttp().post(endpoints.sendEmail, data);
};

export const sendMassiveInvitations = data => {
  return authHttp().post(endpoints.sendMassiveInvitation, data);
};

export const verifyLink = (token, linkId) => {
  return authHttp().get(endpoints.verifyLink(token, linkId));
};

export const registerUser = data => {
  return authHttp().post(endpoints.registerNewUser, data);
};
