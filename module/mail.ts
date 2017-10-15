/**
 * Created by bangbang93 on 2017/10/15.
 */
'use strict';
import * as NodeMailer from 'nodemailer'
const transporter = NodeMailer.createTransport({
  sendmail: true,
})

transporter.sendMail({
  from: 'bangbang93@bangbang93.com',
  to: 'bangbang93@163.com',
  subject: 'test',
  text: 'text'
})
