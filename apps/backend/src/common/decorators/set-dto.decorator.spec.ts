import { RouteDto, DTO_KEY } from './set-dto.decorator';

describe('SetDtoDecorator', () => {
  it('should create a decorator', () => {
    const decorator = RouteDto({} as any);
    expect(decorator).toBeDefined();
  });

  it('should set metadata', () => {
    const route = {} as any;
    RouteDto({} as any)(route);
    const metadata = Reflect.getMetadata(DTO_KEY, route);
    expect(metadata).toBeDefined();
  });
});
