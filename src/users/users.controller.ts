import { Body, Controller, Delete, Get, Injectable, Param, Patch, Post, Put, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";

@Controller('users')
@Injectable()
export class UsersController {
    constructor(private userServices: UsersService){}

    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.userServices.create(userDto);
    }

    @Get(':id')
    findById(@Param('id') id: string){        
        return this.userServices.get(Number(id));
    }

    @Get()
    findAll(){
        return this.userServices.getAll();
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDto){
        return this.userServices.update(Number(id), user);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string){
        return this.userServices.delete(Number(id));
    }
}