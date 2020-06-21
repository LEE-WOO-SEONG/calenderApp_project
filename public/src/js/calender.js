// variables
const $btnLogout = document.querySelector('.api-btn');



// functions

const pageMove = url => location.replace(url);

// events
$btnLogout.onclick = () => {
  pageMove('http://akakqogk.dothome.co.kr');
}



function Calendar() {
  this.container = document.querySelector('.container');
  this.container.classList.add('wlhs-calendar');
  this.today = new Date();
  // this.selected = this.today;
  this.currentMonth = this.today.getMonth();
  this.currentYear = this.today.getFullYear();
  this.months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  this.weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  /**
                                                         * Calendar navigation
                                                         * nextMonth()
                                                         * prevMonth()
                                                         */
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

  /**
                                                         * Get days of month
                                                         * getPrevDays()
                                                         * getNextDays()
                                                         * getCurrentDays()
                                                         */

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
  /**
                                                         * YYYY-MM-DD date format
                                                         * YYYYmmdd()
                                                         */
  this.YYYYmmdd = date => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
  };

  this.calendarHeader = () => {
      const header = document.createElement('div');
      header.classList.add('calendar-header');
      const monthAndYear = document.createElement('h3');
      const prevMonth = document.createElement('button');
      const currentMonth = document.createElement('button');
      const nextMonth = document.createElement('button');

      monthAndYear.classList.add('month-year');
      monthAndYear.innerHTML = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;

      prevMonth.innerHTML = '<i class="arrow prev-month"></i>';
      prevMonth.addEventListener('click', () => {
          this.prevMonth();
          monthAndYear.innerHTML = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      });

      nextMonth.innerHTML = '<i class="arrow next-month"></i>';
      nextMonth.addEventListener('click', () => {
          this.nextMonth();
          monthAndYear.innerHTML = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
      });

      currentMonth.innerHTML = '<i class="current-month"></i>';
      currentMonth.addEventListener('click', () => {
          this.currentYear = new Date().getFullYear();
          this.currentMonth = new Date().getMonth();
          monthAndYear.innerHTML = `${this.currentYear + '년 ' + this.months[this.currentMonth]}`;
          this.showCalendar();
      });


      header.appendChild(monthAndYear);
      header.appendChild(prevMonth);
      header.appendChild(currentMonth);
      header.appendChild(nextMonth);
      // this.container.appendChild(header);
      document.querySelector('#header').appendChild(header);
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
      const weekDays = document.createElement('div');

      weekDays.classList.add('week-days');
      for (let i = 0; i <= 6; i++) {
          weekDays.innerHTML += `<div>${this.weekDays[i]}</div>`;
      }

      const calendarBody = document.createElement('div');
      calendarBody.classList.add('calendar-body');
      [...daysPrevMonth, ...daysThisMonth, ...daysNextMonth]
          .forEach(num => {
              // 날짜의 가장 바깥 컨테이너 생성
              const cell = document.createElement('div');
              cell.setAttribute('id', num.id);
              cell.classList.add('day');
              // 숫자가 들어있는 컨테이너
              const digitContainer = document.createElement('div');
              digitContainer.setAttribute('class', 'digit-container');
              cell.appendChild(digitContainer);
              const day = document.createElement('span');
              day.innerHTML = num.date;
              digitContainer.appendChild(day);
              const scheduleContainer = document.createElement('div');
              scheduleContainer.setAttribute('class', 'schedule-container');
              cell.appendChild(scheduleContainer);
              const scheduleInnerContainer = document.createElement('div');
              scheduleInnerContainer.setAttribute('class', 'schedule-inner-container');
              scheduleContainer.appendChild(scheduleInnerContainer);
              // const li1 = document.createElement('div');
              // const li2 = document.createElement('div');
              // const li3 = document.createElement('div');
              // const li4 = document.createElement('div');
              // li1.setAttribute('class', 'schedule-list li1 left');
              // li1.setAttribute('role', 'button');
              // li2.setAttribute('class', 'schedule-list li2 right');
              // li2.setAttribute('role', 'button');
              // li3.setAttribute('class', 'schedule-list li3');
              // li3.setAttribute('role', 'button');
              // li4.setAttribute('class', 'schedule-list li4 single');
              // li4.setAttribute('role', 'button');
              // scheduleInnerContainer.appendChild(li1);
              // scheduleInnerContainer.appendChild(li2);
              // scheduleInnerContainer.appendChild(li3);
              // scheduleInnerContainer.appendChild(li4);

              cell.addEventListener('click', (e) => {
                  // this.selected = num.id;
                  const selected = document.querySelector('.selected');
                  if (selected) {
                      console.log(selected, e.target);
                      selected.classList.remove('selected');
                  }
                  cell.classList.add('selected');
              });
              num.type === 'not-current'
                  ? cell.classList.add('not-current')
                  : cell.classList.add('current');
              if (num.id === this.YYYYmmdd(this.today)) {
                  cell.classList.add('active');
              }
              calendarBody.appendChild(cell);
          });
      document.querySelector('#calendar').appendChild(weekDays);
      document.querySelector('#calendar').appendChild(calendarBody);
  };

  this.showCalendar = () => {
      // this.container.innerHTML = '';
      document.querySelector('#header').innerHTML = '';
      document.querySelector('#calendar').innerHTML = '';
      this.calendarHeader();
      this.calendarBody();
  };

  this.showCalendar();
}

new Calendar();
