import { Resources, RESOURCES_KEY } from './resource.decorator';
import { OwnedResource } from '../../constants/enums/owned-resources.enum';

describe('Resource decorator', () => {
  it('should set metadata with the provided resources', () => {
    const resources = [OwnedResource.USER_ID, OwnedResource.SUBGOALS];
    const route = {} as any;
    Resources(...resources)(route);
    expect(Reflect.getMetadata(RESOURCES_KEY, route)).toEqual(resources);
  });
});
