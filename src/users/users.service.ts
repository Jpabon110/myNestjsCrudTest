import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../users/entity/users.entity";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
    constructor( private readonly prisma: PrismaService ){}

    async create(user: CreateUserDto): Promise<User>{
        try {
            const data: CreateUserDto = user;
            const userPost = await this.prisma.user.create({ data });
            return new User(
                userPost.id,
                userPost.name,
                userPost.lastName,
                userPost.rut,
                userPost.address,
                userPost.createdAt
            )
        } catch (error) {
            throw new InternalServerErrorException('something goes wrong creating the user', error);
        }

    }

    async get(id: number): Promise<User>{
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });
    
            if(!user){
                throw new NotFoundException('User not found');
            }
            return new User(user.id, user.name, user.lastName, user.rut, user.address, user.createdAt);
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            throw new InternalServerErrorException('something goes wrong getting user', error);
        }

    }

    async getAll(page: number = 1, limit: number = 10): Promise<User[]> {
        try {
            const skip = (page - 1) * limit;
            const users = await this.prisma.user.findMany({
                skip: skip,
                take: limit,
            })
            return users.map((user)=> new User(user.id, user.name, user.lastName, user.rut, user.address, user.createdAt))
        } catch (error) {
            throw new InternalServerErrorException('something goes wrong getting all users', error);
        }

    }

    async update(id: number, userDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });
    
            if(!user){
                throw new NotFoundException('User not found');
            }

            const data: UpdateUserDto = userDto;
            const userUpdated = await this.prisma.user.update({
                where:{
                    id
                },
                data
            });

            return new User(
                userUpdated.id,
                userUpdated.name,
                userUpdated.lastName,
                userUpdated.rut,
                userUpdated.address,
                userUpdated.createdAt
            );
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            throw new InternalServerErrorException('something goes wrong updating the user', error);
        }

    }

    async delete(id: number): Promise<void> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });
    
            if(!user){
                throw new NotFoundException('User not found');
            }

            await this.prisma.user.delete({
                where: {
                    id
                }
            })
        } catch (error) {
            if(error instanceof NotFoundException){
                throw error
            }
            throw new InternalServerErrorException('something goes wrong deleting a user', error);
        }

    }
}