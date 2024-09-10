<script setup lang="ts">
import { MyTask } from '@/data/MyTask';
import { computed, inject, ref, type Ref } from 'vue';

const props = defineProps({
    left: ref(Number),
    top: ref(Number),
    event: ref(MyTask)
})

let styleObj = computed(() => {
    return {
        'z-index': 10000,
        'position': 'fixed',
        'width': '500px',
        'margin-left': props.left + 'px',
        'margin-top': props.top + 'px',
    };
});

let showColorPicker = ref(false);
</script>

<template>
    <v-card title="任务详情" rounded :style="styleObj" :elevation=20>
        <v-text-field label="标题" v-model="event.title" hide-details></v-text-field>
        <v-text-field label="描述" v-model="event.desc" placeholder="请输入任务描述" hide-details></v-text-field>
        <v-btn :color="event.color" @click="showColorPicker=!showColorPicker">选择颜色</v-btn>
        <v-color-picker v-if="showColorPicker" hide-inputs v-model="event.color"></v-color-picker>
        <v-text-field label="任务天数" v-model.number="event.duration" type="number" hide-details></v-text-field>
        <v-switch color="primary" v-model="event.forceWork" :label="`是否在休息日劳动:${event.forceWork}`"></v-switch>
        <v-text-field label="任务起始偏移天数" v-model.number="event.offset" type="number" hide-details></v-text-field>

        <div><i disabled style="padding-left:10px; color:#000000DE;">开始时间:{{ event?.GetStartDay().format('YYYY-MM-DD') }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">结束时间:{{ event?.GetStopDay().format("YYYY-MM-DD") }}</i></div>
        <div><i disabled style="padding-left:10px; color:#000000DE;">createId:{{ event?.createId }}</i></div>
    </v-card>
</template>