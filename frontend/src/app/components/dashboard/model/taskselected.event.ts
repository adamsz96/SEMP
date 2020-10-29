import { OpenTask } from "./opentask";

export class TaskSelectedEvent {
    type: string; // 'select', 'unselect'
    orderId: number;
    task: OpenTask;

    constructor(type: string, orderId: number, /*taskId: number*/ task: OpenTask) {
        this.type = type;
        this.orderId = orderId;
        this.task = task;
    }
}