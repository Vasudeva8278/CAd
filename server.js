const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const sequelize = require('./config/database');
const { File, Block } = require('./models');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());
app.use('/api/files', fileRoutes);

async function startServer() {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    
    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

startServer();
