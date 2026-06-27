import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from '../main';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}
  async create(registerDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const new_user = await this.db.client.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      },
    });
    return new_user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(logindto: LoginDto) {
    const secret = JwtConfig.secret;
    console.log(secret);
    if (!secret) {
      return 'JWT secret is empty';
    }
    if (!logindto.email) {
      return {
        message: 'Email not found',
        success: false,
      };
    }
    const user = await this.db.client.user.findUnique({
      where: {
        email: logindto.email,
      },
    });

    if (!user || user?.password == null) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await bcrypt.compare(logindto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Credentials do not match');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      access_token: accessToken,
    };
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConfig.secret,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
