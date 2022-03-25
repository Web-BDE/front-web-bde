export type Pagination<T> = {
    page: number,
    count: number,
    items: T[],
}