import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import './App.css';

const localizer = momentLocalizer(moment)
let events = []

// Set up 
// Reserve lunch every day, let's just reserve the past 7 days and next 30 days

let workingDate = moment().subtract(7, 'days').set('hours', 12).set('minutes', 0)
const end = moment().add(30, 'days')
while (workingDate < end) {
  events.push({
    start: new Date(workingDate),
    end: new Date(workingDate.clone().add(1, "hours")),
    title: "Lunch"
  });
  workingDate.add(1, 'day')
}

// Let's make some fake appointments for today week...
const makeMeeting = (hourStart, minuteStart, hourEnd, minuteEnd, title) => {
  const start = new Date()
  start.setHours(hourStart, minuteStart, 0, 0)
  const end = new Date()
  end.setHours(hourEnd, minuteEnd, 0, 0)
  const meeting = {
    start,
    end,
    title
  };
  events.push(meeting);
};
makeMeeting(8, 0, 10, 0, "Morning Meeting");
// 45 minute block here
makeMeeting(10, 45, 11, 45, "Firing Dan")
// 15 minute block before lunch
// 1 hour block after lunch
makeMeeting(15, 0, 16, 40, "Doin stuff")
// 20 minutes until 5

// Get current week
// Filter events not in this week or before now
// Find a slot with the given time after the current date


//Cleanings, which take 30 minutes
//Fillings, which take 1 hour
//Root Canals, which take 1 hour and 30 minutes.

const startOfWeekFromMoment = (mom) => {
  return mom.startOf('isoweek')
}

let currentWeekStart = startOfWeekFromMoment(moment())

const handleOnNaviage = (newDate) => {
  currentWeekStart = startOfWeekFromMoment(moment(newDate))
};
const scheduleCleaning = () => {
  const meeting = {
    start: new Date(currentWeekStart.clone().set('hours', 8)),
    end: new Date(currentWeekStart.clone().set('hours', 8).set('minutes', 30)),
    title: "Cleaning"
  };
  console.log(meeting)
  events.push(meeting);
  console.log(events.length)
};

function App() {
  return (
    <div className="App" height="20px">
      <h1>Dental Scheduler</h1>
      <button onClick={scheduleCleaning}>Schedule Cleaning</button>
      <button>Schedule Filling</button>
      <button>Schedule Root Canal</button>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.WORK_WEEK}
        views={[Views.WORK_WEEK]}
        onNavigate={handleOnNaviage}
      />
    </div>
  );
}
//views={[Views.WEEK, Views.MONTH, Views.DAY]} />
export default App;
