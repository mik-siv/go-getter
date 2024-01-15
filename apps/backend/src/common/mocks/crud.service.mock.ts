import { ICrudService } from '../types/interfaces/crud.interface';
import { FindOptionsWhere } from 'typeorm';

export class MockCrudService<T, CreateDTO, UpdateDTO> implements ICrudService<T, CreateDTO, UpdateDTO> {
  create = jest.fn((createDto: CreateDTO): Promise<T> => {
    // Mock implementation or return value
    return Promise.resolve({} as T);
  });

  findAll = jest.fn((): Promise<T[]> => {
    // Mock implementation or return value
    return Promise.resolve([]);
  });

  findBy = jest.fn((attrs: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> => {
    // Mock implementation or return value
    return Promise.resolve([]);
  });

  findById = jest.fn((id: string): Promise<T> => {
    // Mock implementation or return value
    return Promise.resolve({} as T);
  });

  update = jest.fn((id: string, updateDto: UpdateDTO): Promise<T> => {
    // Mock implementation or return value
    return Promise.resolve({} as T);
  });

  remove = jest.fn((id: string): Promise<T> => {
    // Mock implementation or return value
    return Promise.resolve({} as T);
  });
}
