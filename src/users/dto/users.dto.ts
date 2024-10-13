import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

  export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    rut: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address: string;
  }