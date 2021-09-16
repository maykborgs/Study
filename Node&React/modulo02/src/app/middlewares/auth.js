import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'token not provided' });
  }
  // need to give token or can't auth

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // return a function with promisity and give 2 parameters to verify
    req.userId = decoded.id;
    // add this field with the user id to use it in another places
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};
