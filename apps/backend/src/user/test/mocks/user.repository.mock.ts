import { User } from '../../entities/user.entity';
import { GenericRepositoryMock } from '../../../common/mocks/generic.repository.mock'

/**
 * A mock user repository for testing purposes
 */
export class UserRepositoryMock extends GenericRepositoryMock<User> { }
