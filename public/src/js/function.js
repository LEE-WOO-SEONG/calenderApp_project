let panel = []
let calendarList = [] 

function addScheduleRender(calendar){
  function compare(date){
    return (a,b)=> a[date]<b[date] ? 1 : a[date] > b[date] ? -1 : 0
  }
  calendar.sort(compare('date'))

  console.log(calendar);
  calendar.forEach(calendarData => { 
    const $inner= document.getElementById(`${calendarData.date}`);
    $inner.querySelector('.schedule-inner-container').innerHTML +=`<div class="schedule-list" role="button">${
      calendarData.content}</div>`
  });

};

async function getUser() {
    try { 
    const response = await axios.get('users');
    calendarList = response.data.find(users => users.token === localStorage.getItem("userTk"));
    addScheduleRender(calendarList.calendar);

    } catch (error) {
      console.error(error);
    }
  }

  
  window.onload = ()=>{
    localStorage.setItem("userTk", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Indvb3Nlb25nIiwicHciOiJkbGRudGpkIn0.63MuIIELRLur7rTsxhYr7ALe7Gy4UKVVpZZcBEjVSuk")
    getUser()

  }