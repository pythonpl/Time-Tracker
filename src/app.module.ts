import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TimereportsModule } from './timereports/timereports.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), UsersModule, AuthModule, ProjectsModule, TimereportsModule],
})
export class AppModule {}
