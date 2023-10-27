import {Controller, Get, OnModuleInit, Param, Redirect} from '@nestjs/common'
import {RedirectResponse} from '@nestjs/core/router/router-response-controller'
import Logger from 'bunyan'
import {readdir} from 'fs/promises'
import {InjectLogger} from 'nestjs-bunyan'
import path from 'path'

@Controller('admin')
export class AdminController implements OnModuleInit {
  @InjectLogger() private readonly logger!: Logger
  private hash?: string

  @Get('/:type/js/hljs.:lang.js')
  @Redirect()
  public getHljs(@Param('type') type: string, @Param('lang') lang: string): RedirectResponse {
    return {
      url: `/admin/js/hljs/hljs.${lang}.${this.hash}.js`,
    }
  }

  @Get()
  @Redirect('/admin/home')
  public home(): void {
    // noop
  }

  public async onModuleInit(): Promise<void> {
    try {
      const files = await readdir(path.join(__dirname, '../../../client/dist/admin/js/hljs'))
      let match
      for (const file of files) {
        match = file.match(/hljs\.\w+\.(?<hash>\w+)\.js/i)
        if (match) {
          break
        }
      }
      this.hash = match?.groups?.hash
    } catch (e) {
      this.logger.warn(e)
    }
  }
}
