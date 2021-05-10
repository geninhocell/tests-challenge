import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    send_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {

    const statement = this.repository.create({
      user_id,
      send_id,
      amount,
      description,
      type
    });


    await this.repository.save(statement);
    console.log('Repository', statement)
    return statement
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const transfersStatement = await this.repository.find({
      where: { send_id: user_id }
    });

    const balanceTransfers = transfersStatement.reduce((acc, operation) => {
      return acc + operation.amount;
    }, 0);

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

    if (with_statement) {
      return {
        statement: [...transfersStatement, ...statement],
        balance: balance - balanceTransfers,
      }
    }

    return { balance: balance - balanceTransfers }
  }
}
