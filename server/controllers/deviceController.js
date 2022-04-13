import { nanoid } from 'nanoid'
import path from 'path'
import { Device, DeviceInfo } from '../models/models'
import ApiError from '../error/ApiError'

export async function DeviceControllerCreate(req, res, next) {
  try {
    const {
      name,
      price,
      brandId,
      typeId,
      info
    } = req.body
    const { img } = req.files
    const fileName = `${nanoid()}.jpg`
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    const device = await Device.create({
      name,
      price,
      brandId,
      typeId,
      img: fileName
    })

    if (info) {
      const infos = JSON.parse(info)
      infos.forEach((i) => DeviceInfo.create({ title: i.title, description: i.description, deviceId: device.id }))
    }

    return res.json(device)
  } catch (e) {
    next(ApiError.badRequest(e.message))
  }
}

export async function DeviceControllerGetAll(req, res) {
  const {
    brandId,
    typeId,
    limit,
    page
  } = req.query
  const pages = page || 1
  const limits = limit || 9
  const offset = pages * limits - limits
  let devices
  if (!brandId && !typeId) {
    devices = await Device.findAndCountAll({ limits, offset })
  }
  if (brandId && !typeId) {
    devices = await Device.findAndCountAll({ where: { brandId }, limits, offset })
  }
  if (!brandId && typeId) {
    devices = await Device.findAndCountAll({ where: { typeId }, limits, offset })
  }
  if (brandId && typeId) {
    devices = await Device.findAndCountAll({ where: { typeId, brandId }, limits, offset })
  }
  return res.json(devices)
}

export async function DeviceControllerGetOne(req, res) {
  const { id } = req.params
  const device = await Device.findOne({
    where: { id },
    include: [{ model: DeviceInfo, as: 'info' }]
  })
  return res.json(device)
}
