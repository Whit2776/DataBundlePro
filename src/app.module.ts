import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { UsersService } from './users/users.service';
import { OrdersService } from './orders/orders.service';
import { DatabaseService } from './database/database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true, // 👈 VERY IMPORTANT
    }),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    WalletModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    OrdersService,
    DatabaseService,
    AuthService,
  ],
})
export class AppModule {}
