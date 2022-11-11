/**
 * Created by bangbang93 on 2017/10/15.
 */
'use strict'
import * as NodeMailer from 'nodemailer'
import * as MarkdownHelper from '../helper/markdown'
import {IArticleSchema} from '../model/article'

const transporter = NodeMailer.createTransport({
  from: 'example.com',
})
// const transporter = NodeMailer.createTransport(Config.freyja.mail)

export async function commentReply({to, article}: {to: string; article: IArticleSchema}): Promise<any> {
  const content = `
bangbang93.forum()
---
您在bangbang93.forum()的文章《${article.title}》收到了新的回复
查看链接
<https://blog.bangbang93.com/article/${article._id}>
`
  const html = MarkdownHelper.render(content)
  return transporter.sendMail({
    from: 'Config.freyja.mail.from',
    to,
    subject: 'bangbang93.forum() 通知',
    html,
  })
}

export async function comment({article}: {article: IArticleSchema}): Promise<any> {
  const content = `
bangbang93.form()
---
文章《${article.title}》有新评论
查看链接
<https://blog.bangbang93.com/article/${article._id}>
`
  const html = MarkdownHelper.render(content)
  return transporter.sendMail({
    from: 'Config.freyja.mail.from',
    to: 'Config.freyja.commentTo',
    subject: 'bangbang93.forum() 评论',
    html,
  })
}
