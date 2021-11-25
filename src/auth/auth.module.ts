import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PhoneConfirmationModule } from 'src/phone-confirmation/phone-confirmation.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RolesGuard } from './guards/roles.guard';
import { GoogleOauthStrategy } from './strategies/googleStrategy.passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, PhoneConfirmationModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOauthStrategy,
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}