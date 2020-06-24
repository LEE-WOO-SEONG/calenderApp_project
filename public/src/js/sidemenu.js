// State
let calenderList = [];
// DOM Node
const $input = document.getElementById('add-calender');
const $addListSubmit = document.querySelector('.add-list-submit');
const $addCalenderListBox = document.querySelector('.add-calender-list-box');

// function
const render = () => {
  let sideNav = '';
  calenderList.forEach(list => {
    sideNav += `<li id="${list.order}" class="calendar-list">
    <input type="checkbox" id="add-calender-list${list.order}" class="checkbox" ${list.checked ? 'checked' : ''}>
    <label class="checkboxLabel${list.order}" for="add-calender-list${list.order}">${list.class}</label>
    </li>`;
  });
  $addCalenderListBox.innerHTML = sideNav;

  // calenderList.forEach(list => {
  //   const $checkbox = document.querySelector('.checkboxLabel');
  //   const attrColor = list.color;
  //   // $checkbox.style.background = list.color;
  //   $checkbox.addEventListener('click', e => e.target.style.background = attrColor
  // // $addCalenderListBox.innerHTML = init();
  // });

  // calenderList.forEach(list => {
  //   window.getComputedStyle(
  //     document.querySelector(`.checkboxLabel${list.order}`), ':after'
  //   ).style.background = 'red';
  // });
};
const getNextId = () => Math.max(0, ...calenderList.map(({ order }) => order)) + 1;
const addListCalender = content => {
  // console.log(calenderList);
  const dayObject = { order: getNextId(), content, completed: true };
  calenderList = [...calenderList, dayObject];
  document.getElementById('select-schedule').innerHTML += `<option value="${dayObject.id}">${dayObject.content}</option>`;
  console.log(dayObject, calenderList);
  render();
};

const changeCompleted = id => {
  calenderList = calenderList.map(list => (+id === list.id
    ? ({ ...list, completed: !list.completed })
    : list));
  render();
};

const showOnload = matchingUser => {
  const { tables } = matchingUser;
  calenderList = tables;
  console.log(calenderList);
  render();
};

window.onload = () => {
  // localStorage.setItem('userTk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Indvb3Nlb25nIiwicHciOiJkbGRudGpkIn0.63MuIIELRLur7rTsxhYr7ALe7Gy4UKVVpZZcBEjVSuk');

  async function getList() {
    try {
      // const sendUrl = 'users';
      const response = await axios.get(`/users/${localStorage.getItem('userTk')}`);
      const matchingUser = await response.data;
      console.log(matchingUser);
      // const matchingUser = await _calenderList.find(item => item.token === localStorage.getItem('userTk'));
      // console.log(matchingUser);
      showOnload(matchingUser);
    } catch (err) {
      console.error(err);
    }
  }
  getList();
};

// event handler
$input.onkeyup = e => {
  const content = e.target.value.trim();
  if (!content || e.keyCode !== 13) return;
  addListCalender(content);
  e.target.value = '';
};

$addListSubmit.onclick = () => {
  const content = $input.value.trim();
  if (!content) return;
  addListCalender(content);
  $input.value = '';
};

$addCalenderListBox.onchange = e => {
  if (!e.target.matches('.add-calender-list-box .checkbox')) return;
  const ParentNodeId = e.target.parentNode.id;
  changeCompleted(ParentNodeId);
};
