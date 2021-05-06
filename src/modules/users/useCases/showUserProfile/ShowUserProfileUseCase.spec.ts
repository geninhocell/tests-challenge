import { User } from '@modules/users/entities/User';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('[Show User Profile Use Case]', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User",
      email: "user@mail.com",
      password: await hash('123123', 8),
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty('id');
  });

  it('should not be able to show a user unregistered', async () => {
    expect(async()=>{
     await showUserProfileUseCase.execute('unregistered_id');
    }).rejects.toBeInstanceOf(AppError)
  });
});
