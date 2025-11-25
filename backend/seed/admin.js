const sequelize = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Asumiendo que usas bcrypt para hashear (instálalo si no: npm install bcryptjs)

const createTestUsers = async () => {
  try {
    await sequelize.sync(); // Sincroniza las tablas si es necesario (puedes quitar si ya se hace en server.js)

    const users = [
      { username: 'admin', email: 'admin@landy.com', password: 'admin@landy.com', role: 'propietario' },
      { username: 'trabajador', email: 'trabajador@landy.com', password: 'trabajador@landy.com', role: 'trabajador' },
      { username: 'cliente', email: 'cliente@landy.com', password: 'cliente@landy.com', role: 'beta' }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        // Hashea la contraseña antes de crear
        const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 es el salt rounds estándar
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`Usuario creado: ${userData.email} / ${userData.password} (rol: ${userData.role}) - Contraseña hasheada`);
      } else {
        console.log(`Usuario ya existe: ${userData.email}`);
      }
    }

    process.exit(0); // Salida exitosa
  } catch (error) {
    console.error('Error al crear usuarios:', error);
    process.exit(1); // Salida con error
  }
};

createTestUsers();