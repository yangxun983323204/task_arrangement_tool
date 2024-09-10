<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import cnLocale from '@fullcalendar/core/locales/zh-cn'
import moment from 'moment'
import chineseDays from 'https://cdn.jsdelivr.net/npm/chinese-days/dist/index.es.js'
import { ref, type Ref, inject } from 'vue'
import type { TMyTaskQueue } from '@/data/TMyTaskQueue'
import type { MyTaskVO } from '@/data/MyTaskVO'

let taskQueue: Ref<TMyTaskQueue<MyTaskVO>> | undefined = inject('taskQueue');

let calendarOptions = ref({
    locale: cnLocale,
    height: 'auto',
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: taskQueue?.value.tasks,

    dayCellClassNames: (arg) => {
        let dateStr = moment(arg.date).format("YYYY-MM-DD");
        let dayInfo = chineseDays.getDayDetail(dateStr);
        if (dayInfo.work) {
            if (dayInfo.name.split(',').length <= 1)
                return ['xc-workday'];
            else
                return ['xc-workday-extra'];
        }
        else
            return ['xc-noworkday'];
    },
})

// https://github.com/vsme/chinese-days



function dayInfo(arg) {
    let dateStr = moment(arg.date).format("YYYY-MM-DD");
    let dayInfo = chineseDays.getDayDetail(dateStr);
    let nameArray: string[] = dayInfo.name.split(",");

    let dayContent = "";
    if (nameArray.length > 1) {
        dayContent += nameArray[1];
    }

    if (dayContent.length > 0 && dayInfo.work) {
        dayContent += "补班";
    }

    if (dayContent.length > 0) {
        dayContent += "  ";
    }

    dayContent += arg.date.getDate() + "日";
    return dayContent;
};

</script>

<template>
    <FullCalendar :options='calendarOptions'>
        <template v-slot:dayCellContent="arg">
            {{ dayInfo(arg) }}
        </template>
        <template v-slot:eventContent="arg">
            <b style="text-shadow:0px 0px 1px #000000FF">{{ taskQueue?.FindById(arg.event.id)?.GetShortInfo()}}</b>
        </template>
    </FullCalendar>
</template>

<style scoped>
:deep(.fc-toolbar-title) {
    color: rgb(60, 64, 67);
    font-weight: normal;
}

:deep(.fc-col-header-cell-cushion) {
    color: rgb(60, 64, 67);
    font-weight: normal;
}

:deep(.fc-daygrid-day-number) {
    color: rgb(60, 64, 67)
}

:deep(.fc-col-header-cell) {
    background-color: lightblue;
}

:deep(.xc-workday) {
    background-color: white;
}

:deep(.xc-workday-extra) {
    background-color: orange;
}

:deep(.xc-noworkday) {
    background-color: lightgray;
}
</style>