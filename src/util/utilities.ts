export class Utilities {
  static delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
