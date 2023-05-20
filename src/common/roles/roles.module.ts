import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionEntity } from '../permissions/entity/permission.entity';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
