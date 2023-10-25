export class GenericRepositoryFake<T> {
    items: T[] = [];

    async create(itemData: Partial<T>): Promise<T> {
        const item = Object.assign(new Object() as T, itemData);
        return Promise.resolve(item);
    }

    async save(item: T): Promise<T> {
        this.items.push(item);
        return Promise.resolve(item);
    }

    async findOne(conditions: any): Promise<T | undefined> {
        const item = this.items.find((item) => {
            return Object.entries(conditions.where).every(
                ([key, value]) => item[key] === value,
            );
        });
        return Promise.resolve(item);
    }

    async findBy(conditions: any): Promise<T[] | []> {
        const foundItems = this.items.filter(item => {
            return Object.entries(conditions).every(
                ([key, value]) => item[key] === value,
            );
        })
        return Promise.resolve(foundItems);
    }

    async remove(item: T): Promise<T> {
        const itemIndex = this.items.findIndex((item) => {
            return Object.entries(item).every(
                ([key, value]) => item[key] === value,
            );
        });
        return Promise.resolve(item);
    }
}
