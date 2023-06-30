import { User } from '../user/entities/user.entity';

export class userRepositoryFake {
  private users: User[] = [];
  async save(userData: { [key: string]: any }): Promise<User> {
    const user = new User();
    this.users.push(user);
    user.id = userData.id;
    user.username = userData.username;
    user.email = userData.email;
    user.password = userData.password;
    return Promise.resolve(user);
  }
}
