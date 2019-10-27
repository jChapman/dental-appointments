import moment from 'moment'

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

export default makeDummyEvents;

