/**
 * Created by bangbang93 on 2017/10/15.
 */
'use strict'
import * as NodeMailer from 'nodemailer'
import * as Config from '../config'
import * as MarkdownHelper from '../helper/markdown'
const transporter = NodeMailer.createTransport({
  sendmail: true,
})

export async function commentReply({to, article}): Promise<any> {
  const content = `
bangbang93.forum()
---
您在bangbang93.forum()的文章《${article.title}》收到了新的回复
查看链接
<https://blog.bangbang93.com/article/${article._id}>
`
  const html = MarkdownHelper.render(content)
  return transporter.sendMail({
    from   : Config.freyja.mail.from,
    to,
    subject: 'bangbang93.forum() 通知',
    html,
  })
}

export async function comment({article}): Promise<any> {
  const content = `
bangbang93.form()
---
文章《${article.title}》有新评论
查看链接
<https://blog.bangbang93.com/article/${article._id}>
`
  const html = MarkdownHelper.render(content)
  return transporter.sendMail({
    from   : Config.freyja.mail.from,
    to     : Config.freyja.mail.to,
    subject: 'bangbang93.forum() 评论',
    html,
  })
}
