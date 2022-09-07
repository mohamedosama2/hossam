import { CacheModule, Module, UseInterceptors } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PhoneConfirmationModule } from './phone-confirmation/phone-confirmation.module';
import { DatabaseModule } from './database.module';
import { ChatModule } from './chat/chat.module';
import { MessageQueueModule } from './message-queue/message-queue-publisher.module';
import { CacheConfigService } from './cache/cacheConfigService';
import { cacheOperationsModule } from './cache/cache.module';
import { NotificationModule } from './notification/notification.module';
import { UniversityModule } from './university/university.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GroupModule } from './group/group.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PhoneConfirmationModule,
    UniversityModule,
    SubjectsModule,
    GroupModule,
    /*  ChatModule, */
    /*     NotificationModule, */
    // MessageQueueModule,
    // cacheOperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
