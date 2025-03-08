export class Log {
  private logs: string[] = [];

  public addLog(log: string): void {
    this.logs.push(log);
  }

  public getLogs(): string {
    return this.logs.join("<br>");
  }
}
