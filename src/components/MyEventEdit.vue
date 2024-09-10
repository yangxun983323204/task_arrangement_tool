<script setup lang="ts">
import { MyTask } from '@/data/MyTask';
import { computed, inject, ref, type Ref } from 'vue';

const props = defineProps({
    left: ref(Number),
    top: ref(Number),
    event: ref(MyTask),
})

let styleObj = computed(() => {
    return {
        'z-index': 10000,
        'position': 'fixed',
        'width': '500px',
        'margin-left': props.left.value + 'px',
        'margin-top': props.top.value + 'px',
    };
});
</script>

<template>
    <v-sheet rounded :style="styleObj" :elevation=20>
        <v-text-field label="标题" v-model="event.title"></v-text-field>
        <v-text-field label="描述" v-model="event.desc" placeholder="请输入任务描述"></v-text-field>
        <v-btn :color="event.color">选择颜色</v-btn>
        <v-text-field label="任务天数" v-model="event.duration"></v-text-field>
        <v-switch color="primary" v-model="event.forceWork" :label="`是否在休息日劳动:${event.forceWork}`"></v-switch>
        <v-text-field label="任务起始偏移天数" v-model="event.offset"></v-text-field>

        <div><i disabled style="padding-left:10px; color:#000000DE;">开始时间:{{ event?.GetStartDay().format('YYYY-MM-DD') }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">结束时间:{{ event?.GetStopDay().format("YYYY-MM-DD") }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">createId:{{ event?.createId }}</i></div>
    </v-sheet>
</template>