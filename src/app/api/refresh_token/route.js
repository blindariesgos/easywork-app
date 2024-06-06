import { refreshAuthToken } from '../../../lib/helpers/refresh_auth_token'
import { updateSession, clearSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const updatedAuthToken = await refreshAuthToken();

    if (!updatedAuthToken) {
      throw new Error('Failed to refresh auth token');
    }

    await updateSession(updatedAuthToken);
    res.status(200).json({ token: updatedAuthToken });
  } catch (error) {
    await clearSession();
    res.status(401).json({ error: 'Failed to refresh token' });
  }
}