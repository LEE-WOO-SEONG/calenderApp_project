// let schedules = [];
// // function
// // scheduleRender
// // 현재의 월을 인수로 받아야함
// function schedulesRender() {
//   // rander를 담당하는 변수
//   const _schedules = schedules;
//   console.log(_schedules);
//   // 토요일이 있는지 확인
//   function searchSaturday() {
//     const saturday = [];
//     const $monthYear = document.querySelector('.month-year');
//     const year = +$monthYear.textContent.substring(0, 4);
//     const month = $monthYear.textContent.substring(6, 7);
//     const newDay = new Date(year, month - 1);
//     const firstSaturday = 7 - newDay.getDay();
//     let saturdaySchedules = [];
//     // 첫 토요일
//     for (let i = 0; i < 4; i++) {
//       if (firstSaturday + i * 7 < 30) {
//         saturday.push(firstSaturday + i * 7);
//       }
//     }
//     console.log(saturday);
//     // 토요일들을 구함
//     for (let i = 0; i < saturday.length; i++) {
//       saturdaySchedules = schedules.filter(schedule => {
//         const from = +schedule.from.substring(6, 8);
//         const to = +schedule.to.substring(6, 8);
//         return from < saturday[i] && to > saturday[i];
//       });
//     }
//     // 토요일이 있으면 새로 만듦
//     function craeteSaturdaySchedules() {
//       saturdaySchedules.forEach(schedule => {
//         for (let i = 0; i <= saturday.length; i++) {
//           const from = +schedule.from.substring(6, 8);
//           const to = +schedule.to.substring(6, 8);
//           if ((from <= saturday[i] && to >= saturday[i]) || saturday[i] === undefined) {
//             if (i === 0) {
//               _schedules.push({
//                 id: schedule.id,
//                 from: schedule.from,
//                 to: saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i],
//                 title: schedule.title,
//                 memo: schedule.memo,
//                 length: (saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i]) - schedule.from
//               });
//             } else if (!(saturday[i - 1] < to && saturday[i] === undefined ? 32 : saturday[i] > to)) {
//               console.log(saturday[i], 'saturday[i]');
//               _schedules.push({
//                 id: schedule.id,
//                 from: saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1),
//                 to: saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i],
//                 title: schedule.title,
//                 memo: schedule.memo,
//                 length: (saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i]) - (saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1))
//               });
//             } else {
//               console.log('[확인]', saturday[i]);
//               _schedules.push({
//                 id: schedule.id,
//                 from: saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1),
//                 to: schedule.to,
//                 title: schedule.title,
//                 memo: schedule.memo,
//                 length: schedule.to - (saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1))
//               });
//             }
//           }
//         }
//         console.log('_schedules.indexOf(schedule)', _schedules.indexOf(schedule));
//         _schedules.slice(_schedules.indexOf(schedule), 1);
//       });
//     }
//     console.log(saturdaySchedules);
//     craeteSaturdaySchedules();
//     console.log('_schedules', _schedules);
//     console.log('schedules', schedules);
//   }
//   searchSaturday();
//   // length값으로 sort
//   function compare(length) {
//     return (a, b) => (a[length] < b[length] ? 1 : a[length] > b[length] ? -1 : 0);
//   }
//   _schedules.sort(compare('length'));
//   // dep 조정
//   function schedulesOrder() {
//     let dep = 0;
//     for (let i = 0; i < _schedules.length; i++) {
//       if (i === 0) {
//         render(_schedules[i]);
//       } else {
//         for (let k = 1; k < i + 1; k++) {
//           if (_schedules[i - k].from <= _schedules[i].from && _schedules[i].from <= _schedules[i - k].to) {
//             ++dep;
//           }
//         }
//         console.log('[dep조정]', dep, _schedules[i]);
//         render(_schedules[i], dep);
//         dep = 0;
//       }
//     }
//   }
//   // render
//   function render(schedule, dep) {
//     if (!document.getElementById(`${schedule.from}`)) return;
//     const $inner = document.getElementById(`${schedule.from}`);
//     $inner.querySelector('.schedule-inner-container').innerHTML += `<div id="${schedule.id}" class="schedule-list" role="button">${
//       schedule.title}<span class="schedule-id>${schedule.id}</span></div>`;
//     document.getElementById(`${schedule.id}`).style.width = `${95 * (schedule.length + 1)}%`;
//     document.getElementById(`${schedule.id}`).style.transform = `translateY(${dep * 110}%)`;
//   }
//   schedulesOrder();
// }
// // traffic
// // 2. 토큰과 match된 user의 정보를 반환.
// // 3. render를 담당하는 SchedulesRender에 인수로 schedules를 배열로 받음
// async function getUser() {
//   try {
//     const response = await axios.get(`/users/${localStorage.getItem('userTk')}/schedules`);
//     schedules = response.data;
//     schedulesRender();
//   } catch (error) {
//     console.error(error);
//   }
// }
