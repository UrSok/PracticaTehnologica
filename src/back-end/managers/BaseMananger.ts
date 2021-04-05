export default class BaseManager {
  protected repository: any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor(repository: any) {
    this.repository = repository;
  }
}
