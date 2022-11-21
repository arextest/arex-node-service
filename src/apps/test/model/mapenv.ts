import { RunEnv } from "./runenv";

export class MapEnv {
    envContainer: Map<String, RunEnv>;

    constructor() {
        this.envContainer = new Map();
    }

    set(key: string, value: string) {
        if (this.envContainer.has(key)) {
            let env = this.envContainer.get(key);
            env.value = value
        } else {
            let runenv = new RunEnv();
            runenv.key = key;
            runenv.value = value;
            this.envContainer.set(key, runenv);
        }
    }

    get(key: string): string {
        return this.envContainer?.get(key)?.value;
    }

    delete(key: string) {
        this.envContainer.delete(key);
    }


}