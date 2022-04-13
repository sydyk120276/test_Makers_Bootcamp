import { Brand } from '../models/models'

export async function BrandControllerCreate(req, res) {
  const { name } = req.body
  const brand = await Brand.create({ name })
  return res.json(brand)
}

export async function BrandControllergetAll(req, res) {
  const brands = await Brand.findAll()
  return res.json(brands)
}
