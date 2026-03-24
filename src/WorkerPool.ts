
import * as Comlink from 'comlink';

interface WorkerData<T> {
    worker: Comlink.Remote<T>;
    is_busy: boolean;
}

interface WorkerQueueData {
    args: any[];
    callback: (...args: any[]) => any;
}

class WorkerPool_<T> {
    private readonly workers: WorkerData<T>[];

    private queue: Map<string, WorkerQueueData[]>;

    constructor(workers: Worker[]) {
        this.workers = workers.map(wkr => ({worker: Comlink.wrap<T>(wkr), is_busy: false}));

        this.queue = new Map();
    }

    call(path: (string | number | symbol)[], args: any[], callback: (...args: any) => any) {
        const worker_idx = this.workers.map(((w, iw) => [w, iw] as [WorkerData<T>, number])).filter(([w, iw]) => !w.is_busy)[0];

        if (worker_idx === undefined) {
            this.enqueue(path, args, callback);
        }
        else {
            const [worker, iw] = worker_idx;
            const dequeueAndStart = () => {
                if (this.queueSize(path) > 0) {
                    const queue_data = this.dequeue(path);
                    if (queue_data === undefined) return;

                    this.startRun(worker, path, queue_data.args).then(queue_data.callback).then(dequeueAndStart);
                }
            }

            this.startRun(worker, path, args).then(callback).then(dequeueAndStart);
        }
    }

    private enqueue(path: (string | number | symbol)[], args: any[], callback: (...args: any) => any) {
        const path_str = path.join(".");
        const old_queue = this.queue.get(path_str);
        const new_queue = old_queue ? old_queue : [];
        new_queue.push({args: args, callback: callback});
        this.queue.set(path_str, new_queue);
    }

    private dequeue(path: (string | number | symbol)[]) {
        const path_str = path.join(".");
        const queue = this.queue.get(path_str);
        if (!queue) {
            return undefined;
        }

        const elem = queue.shift();

        this.queue.set(path_str, queue);
        return elem;
    }

    private queueSize(path: (string | number | symbol)[]) {
        const path_str = path.join(".");
        const queue = this.queue.get(path_str);

        if (!queue) {
            return 0;
        }

        return queue.length;
    }

    private async startRun(worker: WorkerData<T>, path: (string | number | symbol)[], args: any[]) {
        let rem = worker.worker as any;
        path.forEach(p => rem = rem[p]);

        worker.is_busy = true;
        const ret = await rem(...args);
        worker.is_busy = false;
        return ret;
    }
}

function createProxy<T>(pool: WorkerPool_<T>, path: (string | number | symbol)[], target: object) : any {
    const proxy = new Proxy(target, {
        get(tgt, prop: string | number | symbol) {
            return createProxy(pool, [...path, prop], () => {});
        },
        apply(tgt, this_arg, func_args) {
            return new Promise((resolve, reject) => pool.call(path, func_args, resolve));
        }
    });

    return proxy;
}

type Promisify<T> = (T extends (...args: infer TArguments) => infer TReturn
      ? (...args: TArguments) => Promise<TReturn>
      : unknown);

type WorkerPool<T> = {[K in keyof T]: Promisify<T[K]>};

function createWorkerPool<T>(workers: Worker[]) : WorkerPool<T> {
    const pool = new WorkerPool_<T>(workers);

    return createProxy(pool, [], () => {}) as WorkerPool<T>;
}

export {createWorkerPool};
export type {WorkerPool};