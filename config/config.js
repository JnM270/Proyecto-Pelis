  export const config = {
  
  DB_URL: 'mongodb+srv://usuario:clave@cluster0.dzbmzlh.mongodb.net/',
  PORT: process.env.PORT || 3000,
  SERVER_IP: 'ip',
  PROTOCOL: 'http',
  JWT_SECRET: '', 

  SMTP: {
    USER: 'usuario',
    PASS: 'clave',
    PORT: 3000,
    SENDER_EMAIL: 'email',
    REPLY_TO: 'email',
  }
}

export const SERVER_URL = `${config.PROTOCOL}://${config.SERVER_IP}:${config.PORT}`;
