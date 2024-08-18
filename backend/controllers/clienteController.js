const Cliente = require('../models/cliente')

exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll()
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body)
    res.status(201).json(cliente)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params
    const [updated] = await Cliente.update(req.body, { where: { id } })
    if (updated) {
      const updatedCliente = await Cliente.findOne({ where: { id } })
      res.status(200).json(updatedCliente)
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Cliente.destroy({ where: { id } })
    if (deleted) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
