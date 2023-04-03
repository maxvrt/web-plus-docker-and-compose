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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    PassportModule,
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
