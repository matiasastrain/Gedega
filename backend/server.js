const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // ← ESTO ES CRÍTICO
require('dotenv').config();

// CARGAR MODELO
const User = require('./models/User');
global.User = User;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // ← ESTO ES CRÍTICO

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL exitosa');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();