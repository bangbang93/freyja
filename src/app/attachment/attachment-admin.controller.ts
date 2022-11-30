import {MongoIdParam} from '@bangbang93/utils/nest-mongo'
import {PagedDto} from '@bangbang93/utils/nestjs'
import {
  BadRequestException, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {Request} from 'express'
import {copy} from 'fs-extra'
import {extname, join, sep} from 'path'
import {AdminGuard} from '../admin/admin.guard'
import {AttachmentCreateResDto} from './attachment.dto'
import {IAttachmentSchema} from './attachment.model'
import {AttachmentService} from './attachment.service'

@Controller('api/admin/attachment')
@UseGuards(AdminGuard)
export class AttachmentAdminController {
  private readonly uploadPath = join(__dirname, '../../../public/uploads')
  constructor(
    private readonly attachmentService: AttachmentService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async upload(@UploadedFile() file: Request['file']): Promise<AttachmentCreateResDto> {
    if (!file) {
      throw new BadRequestException('no file')
    }
    const now = new Date()
    const datePath = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(sep)

    let ext = extname(file.originalname)
    if (!ext) {
      ext = `.${file.mimetype.split('/')[1]}`
    }
    const filename = `${Date.now()}${ext}`
    const savePath = join(this.uploadPath, datePath, filename)

    await copy(file.path, savePath)

    const attachment = await this.attachmentService.create({
      filename: file.originalname,
      path: join('/uploads', datePath, filename),
      mimeType: file.mimetype,
    })
    return {
      id: attachment._id,
      filename: attachment.filename,
      path: join('/uploads', datePath, filename),
    }
  }

  @Get()
  public async list(@Query() query: PagedDto): Promise<IAttachmentSchema[]> {
    return this.attachmentService.listByPage(query.page, query.limit)
  }

  @Get('count')
  public async count(): Promise<{ count: number }> {
    return {
      count: await this.attachmentService.count(),
    }
  }

  @Get(':id(\\w{24})')
  public async getById(@MongoIdParam('id') id: string): Promise<IAttachmentSchema | null> {
    return this.attachmentService.getById(id)
  }
}
