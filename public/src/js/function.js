/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
let schedules = [];

// function

// scheduleRender
function schedulesRender() {
  // 토요일이 있는지 확인
  // function checksaturday() {
  //   const saturday = [];
  // }

  // length값으로 sort
  function compare(length) {
    return (a, b) => (a[length] < b[length] ? 1 : a[length] > b[length] ? -1 : 0);
  }
  schedules.sort(compare('length'));
  console.log(schedules);
  // dep 조정
  function schedulesOrder() {
    let dep = 0;
    for (let i = 0; i < schedules.length; i++) {
      if (i === 0) {
        render(schedules[i]);
      } else {
        for (let k = 1; k < i + 1; k++) {
          if (schedules[i - k].from <= schedules[i].from && schedules[i].from <= schedules[i - k].to) {
            ++dep;
          }
        }
        console.log('[dep조정]', dep, schedules[i]);
        render(schedules[i], dep);
        dep = 0;
      }
    }
  }

  // 6. render
  function render(schedule, dep) {
    // console.log(schedule, dep);
    if (!document.getElementById(`${schedule.from}`)) return;
    const $inner = document.getElementById(`${schedule.from}`);
    $inner.querySelector('.schedule-inner-container').innerHTML += `<div id="${schedule.id}" class="schedule-list" role="button">${
      schedule.title}<span class="schedule-id>${schedule.id}</span></div>`;
    document.getElementById(`${schedule.id}`).style.width = `${95 * (schedule.length + 1)}%`;
    document.getElementById(`${schedule.id}`).style.transform = `translateY(${dep * 110}%)`;
  }
  schedulesOrder();
}

// traffic
// 2. 토큰과 match된 user의 정보를 반환.
// 3. render를 담당하는 SchedulesRender에 인수로 schedules를 배열로 받음
async function getUser() {
  try {
    const response = await axios.get(`/users/${localStorage.getItem('userTk')}/schedules`);
    schedules = response.data;
    schedulesRender();
  } catch (error) {
    console.error(error);
  }
}

// event
// 1. 토큰이 들어오면
window.addEventListener('load', () => {
  getUser();
});
