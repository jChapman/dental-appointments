import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./App.css";

const localizer = momentLocalizer(moment);

// Set up
// Reserve lunch every day, let's just reserve the past 7 days and next 30 days
function makeDummyEvents() {
  let events = [];
  let workingDate = moment()
    .subtract(7, "days")
    .set("hours", 12)
    .set("minutes", 0);
  const end = moment().add(30, "days");
  while (workingDate < end) {
    events.push({
      start: new Date(workingDate),
      end: new Date(workingDate.clone().add(1, "hours")),
      title: "Lunch"
    });
    workingDate.add(1, "day");
  }

  // Let's make some fake appointments for today week...
  const makeMeeting = (hourStart, minuteStart, hourEnd, minuteEnd, title) => {
    const start = new Date(moment().add(1, "day"));
    start.setHours(hourStart, minuteStart, 0, 0);
    const end = new Date(moment().add(1, "day"));
    end.setHours(hourEnd, minuteEnd, 0, 0);
    const meeting = {
      start,
      end,
      title
    };
    events.push(meeting);
  };
  makeMeeting(8, 0, 10, 0, "Morning Meeting");
  // 45 minute block here
  makeMeeting(10, 45, 11, 45, "Firing Dan");
  // 15 minute block before lunch
  // 1 hour block after lunch
  makeMeeting(15, 0, 16, 40, "Doin stuff");
  // 20 minutes until 5

  return events;
}

// Get current week
// Filter events not in this week or before now
// Find a slot with the given time after the current date


const startOfWeekFromMoment = mom => {
  return mom
    .startOf("isoweek")
    .set("hours", 7)
    .set("minutes", 59);
};

const customSlotPropGetter = event => {
  if (event.temp)
    return { className: "temp-event" }
  return {}
}


class Scheduler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: makeDummyEvents(),
      startOfWeek: startOfWeekFromMoment(moment().add(1, "day")),
      schedulingEventLength: 0
    };
  }

  handleOnNaviage = newDate => {
    this.setState({
      startOfWeek: startOfWeekFromMoment(moment(newDate))
    });
  };

  clearTemp = ()=> {
    this.setState({
      events: this.state.events.filter((event) => !event.temp)
    });
  }

  findCandidateTimes = durationInMinutes => {
    let currentTime = this.state.startOfWeek;
    if (currentTime < moment())
      currentTime = moment().set(
        "minutes",
        Math.ceil(moment().get("minutes") / 5) * 5
      ); // Skip to the closest 5 minutes in the future
    let blocks = [];
    while (currentTime.get("day") < 6) {
      let endOfDay = currentTime
        .clone()
        .set("hours", 17)
        .set("minutes", 0);
      let nextEvent = { start: endOfDay, end: endOfDay };
      // Find the next appointment TODO: should just order the appts so we don't have to search ever time
      for (let event of this.state.events) {
        let movent = moment(event.start);
        if (
          movent.isSame(currentTime, "day") &&
          movent > currentTime &&
          movent <= moment(nextEvent.start)
        ) {
          nextEvent = event;
        }
      }
      if (
        moment(nextEvent.start).diff(currentTime, "minutes") >=
        durationInMinutes
      ) {
        blocks.push({
          start: new Date(currentTime),
          end: new Date(nextEvent.start)
        });
      }
      currentTime = moment(nextEvent.end);
      if (currentTime.get("hours") >= 17)
        currentTime = currentTime
          .add(1, "day")
          .set("hours", 8)
          .set("minutes", 0);
    }
    return blocks;
  };

  scheduleThing = (title, duration) => {
    let blocks = this.findCandidateTimes(duration);
    this.setState(oldState => ({
      events: oldState.events.concat(blocks.map(({start, end}) => ({start, end, title: "Click to schedule", temp: true}))),
      schedulingEventLength: duration,
      schedulingEventTitle: title
    }));

  }

//Cleanings, which take 30 minutes
  scheduleCleaning = () => {
    this.scheduleThing("Cleaning", 30)
  };

//Fillings, which take 1 hour
  scheduleFilling = () => {
    this.scheduleThing("Filling", 60)
  };

//Root Canals, which take 1 hour and 30 minutes.
  scheduleRoot = () => {
    this.scheduleThing("Root Canal", 90)
  };

  selectEvent = (event) => {
    if (!event.temp)
      return
    let scheduledEvent = {
      start: new Date(event.start),
      end: new Date(moment(event.start).add(this.state.schedulingEventLength, "minutes")),
      title: this.state.schedulingEventTitle
    };
    console.log(scheduledEvent)
    this.setState(({events})=> ({events: events.filter(event => !event.temp).concat([scheduledEvent])}))
  }

  render = () => {
    return (
      <div className="App" height="20px">
        <h1>Dental Scheduler</h1>
        <button onClick={this.scheduleCleaning}>Schedule Cleaning</button>
        <button onClick={this.scheduleFilling}>Schedule Filling</button>
        <button onClick={this.scheduleRoot}>Schedule Root Canal</button>
        <Calendar
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WORK_WEEK}
          views={[Views.WORK_WEEK]}
          onNavigate={this.handleOnNaviage}
          onSelectEvent={this.selectEvent}
          eventPropGetter={customSlotPropGetter}
        />
      </div>
    );
  };
}

export default Scheduler;
