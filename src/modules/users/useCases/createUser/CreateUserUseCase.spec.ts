import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('[Create User Use Case]', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@email.com',
      password: '123123'
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with registered email', async () => {
    expect(async()=>{
      await createUserUseCase.execute({
        name: 'User_1',
        email: 'user@email.com',
        password: '123123'
      })

     await createUserUseCase.execute({
        name: 'User_2',
        email: 'user@email.com',
        password: '123123'
      });
    }).rejects.toBeInstanceOf(AppError)
  });
});
