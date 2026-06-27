import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({'message': 'Name cannot be empty'})
  name: string;

  @IsNotEmpty({'message': 'Email is required'})
  @IsEmail()
  email: string;

  @MinLength(8, {'message': 'Password is too short'})
  password: string;
}
