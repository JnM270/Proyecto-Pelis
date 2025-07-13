import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const verifyToken = (req, res, next) => {
  const bearer = req.headers['authorization'];
  if (!bearer) return res.status(403).json({ message: 'Token requerido' });

  const token = bearer.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

