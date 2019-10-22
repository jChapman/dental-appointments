import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import './App.css';

const localizer = momentLocalizer(moment)

function App() {
  return (
    <div className="App" height="500px">
      <p>Dental Scheduler</p>
      <Calendar localizer={localizer} events={[]} defaultView={Views.WEEK} views={[Views.WEEK, Views.MONTH, Views.DAY]} />
    </div>
  );
}

export default App;
