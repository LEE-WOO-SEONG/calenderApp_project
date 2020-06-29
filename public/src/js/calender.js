import { tableList } from './sidemenu.js';

export let schedules = [];

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

    $currentMonth.innerHTML = '<span class="current-month">today</span>';
    $currentMonth.onclick = () => {
      this.currentYear = new Date().getFullYear();
      this.currentMonth = new Date().getMonth();
      $monthAndYear.textContent = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      this.showCalendar();
      schedulesRender();
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

    $headerContainer.appendChild($currentMonth);
    $headerContainer.appendChild($prevMonth);
    $headerContainer.appendChild($nextMonth);
    $headerContainer.appendChild($monthAndYear);
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
          $overlay.style.display = 'block';
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

const showSnackbar = target => {
  const $snackbar = document.createElement('div');
  $snackbar.setAttribute('id', 'snackbar');
  const $main = document.querySelector('.container');
  $main.appendChild($snackbar);
  $snackbar.classList.add('show');

  if (target === $schedueleModalSave) {
    $snackbar.textContent = '일정을 저장 중 입니다.';
  } else {
    $snackbar.textContent = '일정을 삭제 중 입니다.';
  }
  setTimeout(() => {
    $main.removeChild($snackbar);
  }, 1200);
};

const getScheduleID = () => (schedules.length ? Math.max(...schedules.map(list => list.id)) + 1 : 1);

$schedueleModalSave.onclick = ({ target }) => {
  const startDate = new Date(document.getElementById('start-date').value);
  const endDate = new Date(document.getElementById('end-date').value);
  const $inputTitle = document.getElementById('schedule-name');
  const $inputMemo = document.getElementById('schedule-memo');
  const titleValue = $inputTitle.value ? $inputTitle.value : '(제목 없음)';
  const memoValue = $inputMemo.value ? $inputMemo.value : '(설명 없음)';
  const dateDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

  $overlay.style.display = 'none';

  const newSchedule = {
    id: getScheduleID(),
    from: calendar.YYYYmmdd(startDate),
    to: calendar.YYYYmmdd(endDate),
    title: titleValue,
    memo: memoValue,
    length: dateDiff,
    fkTable: +document.getElementById('select-schedule').value
  };
  schedules = [...schedules, newSchedule];
  document.querySelector('.modal-container').classList.add('hidden');
  document.getElementById('schedule-name').value = '';
  document.getElementById('schedule-memo').value = '';
  async function postScheduleList() {
    try {
      const sendUrl = `/users/${localStorage.getItem('userTk')}/schedules`;
      await axios.post(sendUrl, newSchedule);
      schedulesRender(schedules);
    } catch (err) {
      console.error(err);
    }
  }
  postScheduleList();
  showSnackbar(target);
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
  scheduleData[3].textContent = tableList.find(table => table.order === +selectedList.fkTable).class;
  scheduleData[4].textContent = selectedList.memo;
  scheduleData[5].textContent = selectedList.id;
});

// 일정 지우기
const $checkScheduleRemove = document.getElementById('schedule-remove');
$checkScheduleRemove.onclick = ({ target }) => {
  const id = +document.querySelector('.schedule-check-id').textContent;

  async function deleteScheduleList(scheduleId) {
    try {
      const response = await axios.delete(`users/${localStorage.getItem('userTk')}/schedules/${scheduleId}`);
      const matchingList = await response.data;
      schedules = matchingList;
      schedulesRender();
    } catch (err) {
      console.error(err);
    }
  }

  deleteScheduleList(id);
  document.querySelector('.check-schedule').classList.add('hidden');

  showSnackbar(target);
};

// 랜더
function schedulesRender() {
  const _schedules = [...schedules];
  // length값으로 sort
  function compare(length) {
    return (a, b) => (a[length] < b[length] ? 1 : a[length] > b[length] ? -1 : 0);
  }
  _schedules.sort(compare('length'));
  // key dep 만들기
  function createDep() {
    let dep = 0;
    for (let i = 0; i < _schedules.length; i++) {
      if (i === 0) {
        _schedules[i].dep = dep;
      } else {
        for (let k = 1; k < i + 1; k++) {
          if (_schedules[i - k].from <= _schedules[i].from && _schedules[i].from <= _schedules[i - k].to) ++dep;
        }
        // console.log('[dep조정]', dep, _schedules[i]);
        _schedules[i].dep = dep;
        dep = 0;
      }
    }
  }
  // 초기화 작업
  function clear() {
    const $monthYear = document.querySelector('.month-year');
    const year = $monthYear.textContent.substring(0, 4);
    const month = !isNaN(+$monthYear.textContent.substring(6, 8))
      ? $monthYear.textContent.substring(6, 8)
      : 0 + $monthYear.textContent.substring(6, 7);
    const newDay = new Date(year, +month + 1, -1).getDate();
    for (let i = 1; i <= newDay; i++) {
      const $clear = document.getElementById(`${year}${month}${i < 10 ? '0' + i : i}`);
      $clear.querySelector('.schedule-inner-container').innerHTML = '';
    }
  }
  // render
  function render() {
    createDep();
    clear();
    _schedules.forEach(schedule => {
      if (!document.getElementById(`${schedule.from}`) || document.getElementById(`${schedule.id}`)) return;

      async function paintSchedules() {
        const $inner = document.getElementById(`${schedule.from}`);
        $inner.querySelector('.schedule-inner-container').innerHTML += `<div id="${schedule.id}" class="schedule-list" role="button">${schedule.title}</div>`;

        const response = await axios.get(`/users/${localStorage.getItem('userTk')}/tables`);
        const tables = response.data;
        const paintedSchedule = document.getElementById(`${schedule.id}`);
        const bgcolor = tables.find(table => table.order === schedule.fkTable).color;

        paintedSchedule.style.backgroundColor = `${bgcolor}`;
        paintedSchedule.style.width = `${99 * (schedule.length + 1)}%`;
        paintedSchedule.style.transform = `translateY(${schedule.dep * 110}%)`;
      }
      paintSchedules();
    });
  }
  render();
}

async function getScheduleList() {
  try {
    const response = await axios.get(`/users/${localStorage.getItem('userTk')}`);
    const _schedules = await response.data;
    schedules = _schedules.schedules;
    schedulesRender();
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener('load', () => {
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
