import { DataUtils } from './data.util';

describe('DataUtil', () => {
  let extractIdsSpy: jest.SpyInstance;
  beforeEach(() => {
    extractIdsSpy = jest.spyOn(DataUtils, 'extractRelationIds');
  });
  it('should extract ids from lazy loaded arrays', async () => {
    const lazyLoadedArray = () => Promise.resolve([{ id: '1' }, { id: '2' }]);
    const idsFromLazyLoadedArray = ['1', '2'];
    const result = await DataUtils.extractRelationIds(lazyLoadedArray());
    expect(extractIdsSpy).toBeCalledTimes(1);
    expect(result).toEqual(idsFromLazyLoadedArray);
  });
});
