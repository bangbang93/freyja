import {Controller, Get, Redirect} from '@nestjs/common'

@Controller('admin')
export class AdminController {
  @Get()
  @Redirect('/admin/home')
  public home(): void {
    // noop
  }
}
