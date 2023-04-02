import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/User';
import { Wish } from './wishes/entity/Wish';
import { Offer } from './offers/entity/Offer';
import { Wishlist } from './wishlists/entity/Wishlist';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // параметр конфига
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'secretpassword',
      database: 'kupipodariday',
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: '4sdN9LQUhARIEHKl',
      signOptions: { expiresIn: '3h' },
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  //fdsaf
}
