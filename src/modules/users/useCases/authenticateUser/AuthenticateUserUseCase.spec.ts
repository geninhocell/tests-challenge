import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('[Authenticate User Use Case]', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });
  });

  it('should be able to create a new session', async () => {
    const session = await authenticateUserUseCase.execute({
      email: 'user@mail.com',
      password: '123123'
    });

    expect(session).toHaveProperty('token');
  });

  it('should not be able to create a new session with unregistered email', async () => {
    expect(async()=>{
     await authenticateUserUseCase.execute({
        email: 'unregistered@email.com',
        password: '123123'
      });
    }).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to create a new session with the wrong password', async () => {
    expect(async()=>{
     await authenticateUserUseCase.execute({
        email: 'user@email.com',
        password: 'wrong'
      });
    }).rejects.toBeInstanceOf(AppError)
  });
});
