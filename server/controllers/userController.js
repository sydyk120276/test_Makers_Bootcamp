import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import ApiError from '../error/ApiError'
import { User, Basket } from '../models/models'

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

export async function Registration(req, res, next) {
  const { email, password, role } = req.body
  if (!email || !password) {
    return next(ApiError.badRequest('Некорректный email или password'))
  }
  const candidate = await User.findOne({ where: { email } })
  if (candidate) {
    return next(ApiError.badRequest('Пользователь с таким email уже существует'))
  }
  const hashPassword = await bcrypt.hash(password, 5)
  const user = await User.create({ email, role, password: hashPassword })
  // eslint-disable-next-line
  const basket = await Basket.create({ userId: user.id })
  const token = generateJwt(user.id, user.email, user.role)
  return res.json({ token })
}

export async function Login(req, res, next) {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return next(ApiError.internal('Пользователь не найден'))
  }
  const comparePassword = bcrypt.compareSync(password, user.password)
  if (!comparePassword) {
    return next(ApiError.internal('Указан неверный пароль'))
  }
  const token = generateJwt(user.id, user.email, user.role)
  return res.json({ token })
}

export async function Check(req, res) {
  const token = generateJwt(req.user.id, req.user.email, req.user.role)
  return res.json({ token })
}
