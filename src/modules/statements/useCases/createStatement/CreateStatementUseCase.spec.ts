import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('[Create Statement Use Case]', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to create a new deposit statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    const type = 'deposit' as OperationType;

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      send_id: null,
      amount: 100,
      description: 'bank',
      type
    });

    expect(statement).toHaveProperty('id')
    expect(statement.type).toBe('deposit')
  });

  it('should be able to create a new withdraw statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    const type = 'withdraw' as OperationType;

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      send_id: null,
      amount: 0,
      description: 'bank',
      type
    });

    expect(statement).toHaveProperty('id')
    expect(statement.type).toBe('withdraw')
  });

  it('should not be able to create a new withdraw statement with Insufficient funds', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    expect(async () => {
      const type = 'withdraw' as OperationType;

      await createStatementUseCase.execute({
        user_id: user.id,
        send_id: null,
        amount: 100,
        description: 'bank',
        type
      });
    }) .rejects.toBeInstanceOf(AppError)
  });

  it('should be able to create a new statement with unregistered user', async () => {
    expect(async()=>{
      const type = 'deposit' as OperationType;

      await createStatementUseCase.execute({
        user_id: 'unregistered_id',
        send_id: null,
        amount: 100,
        description: 'bank',
        type
      });
    }).rejects.toBeInstanceOf(AppError)
  });
});
