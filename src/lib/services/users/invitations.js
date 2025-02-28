'use server';

import axios from '../../axios';

const endpoints = {
  generateLink: '/users/invitations/generate-link',
  sendEmail: '/users/invitations/send',
  verifyLink: (token, linkId) => `/invitations/v/${token}/link/${linkId}`,
};

export const generateLink = data => {
  return axios().post(endpoints.generateLink, data);
};
