import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; // Asegúrate de que esta ruta sea correcta
import { CreateUserDto } from './dto/users.dto'; // Asegúrate de que esta ruta sea correcta
import { User } from './entity/users.entity'; // Asegúrate de que esta ruta sea correcta

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn((userDto: CreateUserDto) => {
      return new User(1, userDto.name, userDto.lastName, userDto.rut, userDto.address, new Date());
    }),
    get: jest.fn((id: number) => {
      return new User(id, 'John', 'Doe', '12345678-9', 'Some address', new Date());
    }),
    getAll: jest.fn(() => {
      return [new User(1, 'John', 'Doe', '12345678-9', 'Some address', new Date())];
    }),
    update: jest.fn((id: number, userDto) => {
      return new User(id, userDto.name, userDto.lastName, userDto.rut, userDto.address, new Date());
    }),
    delete: jest.fn((id: number) => {
      return;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = { name: 'John', lastName: 'Doe', rut: '12345678-9', address: 'Some address' };
    const user = await controller.create(userDto);
    expect(user).toBeDefined();
    expect(service.create).toHaveBeenCalledWith(userDto);
  });

  it('should find a user by id', async () => {
    const id: string = "1"
    const user = await controller.findById(id);
    expect(user).toBeDefined();
    expect(service.get).toHaveBeenCalledWith(Number(id));
  });

  it('should find all users', async () => {
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const id: string = "1"
    const userDto: CreateUserDto = { name: 'Jane', lastName: 'Doe', rut: '12345678-9', address: 'New address' };
    const updatedUser = await controller.updateUser(id, userDto);
    expect(updatedUser).toBeDefined();
    expect(service.update).toHaveBeenCalledWith(Number(id), userDto);
  });

  it('should delete a user', async () => {
    const id: string = "1"
    await controller.deleteUser(id);
    expect(service.delete).toHaveBeenCalledWith(Number(id));
  });
});
