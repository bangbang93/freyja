import {Module} from '@nestjs/common'
import {MailService} from './mail.service'
import {MarkdownService} from './markdown.service'

@Module({
  providers: [
    MarkdownService,
    MailService,
  ],
  exports: [
    MarkdownService,
    MailService,
  ],
})
export class UtilModule {}
