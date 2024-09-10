<script setup lang="ts">
import { ref, provide } from 'vue'
import MyCalendar from './components/MyCalendar.vue';
import MyEventList from './components/MyEventList.vue';
import { MyTask } from '@/data/MyTask';
import { TMyTaskQueue } from '@/data/TMyTaskQueue';
import { MyTaskVO } from '@/data/MyTaskVO';
import MyEventEdit from './components/MyEventEdit.vue';
import { ExportImport } from './data/ExportImport';

let taskQueue = ref(new TMyTaskQueue<MyTaskVO>(MyTaskVO));
provide('taskQueue', taskQueue);

let showEventEdit = ref(false);
let editorLeft = ref(10);
let editorTop = ref(10);
let currTask = ref();

function OnTaskClick(task, event) {
    currTask.value = task;
    editorLeft.value = event.pageX + 30;
    editorTop.value = event.pageY;
    showEventEdit.value = true;
}

function CloseTaskEditor() {
    showEventEdit.value = false;
}

let saveload = new ExportImport(MyTaskVO);
function ExportJson(){
    let json = saveload.ToJson(taskQueue.value);
    saveload.DownloadFile("tasks.json", json);
}
function ImportJson(){
    saveload.UploadFile((text:any)=>{
        saveload.FromJson(text, taskQueue);
    });
}
</script>

<template>
    <div v-if="showEventEdit">
        <MyEventEdit :left=editorLeft :top=editorTop v-click-outside="CloseTaskEditor" :event=currTask></MyEventEdit>
    </div>
    <v-layout class="rounded rounded-md">
        <v-app-bar class="elevation-1">
            <v-app-bar-title>任务排期工具</v-app-bar-title>
            导入
            <v-icon icon="mdi-file-upload-outline" @click="ImportJson"></v-icon>
            &nbsp;&nbsp;&nbsp;&nbsp;
            导出
            <v-icon icon="mdi-file-download" @click="ExportJson"></v-icon>
            &nbsp;&nbsp;&nbsp;&nbsp;
        </v-app-bar>

        <v-navigation-drawer>
            <MyEventList @on-task-click="OnTaskClick">
            </MyEventList>
        </v-navigation-drawer>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <MyCalendar>
            </MyCalendar>
        </v-main>
    </v-layout>
</template>