import moment from "moment";
import chineseDays from 'https://cdn.jsdelivr.net/npm/chinese-days/dist/index.es.js'

export type MyTaskCallback = (inst: MyTask) => void;

export class MyTask {
    createId: number;
    title: string;
    desc: string = "";
    color: string = "green";

    onChangeEvent: MyTaskCallback = (v) => { };

    // 任务天数
    private _duration: number = 1;
    get duration(): number {
        return this._duration;
    }
    set duration(val: number) {
        this._duration = val;
        this.Recalc();
    }

    // 是否允许在休息日进行任务
    private _forceWork: boolean = false;
    get forceWork(): boolean {
        return this._forceWork;
    }
    set forceWork(val: boolean) {
        this._forceWork = val;
        this.Recalc();
    }

    // 任务时间偏移
    private _offset: number = 0;
    get offset(): number {
        return this._offset;
    }
    set offset(val: number) {
        this._offset = val;
        this.Recalc();
    }

    __wantStart: Date = new Date();
    __dynamicStart: Date = new Date();

    constructor(inId: number, inTitle: string, inDesc: string) {
        this.createId = inId;
        this.title = inTitle;
        this.desc = inDesc;
        this.Recalc();
    }

    // 设置任务开始时间，内部会考虑偏移
    SetStartDay(wantStart: Date, mute: boolean = false) {
        this.__wantStart = wantStart;
        let want = moment(wantStart);
        want.add(this._offset, 'd');
        if (!this.forceWork) {
            MyTask.NextToWorkday(want);
        }
        this.__dynamicStart = want.toDate();
        if (!mute) {
            this.onChangeEvent(this);
        }
    }

    Recalc() {
        this.SetStartDay(this.__wantStart);
    }

    GetStartDay(): moment.Moment {
        return moment(this.__dynamicStart);
    }

    GetStopDay(): moment.Moment {
        if (this._duration < 1)
            this._duration = 1;

        let stopDay = moment(this.__dynamicStart);
        stopDay.add(-1, 'd');
        let i = 0;
        for (; i < this._duration;) {
            stopDay.add(1, 'd');
            if (!this._forceWork) {
                MyTask.NextToWorkday(stopDay);
            }
            ++i;
        }

        return stopDay;
    }

    // 向后移动到工作日
    static NextToWorkday(m: moment.Moment) {
        while (!chineseDays.getDayDetail(m.format("YYYY-MM-DD")).work) {
            m.add(1, 'd');
        }
    }

    SetRandomColor() {
        this.color = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    }

    GetTitle():string{
        let s = '';
        if (this.forceWork) {
            s += '[急]'
        }
        s += `${this.title}`;
        return s;
    }

    GetShortInfo(): string {
        let s = '';
        if (this.forceWork) {
            s += '[急]'
        }
        s += `${this.title}    [${this.duration}天`;
        if (this.offset != 0) {
            s += `,${this.offset < 0 ? "提前" : "延后"}${Math.abs(this.offset)}天]`;
        }
        else {
            s += ']';
        }
        return s;
    }
}