/**
 * Created by bangbang93 on 2017/10/15.
 */
'use strict'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {createTransport, Transporter} from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import {IAdminSchema} from '../admin/admin.model'
import {IArticleSchema} from '../article/article.model'
import {MarkdownService} from './markdown.service'

@Injectable()
export class MailService {
  private readonly transporter: Transporter<SMTPTransport>
  constructor(
    configService: ConfigService,
    private readonly markdownService: MarkdownService,
  ) {
    this.transporter = createTransport<SMTPTransport>(configService.getOrThrow('freyja.mail'))
  }

  public async commentReply({to, article}: {to: string; article: IArticleSchema}): Promise<SMTPTransport> {
    const content = `
bangbang93.forum()
---
您在bangbang93.forum()的文章《${article.title}》收到了新的回复
查看链接
<https://blog.bangbang93.com/article/${article._id.toString()}>
`
    const html = this.markdownService.render(content)
    return await this.transporter.sendMail({
      from: 'blog@noti.933.moe',
      to,
      subject: `您在bangbang93.forum()的文章《${article.title}》收到了新的回复`,
      html,
    })
  }


  public async comment(article: IArticleSchema, author: IAdminSchema): Promise<SMTPTransport> {
    const content = `
bangbang93.forum()
---
文章《${article.title}》有新评论
查看链接
<https://blog.bangbang93.com/article/${article._id.toString()}>
`
    const html = this.markdownService.render(content)
    return await this.transporter.sendMail({
      from: 'blog@noti.933.moe',
      to: author.email,
      subject: `文章《${article.title}》有新评论`,
      html,
    })
  }
}
