let schedules = [];
let tablesClass = [];

const pageMove = url => location.replace(url);
const removeToken = () => localStorage.removeItem('userTk');

const $btnLogout = document.querySelector('.btn-logout');
const $overlay = document.querySelector('.overlay');

function Calendar() {
  this.container = document.querySelector('.container');
  this.container.classList.add('wlhs-calendar');
  this.today = new Date();
  this.currentMonth = this.today.getMonth();
  this.currentYear = this.today.getFullYear();
  this.months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  this.weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  this.nextMonth = () => {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    } else {
      this.currentMonth += 1;
    }
    this.showCalendar();
  };

  this.prevMonth = () => {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    } else {
      this.currentMonth -= 1;
    }
    this.showCalendar();
  };

  // 다음달 전체 날짜 { { date: $, type: current, id: YYYY-mm-dd }, ... }
  this.getPrevDays = (date, staDay = 0) => {
    const ret = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const days = (firstWeekday + 7) - (staDay + 7) - 1;
    for (let i = days * -1; i <= 0; i++) {
      ret.push({ date: new Date(year, month, i).getDate(), type: 'not-current', id: this.YYYYmmdd(new Date(year, month, i)) });
    }
    return ret;
  };

  // 다음달 전체 날짜 { { date: $, type: current, id: YYYY-mm-dd }, ... }
  this.getNextDays = (date, prevMonthDays, monthDays) => {
    const ret = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = 42 - (prevMonthDays.length + monthDays.length);
    for (let i = 1; i <= days; i++) {
      ret.push({ date: i, type: 'not-current', id: this.YYYYmmdd(new Date(year, month + 1, i)) });
    }
    return ret;
  };

  // 현재 전체 날짜 객체 배열 반환 [ { date: $, type: current, id: YYYY-mm-dd }, ... }
  this.getCurrentDays = date => {
    const ret = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      ret.push({ date: i, type: 'current', id: this.YYYYmmdd(new Date(year, month, i)) });
    }
    return ret;
  };

  // YYYYmmdd() = YYYY-MM-DD
  this.YYYYmmdd = date => {
    const d = new Date(date);
    const year = '' + d.getFullYear();
    const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
    const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    return [year, month, day].join('');
  };

  this.calendarHeader = () => {
    const $header = document.querySelector('#header');
    const $headerContainer = document.createElement('div');
    const $currentMonth = document.createElement('button');
    const $prevMonth = document.createElement('button');
    const $nextMonth = document.createElement('button');
    const $monthAndYear = document.createElement('h3');

    $currentMonth.classList.add('today-btn');
    $headerContainer.classList.add('calendar-header');
    $monthAndYear.classList.add('month-year');
    // $btnLogout.classList.add('api-btn');

    // $currentMonth.innerHTML = '<i class="current-month"></i>';
    $currentMonth.innerHTML = '<span class="current-month">today</span>';
    $currentMonth.onclick = () => {
      this.currentYear = new Date().getFullYear();
      this.currentMonth = new Date().getMonth();
      $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      this.showCalendar();
    };

    $prevMonth.innerHTML = '<i class="arrow prev-month"></i>';
    $prevMonth.onclick = () => {
      this.prevMonth();
      $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      schedulesRender();
    };

    $nextMonth.innerHTML = '<i class="arrow next-month"></i>';
    $nextMonth.onclick = () => {
      this.nextMonth();
      $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      schedulesRender();
    };

    $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;

    // $btnLogout.textContent = '로그아웃';

    $headerContainer.appendChild($currentMonth);
    $headerContainer.appendChild($prevMonth);
    $headerContainer.appendChild($nextMonth);
    $headerContainer.appendChild($monthAndYear);
    // $headerContainer.appendChild($btnLogout);
    $header.appendChild($headerContainer);
  };

  this.calendarBody = () => {
    // date 이번달 마지막 날짜
    const date = new Date(this.currentYear, this.currentMonth + 1, 0);
    // 이번달 이전 안쓰는 날짜 객체 배열 []
    const daysPrevMonth = this.getPrevDays(date);
    // 이번달 날짜 객체 배열 []
    const daysThisMonth = this.getCurrentDays(date);
    // 이번달 다음 안쓰는 날짜 객체 배열 []
    const daysNextMonth = this.getNextDays(date, daysPrevMonth, daysThisMonth);
    // console.log('[daysPrevMonth]', daysPrevMonth, '[daysThisMonth]', daysThisMonth, '[daysNextMonth]', daysNextMonth);
    const $weekDays = document.createElement('div');

    $weekDays.classList.add('week-days');
    for (let i = 0; i <= 6; i++) {
      $weekDays.innerHTML += `<div>${this.weekDays[i]}</div>`;
    }

    const $calendarBody = document.createElement('div');
    $calendarBody.classList.add('calendar-body');

    [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth]
      .forEach(num => {
        // 날짜의 가장 바깥 컨테이너 생성
        // 요소가 확정되면 정리할 것
        const $cell = document.createElement('div');
        $cell.setAttribute('id', num.id);
        $cell.classList.add('day');

        const $digitContainer = document.createElement('div');
        $digitContainer.setAttribute('class', 'digit-container');
        $cell.appendChild($digitContainer);

        const $day = document.createElement('span');
        $day.innerHTML = num.date;
        $digitContainer.appendChild($day);

        const $scheduleContainer = document.createElement('div');
        $scheduleContainer.setAttribute('class', 'schedule-container');
        $cell.appendChild($scheduleContainer);

        const $scheduleInnerContainer = document.createElement('div');
        $scheduleInnerContainer.setAttribute('class', 'schedule-inner-container');
        $scheduleContainer.appendChild($scheduleInnerContainer);

        // const li1 = document.createElement('div');
        // const li2 = document.createElement('div');
        // const li3 = document.createElement('div');
        // const li4 = document.createElement('div');
        // const li5 = document.createElement('div');
        // li1.setAttribute('class', 'schedule-list left');
        // li1.setAttribute('role', 'button');
        // const span = document.createElement('span');
        // span.setAttribute('class', 'schedule-id');
        // li1.appendChild(span);
        // span.textContent = '10';

        // console.log(document.querySelector('.schedule-list'));
        // li2.setAttribute('class', 'schedule-list right');
        // li2.setAttribute('role', 'button');
        // li3.setAttribute('class', 'schedule-list');
        // li3.setAttribute('role', 'button');
        // li4.setAttribute('class', 'schedule-list single');
        // li4.setAttribute('role', 'button');
        // li5.setAttribute('class', 'schedule-list single');
        // li5.setAttribute('role', 'button');
        // $scheduleInnerContainer.appendChild(li1);
        // $scheduleInnerContainer.appendChild(li2);
        // $scheduleInnerContainer.appendChild(li3);
        // $scheduleInnerContainer.appendChild(li4);
        // $scheduleInnerContainer.appendChild(li5);

        $cell.addEventListener('click', e => {
          const $selected = document.querySelector('.selected');
          if ($selected) {
            $selected.classList.remove('selected');
          }
          $cell.classList.add('selected');
          if (!e.target.matches('.schedule-list')) {
            $overlay.style.display = 'block';
          }
          document.getElementById('start-date').value = `${num.id.substring(0, 4)}-${num.id.substring(4, 6)}-${num.id.substring(6, 8)}`;
          document.getElementById('end-date').value = `${num.id.substring(0, 4)}-${num.id.substring(4, 6)}-${num.id.substring(6, 8)}`;
        });

        $cell.addEventListener('mousedown', () => {
          document.getElementById('start-date').value = `${num.id.substring(0, 4)}-${num.id.substring(4, 6)}-${num.id.substring(6, 8)}`;
        });

        $cell.addEventListener('mouseup', e => {
          if (e.target.matches('.schedule-inner-container > .schedule-list')) return;
          document.getElementById('end-date').value = `${num.id.substring(0, 4)}-${num.id.substring(4, 6)}-${num.id.substring(6, 8)}`;
          document.querySelector('.modal-container').classList.remove('hidden');
          if (document.getElementById('start-date').value > document.getElementById('end-date').value) {
            document.getElementById('end-date').value = document.getElementById('start-date').value;
            document.getElementById('start-date').value = `${num.id.substring(0, 4)}-${num.id.substring(4, 6)}-${num.id.substring(6, 8)}`;
          }
        });

        // eslint-disable-next-line no-unused-expressions
        num.type === 'not-current'
          ? $cell.classList.add('not-current')
          : $cell.classList.add('current');

        if (num.id === this.YYYYmmdd(this.today)) {
          $cell.classList.add('active');
        }
        $calendarBody.appendChild($cell);
      });

    document.querySelector('#calendar').appendChild($weekDays);
    document.querySelector('#calendar').appendChild($calendarBody);
  };

  this.showCalendar = () => {
    document.querySelector('#header').innerHTML = '';
    document.querySelector('#calendar').innerHTML = '';
    this.calendarHeader();
    this.calendarBody();
  };

  this.showCalendar();
}

const calendar = new Calendar();

const $scheduleModalClose = document.querySelector('.schedule-modal-close');
const $schedueleModalSave = document.querySelector('.schedule-modal-save');
$scheduleModalClose.onclick = () => {
  document.querySelector('.modal-container').classList.add('hidden');
  $overlay.style.display = 'none';

};

const getScheduleID = () => (schedules.length
  ? Math.max(...schedules.map(list => list.id)) + 1 : 1);

$schedueleModalSave.onclick = () => {
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  const $inputTitle = document.getElementById('schedule-name');
  const $inputMemo = document.getElementById('schedule-memo');
  const titleValue = $inputTitle.value ? $inputTitle.value : '(제목 없음)';
  const memoValue = $inputMemo.value ? $inputMemo.value : '(설명 없음)';
  const dateDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  // for (let i = 0; i <= dateDiff; i++) {
  //   const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
  //   const YYYYmmdd = calendar.YYYYmmdd(d);
  //   const $cell = document.getElementById(`${YYYYmmdd}`);
  //   console.log($cell.querySelector('.schedule-inner-container').innerHTML);
  //   $cell.querySelector('.schedule-inner-container').innerHTML += `<div class="schedule-list ${YYYYmmdd}" role="button">${dateDiff}</div>`
  // }

  $overlay.style.display = 'none';

  const newSchedule = {
    id: getScheduleID(),
    from: calendar.YYYYmmdd(startDate),
    to: calendar.YYYYmmdd(endDate),
    title: titleValue,
    memo: memoValue,
    length: dateDiff,
    fkTable: +document.getElementById('select-schedule').value
    // fkTable: document.getElementById('select-schedule').selectedIndex
  };

  schedules = [...schedules, newSchedule];
  document.querySelector('.modal-container').classList.add('hidden');
  document.getElementById('schedule-name').value = '';
  document.getElementById('schedule-memo').value = '';
  // console.log(schedules);
  async function postScheduleList() {
    try {
      const sendUrl = `/users/${localStorage.getItem('userTk')}/schedules`;
      await axios.post(sendUrl, newSchedule);
      console.log(schedules);
      schedulesRender();
    } catch (err) {
      console.error(err);
    }
  }
  postScheduleList();
};


// 일정 확인 닫기
const $scheduleCheckClose = document.querySelector('.schedule-check-close');
$scheduleCheckClose.onclick = () => {
  document.querySelector('.check-schedule').classList.add('hidden');
  const scheduleData = document.querySelector('.check-schedule').children;
  scheduleData[1].textContent = '';
  scheduleData[2].textContent = '';
  scheduleData[3].textContent = '';
  scheduleData[4].textContent = '';
};

// 일정 확인창 띄우기
document.getElementById('calendar').addEventListener('click', e => {
  if (!e.target.matches('#calendar .schedule-list')) return;
  document.querySelector('.check-schedule').classList.remove('hidden');
  const scheduleId = +e.target.id;
  const selectedList = schedules.find(list => list.id === scheduleId);
  const scheduleData = document.querySelector('.check-schedule').children;
  scheduleData[1].textContent = selectedList.title;
  scheduleData[2].textContent = `${selectedList.from.substring(0, 4)}년
    ${selectedList.from.substring(4, 6)}월
    ${selectedList.from.substring(6, 8)}일
    ~ ${selectedList.to.substring(0, 4)}년
    ${selectedList.to.substring(4, 6)}월
    ${selectedList.to.substring(6, 8)}일`;
  scheduleData[3].textContent = tablesClass.find(table => table.order === +selectedList.fkTable).class;
  scheduleData[4].textContent = selectedList.memo;
  scheduleData[5].textContent = selectedList.id;
});

// 일정 지우기
const $checkScheduleRemove = document.getElementById('schedule-remove');
$checkScheduleRemove.onclick = () => {
  const id = document.querySelector('.schedule-check-id').textContent;
  async function deleteScheduleList() {
    try {
      const response = await axios.delete(`users/${localStorage.getItem('userTk')}/schedules/${id}`);
      const matchingList = await response.data;
      schedules = matchingList;
      schedulesRender();
    } catch (err) {
      console.error(err);
    }
  }
  deleteScheduleList();
  document.querySelector('.check-schedule').classList.add('hidden');
};

function schedulesRender() {
  // rander를 담당하는 변수
  const _schedules = [...schedules];

  // 토요일이 있는지 확인
  function searchSaturday() {
    const saturday = [];
    const $monthYear = document.querySelector('.month-year');
    const year = +$monthYear.textContent.substring(0, 4);
    const month = +$monthYear.textContent.substring(6, 7);
    const newDay = new Date(year, month - 1);
    const firstSaturday = 7 - newDay.getDay();
    let saturdaySchedules = [];
    // 첫 토요일
    for (let i = 0; i < 4; i++) {
      if (firstSaturday + i * 7 < 30) {
        saturday.push(firstSaturday + i * 7);
      }
    }
    // console.log(saturday);
    // 토요일들을 구함
    for (let i = 0; i < saturday.length; i++) {
      saturdaySchedules = _schedules.filter(schedule => {
        const from = +schedule.from.substring(6, 8);
        const to = +schedule.to.substring(6, 8);
        return from < saturday[i] && to > saturday[i];
      });
    }
    // 토요일이 있으면 새로 만듦
    function craeteSaturdaySchedules() {
      saturdaySchedules.forEach(schedule => {
        for (let i = 0; i <= saturday.length; i++) {
          const from = +schedule.from.substring(6, 8);
          const to = +schedule.to.substring(6, 8);
          if ((from <= saturday[i] && to >= saturday[i]) || saturday[i] === undefined) {
            if (i === 0) {
              _schedules.push({
                id: schedule.id,
                from: schedule.from,
                to: saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i],
                title: schedule.title,
                memo: schedule.memo,
                length: (saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i]) - schedule.from
              });
            } else if (!(saturday[i - 1] < to && saturday[i] === undefined ? 32 : saturday[i] > to)) {
              // console.log(saturday[i], 'saturday[i]');
              _schedules.push({
                id: schedule.id,
                from: saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1),
                to: saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i],
                title: schedule.title,
                memo: schedule.memo,
                length: (saturday[i] < 10 ? schedule.to.substring(0, 6) + '0' + saturday[i] : schedule.to.substring(0, 6) + saturday[i]) - (saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1))
              });
            } else {
              // console.log('[확인]', saturday[i]);
              _schedules.push({
                id: schedule.id,
                from: saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1),
                to: schedule.to,
                title: schedule.title,
                memo: schedule.memo,
                length: schedule.to - (saturday[i - 1] < 10 ? schedule.to.substring(0, 6) + '0' + (saturday[i - 1] + 1) : schedule.to.substring(0, 6) + (saturday[i - 1] + 1))
              });
            }
          }
        }
        // console.log('_schedules.indexOf(schedule)', _schedules.indexOf(schedule));
        _schedules.slice(_schedules.indexOf(schedule), 1);
      });
    }
    // console.log(saturdaySchedules);
    craeteSaturdaySchedules();
    // console.log('_schedules', _schedules);
    // console.log('schedules', schedules);
  }
  searchSaturday();
  // length값으로 sort
  function compare(length) {
    return (a, b) => (a[length] < b[length] ? 1 : a[length] > b[length] ? -1 : 0);
  }
  _schedules.sort(compare('length'));
  // dep 조정
  function schedulesOrder() {
    let dep = 0;
    for (let i = 0; i < _schedules.length; i++) {
      if (i === 0) {
        render(_schedules[i]);
      } else {
        for (let k = 1; k < i + 1; k++) {
          if (_schedules[i - k].from <= _schedules[i].from && _schedules[i].from <= _schedules[i - k].to) {
            ++dep;
          }
        }
        // console.log('[dep조정]', dep, _schedules[i]);
        render(_schedules[i], dep);
        dep = 0;
      }
    }
  }
  // render
  function render(schedule, dep) {
    if (!document.getElementById(`${schedule.from}`)) return;
    const $inner = document.getElementById(`${schedule.from}`);
    $inner.querySelector('.schedule-inner-container').innerHTML += `<div id="${schedule.id}" class="schedule-list" role="button">${
      schedule.title}</div>`;
    document.getElementById(`${schedule.id}`).style.width = `${95 * (schedule.length + 1)}%`;
    document.getElementById(`${schedule.id}`).style.transform = `translateY(${dep * 110}%)`;
  }
  console.log(_schedules);
  schedulesOrder();
}

window.addEventListener('load', () => {
  async function getScheduleList() {
    try {
      const response = await axios.get(`/users/${localStorage.getItem('userTk')}`);
      const _schedules = await response.data;
      schedules = _schedules.schedules;
      tablesClass = _schedules.tables;
      schedulesRender();
    } catch (err) {
      console.error(err);
    }
  }
  getScheduleList();
});

$btnLogout.onclick = async () => {
  try {
    await removeToken();
    await pageMove('http://localhost:3000');
  } catch (err) {
    console.error(err);
  }
};
