const express = require('express')
const dotenv = require('dotenv')
const clienteRoutes = require('./routes/clienteRoutes')
const sequelize = require('./config/database')

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api', clienteRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
    await sequelize.sync({ force: true }) // Esto borrará y creará las tablas cada vez que inicies el servidor. Útil para desarrollo.
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})
