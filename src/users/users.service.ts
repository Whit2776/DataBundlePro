import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private db: DatabaseService,
    private readonly authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.create(createUserDto);
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `User with email, '${createUserDto.email}' already exists`
        );
      }
      throw error;
    }
  }

  findAll(type?: 'CUSTOMER' | 'RETAILER') {
    if (type) {
      return this.db.client.user.findMany({
        where: {
          type,
        },
      });
    }

    return this.db.client.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.client.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
