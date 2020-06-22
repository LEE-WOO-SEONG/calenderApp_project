 
// variables
const $btnLogout = document.querySelector('.api-btn');
// functions
const pageMove = url => location.replace(url);

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
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
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
    $btnLogout.onclick = () => {
      pageMove('http://akakqogk.dothome.co.kr');
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

        // const li1 = document.createElement('div');
        // const li2 = document.createElement('div');
        // const li3 = document.createElement('div');
        // const li4 = document.createElement('div');
        // li1.setAttribute('class', 'schedule-list list1');
        // li1.setAttribute('role', 'button');
        // li2.setAttribute('class', 'schedule-list list2');
        // li2.setAttribute('role', 'button');
        // li3.setAttribute('class', 'schedule-list list3');
        // li3.setAttribute('role', 'button');
        // li4.setAttribute('class', 'schedule-list list4');
        // li4.setAttribute('role', 'button');
        // scheduleInnerContainer.appendChild(li1);
        // scheduleInnerContainer.appendChild(li2);
        // scheduleInnerContainer.appendChild(li3);
        // scheduleInnerContainer.appendChild(li4);

        $cell.addEventListener('click', () => {
          // this.selected = num.id;
          const $selected = document.querySelector('.selected');
          if ($selected) {
            $selected.classList.remove('selected');
          }
          $cell.classList.add('selected');
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

new Calendar();
