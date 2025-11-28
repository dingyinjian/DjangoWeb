<template>
    <div class="calendar">
        <!-- Header -->
        <header>{{ currentMonthName }} {{ currentYear }}</header>

        <!-- Days of the week -->
        <div class="days-of-week">
            <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
        </div>

        <!-- Calendar body -->
        <div class="calendar-body">
            <div v-for="(week, index) in calendar" :key="index" class="week">
                <span v-for="date in week" :key="date.timestamp" :class="{
                    'current-date': date.isCurrentDate,
                    'other-month': date.isOtherMonth,
                    'selected': selectedDate && selectedDate.timestamp === date.timestamp
                }" @click="selectDate(date)">
                    {{ date.day }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth());
const selectedDate = ref(null);

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentMonthName = computed(() => monthNames[currentMonth.value]);

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function createCalendar(year, month) {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    let calendar = [];
    let week = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
        week.push({ day: '', timestamp: null, isOtherMonth: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        week.push({
            day,
            timestamp: date.getTime(),
            isCurrentDate:
                date.getFullYear() === new Date().getFullYear() &&
                date.getMonth() === new Date().getMonth() &&
                date.getDate() === new Date().getDate(),
            isOtherMonth: false
        });

        if ((firstDayOfMonth + day) % 7 === 0 || day === daysInMonth) {
            calendar.push(week);
            week = [];
        }
    }

    return calendar;
}

const calendar = computed(() => createCalendar(currentYear.value, currentMonth.value));

function selectDate(date) {
    if (!date.isOtherMonth) {
        selectedDate.value = date;
    }
}
</script>

<style scoped>
.calendar {
    padding: 5px;
    margin: auto;
    font-family: Arial, sans-serif;
    color: #666666;
    background-color: #ffffff0d;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ffffff1a;
}

.calendar header {
    padding: 15px;
    text-align: center;
    color: #ffffff;
    /* background-color: #31313a; */
    border-bottom: 1px solid #22222a;
}

.days-of-week span {
    display: inline-block;
    width: 14.28%;
    text-align: center;
    padding: 10px 0;
    color: #cccccc;
}

.calendar-body .week {
    display: flex;
}

.calendar-body .week span {
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14.28%;
    padding: 6px 0;
    cursor: pointer;
    transition: all 0.2s ease;
}

.calendar-body .week span.current-date {
    background-color: #31313a;
    color: #ffffff;
}

.calendar-body .week span.other-month {
    color: #cccccc;
}

.calendar-body .week span:hover,
.calendar-body .week span.selected {
    background-color: #44444e;
    color: #ffffff;
}
</style>