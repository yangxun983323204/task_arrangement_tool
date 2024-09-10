<script setup lang="ts">
import { ref, type Ref, inject } from 'vue'
import draggable from 'vuedraggable'
import { MyTask } from '@/data/MyTask';
import { TMyTaskQueue } from '@/data/TMyTaskQueue';
import { MyTaskVO } from '@/data/MyTaskVO';
import moment from 'moment';
import MyEventEdit from './MyEventEdit.vue';

defineEmits(['on-task-click'])
let showTimePicker = ref(false);
let taskQueue: Ref<TMyTaskQueue<MyTaskVO>> | undefined = inject('taskQueue')

function AddTask() {
    taskQueue?.value.AddTask();
}
function RemoveTask(t: MyTaskVO) {
    taskQueue?.value.RemoveTask(t);
}
function Clear() {
    taskQueue?.value.Clear();
}
function OnChange(e) {
    //window.console.log(e.draggedContext.index+"->" + e.draggedContext.futureIndex);
    if (taskQueue == undefined)
        return;

    // log
    /*for (var i = 0; i < taskQueue?.value.tasks.length; ++i) {
        let task = taskQueue?.value.tasks[i];
        console.log(task.title);
    }*/
    //
    taskQueue?.value.RecalcAllTaskTime();
}
function SetStartTime(e: Date) {
    console.log(e);

    taskQueue?.value.SetStartTime(e);
    showTimePicker.value = false;
}
function ToggleTimePicker() {
    showTimePicker.value = !showTimePicker.value;
}
function HideTimePicker() {
    showTimePicker.value = false;
}
</script>

<template>
    <v-btn @click="AddTask">添加任务</v-btn>
    <v-btn @click="Clear">清空任务</v-btn>
    <v-divider :thickness="4"></v-divider>
    <v-btn block @click="ToggleTimePicker">起始时间: {{ moment(taskQueue?.startTime).format("YYYY-MM-DD")
        }}</v-btn>

    <v-date-picker v-if="showTimePicker" class="position-fixed" style="z-index: 1000;" @update:modelValue="SetStartTime"
        v-click-outside="HideTimePicker"></v-date-picker>

    <v-divider :thickness="4"></v-divider>
    <draggable :list="taskQueue?.tasks" class="list-group" ghost-class="ghost" @change="OnChange" @start="drag = true"
        @end="drag = true" item-key="value">
        <template #item="{ element }">
            <v-btn block class="rounded elevation-4 my-2 cursor-move" @click="$emit('on-task-click', element, $event)">
                {{ element.GetTitle() }}
                <v-icon icon="mdi-close-box-outline" @click.stop="() => { RemoveTask(element); }"></v-icon>
            </v-btn>
        </template>
    </draggable>
</template>

<style scoped>
.buttons {
    margin-top: 35px;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.not-draggable {
    cursor: no-drop;
}
</style>