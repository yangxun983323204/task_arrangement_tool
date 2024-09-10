import { MyTask } from "./MyTask";

export class MyTaskVO extends MyTask {

    get id():string{
        return this.createId.toString();
    }

    get start(): Date {
        //console.log('task begin:' + this.GetStartDay().format("YYYY-MM-DD"));
        return this.GetStartDay().toDate();
    }

    get end(): Date {
        //console.log('task end:' + this.GetStopDay().format("YYYY-MM-DD"));
        return this.GetStopDay().toDate();
    }
}