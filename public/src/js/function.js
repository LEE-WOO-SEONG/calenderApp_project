/* eslint-disable no-undef */
let user = [];

// function
// scheduleRender
function schedulesRender(schedules) {
  // 4. length값으로 sort

  function compare(length) {
    return (a, b) => (a[length] < b[length] ? 1 : a[length] > b[length] ? -1 : 0);
  }
  schedules.sort(compare('length'));

  function schedulesOrder(schedules) {
    const arr = schedules;
    for (let i = 0; i < schedules.length; i++) {
      const con = arr[i];
    }
  }

  // duplicate
  // console.log(calendar);
  // function duplicate(calendar) {
  //   const dupContent = [];
  //   // console.log(calendar);
  //   for (let i = 0; i < calendar.length; i++) {
  //     const value = calendar[i].content;
  //     console.log(value);
  //     dupContent.push(value);
  //     if (dupContent.indexOf(value)) {
  //       console.log('[1]', value);
  //     }
  //   }
  //   return true;
  // }

  // duplicate(calendar);
  function render(schedule) {
    if (!document.getElementById(`${schedule.from}`)) return;
    const $inner = document.getElementById(`${schedule.from}`);
    $inner.querySelector('.schedule-inner-container').innerHTML += `<div class="schedule-list" role="button">${
      schedule.title}</div>`;
    $inner.querySelector('.schedule-list').style.width = `${95 * (schedule.length + 1)}%`;
  }

  schedulesOrder(schedules);
}

// traffic
// 2. 토큰과 match된 user의 정보를 반환.
// 3. render를 담당하는 SchedulesRender에 인수로 schedules를 배열로 받음
async function getUser() {
  try {
    const response = await axios.get('users');
    user = response.data.find(users => users.token === localStorage.getItem('userTk'));
    schedulesRender(user.schedules);
  } catch (error) {
    console.error(error);
  }
}

// event
// 1. 토큰이 들어오면
window.onload = () => {
  localStorage.setItem('userTk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Indvb3Nlb25nIiwicHciOiJkbGRudGpkIn0.63MuIIELRLur7rTsxhYr7ALe7Gy4UKVVpZZcBEjVSuk');
  getUser();
};
