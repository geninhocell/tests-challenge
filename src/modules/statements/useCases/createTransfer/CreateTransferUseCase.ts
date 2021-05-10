import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  TRANSFER = 'transfer'
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, send_id, amount, description }: ICreateTransferDTO) {
    const receiveUser = await this.usersRepository.findById(user_id);
    const sendUser = await this.usersRepository.findById(send_id);

    if(!receiveUser && !sendUser) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: send_id
    });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const type = 'transfer' as OperationType;

    const statementOperation = await this.statementsRepository.create({
      user_id,
      send_id,
      type,
      amount,
      description
    });



    return statementOperation;
  }
}
