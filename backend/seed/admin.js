const sequelize = require('../config/database');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await sequelize.sync();
    const admin = await User.findOne({ where: { email: 'admin@landy.com' } });
    if (!admin) {
      await User.create({
        username: 'admin',
        email: 'admin@landy.com',
        password: 'admin123',
        role: 'propietario'
      });
      console.log('Usuario propietario creado: admin@landy.com / admin123');
    } else {
      console.log('Admin ya existe');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();