import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { User } from './entity/users.entity';

const mockUser = {
    id: 1,
    name: 'John',
    lastName: 'Doe',
    rut: '12345678-9',
    address: 'Updated address',
    createdAt: new Date(),
};

const mockPrismaService = {
    user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue(mockUser),
        findMany: jest.fn().mockResolvedValue([mockUser]),
        update: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue(undefined),
    },
};

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a user and return it', async () => {
            const userDto: CreateUserDto = {
                name: 'John',
                lastName: 'Doe',
                rut: '12345678-9',
                address: 'Some address',
            };

            const result = await service.create(userDto);

            expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: userDto });
            expect(result).toEqual(new User(mockUser.id, mockUser.name, mockUser.lastName, mockUser.rut, mockUser.address, mockUser.createdAt));
        });

        it('should throw an InternalServerErrorException if create fails', async () => {
            mockPrismaService.user.create.mockRejectedValue(new Error('Error'));

            const userDto: CreateUserDto = {
                name: 'John',
                lastName: 'Doe',
                rut: '12345678-9',
                address: 'Some address',
            };

            await expect(service.create(userDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('get', () => {
        it('should return a user by id', async () => {
            const result = await service.get(1);

            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(new User(mockUser.id, mockUser.name, mockUser.lastName, mockUser.rut, mockUser.address, mockUser.createdAt));
        });

        it('should throw NotFoundException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.get(1)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if get fails', async () => {
            mockPrismaService.user.findUnique.mockRejectedValue(new Error('Error'));

            await expect(service.get(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getAll', () => {
        it('should return a list of users', async () => {
            const result = await service.getAll();

            expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });
            expect(result).toEqual([mockUser].map(user => new User(user.id, user.name, user.lastName, user.rut, user.address, user.createdAt)));
        });

        it('should throw InternalServerErrorException if getAll fails', async () => {
            mockPrismaService.user.findMany.mockRejectedValue(new Error('Error'));

            await expect(service.getAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update a user by id and return it', async () => {
            const updatedUser = { ...mockUser, name: 'Jane' };
            mockPrismaService.user.findUnique.mockResolvedValue(updatedUser);
            mockPrismaService.user.update.mockResolvedValue(updatedUser);

            const userDto: UpdateUserDto = {
                name: 'Jane',
                lastName: 'Doe',
                rut: '12345678-9',
                address: 'Updated address',
            };

            const result = await service.update(1, userDto);
            const compare = new User(updatedUser.id, updatedUser.name, updatedUser.lastName, updatedUser.rut, updatedUser.address, updatedUser.createdAt);
            expect(mockPrismaService.user.update).toHaveBeenCalled();
            expect(result).toEqual(compare);
        });

        it('should throw InternalServerErrorException if update fails', async () => {
            mockPrismaService.user.update.mockRejectedValue(new Error('Error'));

            const userDto: UpdateUserDto = {
                name: 'Jane',
                lastName: 'Doe',
                rut: '12345678-9',
                address: 'Updated address',
            };

            await expect(service.update(1, userDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('delete', () => {
        it('should delete a user by id', async () => {
            const deleteUser = { ...mockUser, name: 'Jane' };
            mockPrismaService.user.findUnique.mockResolvedValue(deleteUser);
            await service.delete(1);

            expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw InternalServerErrorException if delete fails', async () => {
            mockPrismaService.user.delete.mockRejectedValue(new Error('Error'));

            await expect(service.delete(1)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
