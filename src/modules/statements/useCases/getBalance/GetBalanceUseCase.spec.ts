import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('[Get Balance Use Case]', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it('should be able to return the balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    const response = await getBalanceUseCase.execute({ user_id: user.id });

    expect(response).toHaveProperty('statement');
    expect(response).toHaveProperty('balance');
  });

  it('should not be able to return the balance with unregistered user', async () => {
    expect(async()=>{
     await getBalanceUseCase.execute({ user_id: 'unregistered_id' });
    }).rejects.toBeInstanceOf(AppError)
  });
});
