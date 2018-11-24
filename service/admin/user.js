/**
 * Created by bangbang93 on 2017/9/3.
 */
'use strict'
const {AdminModel} = require('../../model/admin')
const bcrypt = require('bcrypt')

exports.login = async (username, password) => {
  let admin = await AdminModel.getByName(username)
  if (!admin) throw new Error('no such user')

  const result = await bcrypt.compare(password, admin.password)
  if (result) {
    admin = admin.toJSON()
    delete admin.password
    return admin
  } else {
    throw new Error('wrong password')
  }
}

exports.create = async (username, password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return AdminModel.create({username, password: hash, salt})
}
