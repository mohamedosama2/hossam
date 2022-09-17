import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PhoneConfirmationModule } from 'src/phone-confirmation/phone-confirmation.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { RolesGuard } from './guards/roles.guard';
import { GoogleOauthStrategy } from './strategies/googleStrategy.passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    UsersModule,
    PhoneConfirmationModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      /*   transport: 'smtps://samehdr2022@gmail.com:Lato2022@smtp.gmail.com', */
      // or
      transport: {
        name: 'tasking',
        host: 'smtp.gmail.com',

        port: 465, // port for secure SMTP
        logger: true,
        debug: true,
        tls: {
          rejectUnauthorized: false,
        },
        secure: true, // use SSL
        auth: {
          user: 'samehdr2022@gmail.com',
          pass: 'czgakrhfaqmdczha',
        },
      },
      defaults: {
        from: '"Tasking App" samehdr2022@gmail.com',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleOauthStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
