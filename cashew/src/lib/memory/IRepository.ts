export interface IRepository<T extends { id: string, state: any }> {
    add(item: T);
    delete(item: T);
    get(id: string)
}
