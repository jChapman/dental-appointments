import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./App.css";
import makeDummyEvents from './dummyData'

const localizer = momentLocalizer(moment);

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
      schedulingEventLength: 0,
      schedulingEventTitle: '',
      currentlyScheduling: false
    };
  }

  handleOnNaviage = newDate => {
    this.setState({
      startOfWeek: startOfWeekFromMoment(moment(newDate))
    });
    this.clearTemp();
    this.scheduleThing(this.state.schedulingEventTitle, this.state.schedulingEventLength);
  };

  clearTemp = () => {
    this.setState({
      events: this.state.events.filter(event => !event.temp)
    });
  };

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
          movent >= currentTime &&
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
      events: oldState.events.concat(
        blocks.map(({ start, end }) => ({
          start,
          end,
          title: "Click to schedule",
          temp: true
        }))
      ),
      schedulingEventLength: duration,
      schedulingEventTitle: title,
      currentlyScheduling: true
    }));
  };

  //Cleanings, which take 30 minutes
  scheduleCleaning = () => {
    this.scheduleThing("Cleaning", 30);
  };

  //Fillings, which take 1 hour
  scheduleFilling = () => {
    this.scheduleThing("Filling", 60);
  };

  //Root Canals, which take 1 hour and 30 minutes.
  scheduleRoot = () => {
    this.scheduleThing("Root Canal", 90);
  };

  stopScheduling = () => {
    this.clearTemp();
    this.setState({ currentlyScheduling: false });
  };

  selectEvent = event => {
    if (!event.temp) return;
    let scheduledEvent = {
      start: new Date(event.start),
      end: new Date(
        moment(event.start).add(this.state.schedulingEventLength, "minutes")
      ),
      title: this.state.schedulingEventTitle
    };
    this.setState(({ events }) => ({
      events: events.filter(event => !event.temp).concat([scheduledEvent]),
      currentlyScheduling: false
    }));
  };

  render = () => {
    return (
      <div className="App" height="20px">
        <h1>Dental Scheduler</h1>
        {!this.state.currentlyScheduling && (
          <div>
            <button onClick={this.scheduleCleaning}>Schedule Cleaning</button>
            <button onClick={this.scheduleFilling}>Schedule Filling</button>
            <button onClick={this.scheduleRoot}>Schedule Root Canal</button>
          </div>
        )}
        {this.state.currentlyScheduling && (
          <button onClick={this.stopScheduling}>Cancel Scheduling</button>
        )}
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
