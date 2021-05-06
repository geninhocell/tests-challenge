import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('[Get Statement Operation Use Case]', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to get a statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    const type = 'withdraw' as OperationType;

    const statementCreate = await inMemoryStatementsRepository.create({
      amount: 0,
      description: 'Test',
      type,
      user_id: user.id,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statementCreate.id
    });

    expect(statement).toHaveProperty('id')
    expect(statement.type).toBe('withdraw')
  });

  it('should not be able to get a statement operation with unregistered user', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'unregistered_id',
        statement_id: 'unregistered_id'
      });
    }).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to get a statement operation unregistered', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: 'unregistered_id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
