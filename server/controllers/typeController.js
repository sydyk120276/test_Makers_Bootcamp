import { Type } from '../models/models'

export async function TypeControllerCreate(req, res) {
  const { name } = req.body
  const type = await Type.create({ name })
  return res.json(type)
}

export async function TypeControllerGetAll(req, res) {
  const types = await Type.findAll()
  return res.json(types)
}
