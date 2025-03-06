'use server';

import axios from '../../axios';
import { endpoints } from './endpoints';

export const generateLink = data => {
  return axios().post(endpoints.generateLink, data);
};

export const sendInvitations = data => {
  return axios().post(endpoints.sendEmail, data);
};

export const sendMassiveInvitations = data => {
  return axios().post(endpoints.sendMassiveInvitation, data);
};

export const verifyLink = (token, linkId) => {
  return axios().post(endpoints.verifyLink(token, linkId));
};
