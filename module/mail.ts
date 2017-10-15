/**
 * Created by bangbang93 on 2017/10/15.
 */
'use strict';
import * as NodeMailer from 'nodemailer'
import * as Config from '../config'
import * as MarkdownHelper from '../helper/markdown'
const transporter = NodeMailer.createTransport({
  sendmail: true,
})

export function commentReply({to, article}) {
  const content = `
bangbang93.forum()
---
您在bangbang93.forum()的文章《${article.title}》收到了新的回复
查看链接
<https://blog.bangbang93.com/article/${article._id}>
`
  const html = MarkdownHelper.render(content)
  return transporter.sendMail({
    from: Config.freyja.mail.from,
    to,
    subject: 'bangbang93.forum() 通知',
    html
  })
}
