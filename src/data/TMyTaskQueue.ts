import moment from "moment";
import { MyTask } from "./MyTask";

export class TMyTaskQueue<T extends MyTask> {
    startTime: Date;
    tasks: T[] = [];

    __genId: number = 0;

    constructor(private taskCtor: { new(...args: any[]): T; }) {
        let now = new Date();
        let m = moment(now);
        this.startTime = m.startOf('hour').hour(8).toDate();
        //console.log(this.startTime);
    }

    SetStartTime(start: Date): void {
        let m = moment(start);
        this.startTime = m.startOf('hour').hour(8).toDate();
        //console.log(this.startTime);
        this.RecalcAllTaskTime();
    }

    AddTask() {
        let str = "新建任务" + (this.__genId + 1);
        let node = new this.taskCtor(this.__genId, str, "");
        node.duration = 2;
        node.SetRandomColor();
        this.AddTaskExt(node);
    }

    AddTaskExt(task: T) {
        this.__genId = Math.max(this.__genId, task.createId);
        ++this.__genId;
        this.tasks.push(task);
        this.RecalcTaskTimeInner(this.tasks.length - 1);
        task.onChangeEvent = this.OnTaskChangeCallback.bind(this);
    }

    OnTaskChangeCallback(inst: MyTask) {
        let i = this.tasks.indexOf(inst as T);
        if (i < 0)
            return;
        ++i;
        if (i >= this.tasks.length)
            return;

        this.RecalcTaskTimeInner(i);
    }

    RemoveTask(val: T) {
        let i = this.tasks.indexOf(val);
        if (i >= 0) {
            this.tasks.splice(i, 1);
            this.RecalcTaskTimeInner(i);
        }
    }

    Clear() {
        this.tasks.splice(0, this.tasks.length);
        this.__genId = 0;
    }

    RecalcTaskTime(node: T): void {
        let i = this.tasks.indexOf(node);
        this.RecalcTaskTimeInner(i);
    }

    RecalcAllTaskTime(): void {
        this.RecalcTaskTimeInner(0);
    }

    FindById(id: number): T | undefined {
        let e = this.tasks.find((v: T) => { return v.createId == id; });
        return e;
    }

    private RecalcTaskTimeInner(fromIdx: number): void {
        if (this.tasks.length <= 0)
            return;

        if (fromIdx < 0 || fromIdx >= this.tasks.length) {
            console.warn(fromIdx + "不在任务队列范围内");
            return;
        }

        let day = moment(this.GetLastDay(fromIdx));
        let idx = fromIdx;
        for (; idx < this.tasks.length; ++idx) {
            let task = this.tasks[idx];
            let tmpStart = moment(day);
            tmpStart.add(1, 'd');
            //console.log('SetStartDay:' + tmpStart.format("YYYY-MM-DD"));
            task.SetStartDay(tmpStart.toDate(), true);
            let taskLast = task.GetStopDay();
            //console.log('GetStopDay:' + taskLast.format("YYYY-MM-DD"));
            if (taskLast > day) {
                day = taskLast;
            }
        }
    }

    // 获取前num项任务的最晚完成时间
    GetLastDay(num: number): Date {
        let last = moment(this.startTime).add(-1, 'd');
        let i = 0;
        for (; i < num; ++i) {
            let nodeLast = this.tasks[i].GetStopDay();
            if (nodeLast > last) {
                last = nodeLast;
            }
        }
        //console.log('GetLastDay:' + last.format("YYYY-MM-DD"));

        return last.toDate();
    }
}