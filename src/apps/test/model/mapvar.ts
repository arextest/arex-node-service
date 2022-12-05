import { RunVar } from './runvar';

export class MapVar {
  varContainer: Map<string, RunVar>;

  constructor() {
    this.varContainer = new Map();
  }

  set(key: string, value: any) {
    if (this.varContainer.has(key)) {
      const env = this.varContainer.get(key);
      env.value = value;
    } else {
      const runenv = new RunVar();
      runenv.key = key;
      runenv.value = value;
      this.varContainer.set(key, runenv);
    }
  }

  get(key: string): any {
    return this.varContainer?.get(key)?.value;
  }

  delete(key: string) {
    this.varContainer.delete(key);
  }
}
