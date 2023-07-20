import { User } from '../user/entities/user.entity';

export class UserRepositoryFake {
  private users: User[] = [];

  async create(userData: { [key: string]: any }): Promise<User> {
    const user = new User();
    user.id = userData.id;
    user.username = userData.username;
    user.email = userData.email;
    user.password = userData.password;
    return Promise.resolve(user);
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }

  async findOne(conditions: any): Promise<User | undefined> {
    const user = this.users.find((user) => {
      return Object.entries(conditions.where).every(
        ([key, value]) => user[key] === value,
      );
    });
    return Promise.resolve(user);
  }
}
