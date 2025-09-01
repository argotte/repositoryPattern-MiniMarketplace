export interface IStatsRepository {
  count(): Promise<number>;
  getAveragePrice(): Promise<number>;
  getCategoryStats(): Promise<Record<string, number>>;
}
