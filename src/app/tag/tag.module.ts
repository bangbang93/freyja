import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {forNestModule} from 'mongoose-typescript'
import {Tag} from './tag.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      forNestModule(Tag),
    ]),
  ],
})
export class TagModule {}
