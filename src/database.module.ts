import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        connection.plugin(require('mongoose-paginate-v2'));
        connection.plugin(require('mongoose-aggregate-paginate-v2'));
        return connection;
      },
    }),
  ],
})
export class DatabaseModule {}
