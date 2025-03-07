export const endpoints = {
  generateLink: '/users/invitations/generate-link',
  sendEmail: '/users/invitations/send',
  sendMassiveInvitation: '/users/invitations/massive-send',
  verifyLink: (token, linkId) => `/onboarding/invitations/v/${token}/link/${linkId}`,
  registerNewUser: '/onboarding/user/register',
};
