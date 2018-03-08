export class Collections {
    public static Select<TItem, TProperty>(items: TItem[], select: (i: TItem) => TProperty) : TProperty[] {
        var temp: TProperty[] = [];
        for (let i = 0; i < items.length; i++) {
            temp.push(select(items[i]));
        }
        return temp;
    }
}