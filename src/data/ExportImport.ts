import type { MyTask } from "./MyTask"
import type { TMyTaskQueue } from "./TMyTaskQueue";

export class ExportImport<T extends MyTask> {
    uploadFileCallback: any = null;
    input: HTMLInputElement;
    download: HTMLAnchorElement;

    constructor(private taskCtor: { new(...args: any[]): T; }) {
        // 创建一个a标签用于下载
        this.download = document.createElement('a');
        this.download.style.display = 'none';
        document.body.appendChild(this.download);
        // 创建一个input标签用于上传
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'file');
        this.input.setAttribute('accept', '.json');
        this.input.style.display = 'none';
        this.input.addEventListener('change', (event: any) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const contents = e.target.result;
                // 这里可以使用文件的内容
                console.log(contents);
                if (this.uploadFileCallback != null) {
                    this.uploadFileCallback(contents);
                }
            };
            reader.onerror = (e: any) => {
                console.error("文件读取出错:", e.target.error);
            };
            reader.readAsText(file);
        });
    }

    ToJson(queue: any): string {
        let obj: any = {};
        obj.startTime = queue.startTime.toString();
        obj.tasks = [];
        let i = 0;
        for (; i < queue.tasks.length; ++i) {
            let task = queue.tasks[i];
            let ot: any = {};
            ot.createId = task.createId;
            ot.title = task.title;
            ot.desc = task.desc;
            ot.color = task.color;
            ot.duration = task.duration;
            ot.forceWork = task.forceWork;
            ot.offset = task.offset;
            obj.tasks.push(ot);
        }
        return JSON.stringify(obj, null, 4);
    }

    FromJson(json: string, refQueue: any) {
        let obj = JSON.parse(json);
        // 粗略检查一下数据格式
        if (obj.startTime == null || obj.tasks == null || obj.tasks.length <= 0) {
            console.error(obj);
            return;
        }
        else {
            let one = obj.tasks[0];
            if (one == null || one.createId == null || one.title == null || one.duration == null) {
                console.error(obj);
                return;
            }
        }
        //
        refQueue.value.Clear();
        refQueue.value.SetStartTime(new Date(obj.startTime));
        let i = 0;
        for (; i < obj.tasks.length; ++i) {
            let ot: any = obj.tasks[i];
            let task = new this.taskCtor(ot.createId, ot.title, ot.desc);
            task.color = ot.color;
            task.duration = ot.duration;
            task.forceWork = ot.forceWork;
            task.offset = ot.offset;
            refQueue.value.AddTaskExt(task);
        }
    }

    DownloadFile(filename: string, text: string) {
        this.download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        this.download.setAttribute('download', filename);
        // 触发下载
        this.download.click();
    }

    UploadFile(callback: any) {
        this.uploadFileCallback = callback;
        this.input.click();
    }
}