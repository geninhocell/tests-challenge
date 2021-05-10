import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { id: send_id } = request.user;
    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateTransferUseCase);

    const statement = await createStatement.execute({
      user_id,
      send_id,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
