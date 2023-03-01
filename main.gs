function main() {
  const calendarId = 'xxxxxxxxxxxxxx';
  const calendar = CalendarApp.getCalendarById(calendarId);
  
  let now = new Date();
  let next = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59);
  const showDay = 3;

  const arrayMsg = ['----近三天行程----\r\n'];
  for(let i = 0; i < showDay; i++) {
    const events = calendar.getEvents(now,next);
    if(events.length) {
      arrayMsg.push(`\r\n${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}\r\n`);
      events.forEach((event,index)=>{
        const eventTime = new Date(event.getStartTime());
        let hour = eventTime.getHours();
        hour = hour < 10 ? `0${hour}` : hour;
        let minute = eventTime.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;
        arrayMsg.push(`[${(index * 1 + 1)}] ${hour}:${minute} ${ event.getTitle()}\r\n`);
      });
    }
    now.setDate(now.getDate() + 1);
    now.setHours(0,0,0);
    next.setDate(next.getDate() + 1);
  }

  arrayMsg.push('\r\n\r\n----待辦事項----\r\n');
  const todoMsg = getSendContent();
  if(todoMsg){
    arrayMsg.push(`${todoMsg}\r\n`);
    LineNotifyLib.send(`\r\n\r\n${arrayMsg.join("").trim("\r\n")}`,'your notify secret');
  }
}


function getSendContent(){
  const arr = [];
  /*get all list */
  const taskLists = Tasks.Tasklists.list();
  if(taskLists.items){
    taskLists.items.forEach((list,index)=>{
      arr.push(`[${index+1}] ${list.title === '我的工作' ? '雜項': list.title}\r\n${getListContent(list.id)}\r\n`);
    })
  }
  return arr.join("").trim("\r\n");
}

function getListContent(id){
  const array = [];
  const tasks = Tasks.Tasks.list(id).getItems();
  if(tasks){
    tasks.forEach(todo => array.push(`-- ${todo.title}\r\n`))
  }
  return array.join("").trim("\r\n");
}
