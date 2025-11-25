// backend/server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const despachoRoutes = require('./routes/despachos');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/despachos', despachoRoutes);

// CARGAR MODELOS
const User = require('./models/User');
const Despacho = require('./models/Despacho');

// Hacer globales
global.User = User;
global.Despacho = Despacho;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL exitosa');

    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas: Users, Despachos');

    // Dentro de startServer, después de sync
    const createAdmin = async () => {
      try {
        const admin = await User.findOne({ where: { email: 'admin@landy.com' } });
        if (!admin) {
          await User.create({
            username: 'admin',
            email: 'admin@landy.com',
            password: 'admin123',  // ¡Cambia esto a algo seguro en producción!
            role: 'propietario'
          });
          console.log('Usuario propietario creado: admin@landy.com / admin123');
        } else {
          console.log('Admin ya existe');
        }
      } catch (error) {
        console.error('Error al crear admin:', error);
        // No salgas aquí, deja que el servidor siga (o maneja como prefieras)
      }
    };

    await createAdmin();  // Llama a la función aquí

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();