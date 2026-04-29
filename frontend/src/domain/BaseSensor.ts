export abstract class BaseSensor<T = any> {
  public raw: T;

  constructor(data: T) {
    this.raw = data;
  }

  abstract process(strategy: any): any;
}
