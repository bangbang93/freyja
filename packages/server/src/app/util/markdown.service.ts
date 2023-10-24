import {Injectable} from '@nestjs/common'
import MarkdownIt from 'markdown-it'
import MarkdownItLozad from 'markdown-it-lozad'

@Injectable()
export class MarkdownService {
  private readonly md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: false,
  })
    .use(MarkdownItLozad)

  private readonly commentMd = new MarkdownIt({
    html: false,
  })

  public render(content: string): string {
    return this.md.render(content)
  }

  public renderComment(content: string): string {
    return this.commentMd.render(content)
  }
}
