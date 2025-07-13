import { User } from '../models/userModels.js';
import { generateToken } from '../generateToken.js';

// Registro
export const registerUserController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Correo ya registrado' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({ success: true, user: newUser, token });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};

// Login
export const loginUserController2 = async (req, res) => {
  const {username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);
    res.json({ success: true, user, token });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};
