let schedules = [];

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
    const $btnLogout = document.createElement('button');

    $currentMonth.classList.add('today-btn');
    $headerContainer.classList.add('calendar-header');
    $monthAndYear.classList.add('month-year');
    $btnLogout.classList.add('api-btn');

    $currentMonth.innerHTML = '<i class="current-month"></i>';
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
    };

    $nextMonth.innerHTML = '<i class="arrow next-month"></i>';
    $nextMonth.onclick = () => {
      this.nextMonth();
      $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
    };

    $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;

    $btnLogout.textContent = '로그아웃';
    $btnLogout.onclick = async () => {
      try {
        await removeToken();
        await pageMove('http://localhost:3000');
      } catch (err) {
        console.error(err);
      }
    };

    $headerContainer.appendChild($currentMonth);
    $headerContainer.appendChild($prevMonth);
    $headerContainer.appendChild($nextMonth);
    $headerContainer.appendChild($monthAndYear);
    $headerContainer.appendChild($btnLogout);
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

        const li1 = document.createElement('div');
        // const li2 = document.createElement('div');
        // const li3 = document.createElement('div');
        // const li4 = document.createElement('div');
        // const li5 = document.createElement('div');
        // li1.setAttribute('class', 'schedule-list left');
        // li1.setAttribute('role', 'button');
        // const span = document.createElement('span');
        // span.setAttribute('class', 'schedule-id');
        // li1.appendChild(span);
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

        $cell.addEventListener('click', () => {
          const $selected = document.querySelector('.selected');
          if ($selected) {
            $selected.classList.remove('selected');
          }
          $cell.classList.add('selected');
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
};

const getScheduleID = () => (schedules.length ? Math.max(...schedules.map(list => list.id)) + 1 : 1);

$schedueleModalSave.onclick = () => {
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  const titleValue = document.getElementById('schedule-name').value;
  const memoValue = document.getElementById('schedule-memo').value;
  const dateDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  // for (let i = 0; i <= dateDiff; i++) {
  //   const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
  //   const YYYYmmdd = calendar.YYYYmmdd(d);
  //   const $cell = document.getElementById(`${YYYYmmdd}`);
  //   console.log($cell.querySelector('.schedule-inner-container').innerHTML);
  //   $cell.querySelector('.schedule-inner-container').innerHTML += `<div class="schedule-list ${YYYYmmdd}" role="button">${dateDiff}</div>`
  // }
  const newSchedule = {
    id: getScheduleID(),
    from: calendar.YYYYmmdd(startDate),
    to: calendar.YYYYmmdd(endDate),
    title: titleValue,
    memo: memoValue,
    length: dateDiff,
    fkTable: document.getElementById('select-schedule').value
    // fkTable: document.getElementById('select-schedule').selectedIndex
  };

  schedules = [...schedules, newSchedule];
  document.querySelector('.modal-container').classList.add('hidden');
  document.getElementById('schedule-name').value = '';
  document.getElementById('schedule-memo').value = '';
  // console.log(schedules);
  async function postList() {
    try {
      const sendUrl = `/users/${localStorage.getItem('userTk')}/schedules`;
      await axios.post(sendUrl, schedules);
    } catch (err) {
      console.error(err);
    }
  }
  postList();
};

const $scheduleRemove = document.getElementById('schedule-remove');
$scheduleRemove.onclick = () => {

};

document.getElementById('calendar').addEventListener('click', e => {
  if (!e.target.matches('#calendar .schedule-list')) return;

});

window.addEventListener('load', () => {
  async function getScheduleList() {
    try {
      const response = await axios.get(`/users/${localStorage.getItem('userTk')}`);
      const _schedules = await response.data;
      schedules = _schedules.schedules;
    } catch (err) {
      console.error(err);
    }
  }
  getScheduleList();
});
