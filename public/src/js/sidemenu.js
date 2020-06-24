// State
let calenderList = [];
// DOM Node
const $input = document.getElementById('add-calender');
const $addListSubmit = document.querySelector('.add-list-submit');
const $addCalenderListBox = document.querySelector('.add-calender-list-box');

// function
// const checkboxColor = () => {
//   calenderList.forEach(list => {
//     window.getComputedStyle(document.getElementById('listLabel'), ': after').style.background = 'red';
//   });
// };

const render = () => {
  let sidePanel = '';
  calenderList.forEach(list => {
    sidePanel += `<li id="${list.order}" class="calendar-list">
    <input type="checkbox" id="add-calender-list${list.order}" class="checkbox" ${list.checked ? 'checked' : ''}>
    <label id="listLabel" class="checkboxLabel${list.order}" for="add-calender-list${list.order}">${list.class}</label>
    ${list.order !== 1 ? '<i class="remove-calendar-list far fa-times-circle"></i>' : ''}
    <i class="setting-change fas fa-ellipsis-v"></i>
    </li>`;
  });
  $addCalenderListBox.innerHTML = sidePanel;
};

const getNextId = () => Math.max(0, ...calenderList.map(({ order }) => order)) + 1;

const addListCalender = content => {
  const newCalenderList = { order: getNextId(), class: content, checked: true };
  calenderList = [...calenderList, newCalenderList];
  document.getElementById('select-schedule').innerHTML += `<option value="${newCalenderList.order}">${newCalenderList.class}</option>`;
  // async function postList() {
  //   try {
  //     const sendUrl = 'users';
  //     const response = await axios.post(sendUrl, newCalenderList);
  //     const _calenderList = await response.data;
  //     console.log(_calenderList);
  //     // const matchingUser = await _calenderList.find(item => item.token === localStorage.getItem('userTk'));
  //     // console.log(matchingUser);
  //     // showOnload(matchingUser);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // postList();
  render();
};

const changeCompleted = id => {
  calenderList = calenderList.map(list => (+id === list.id
    ? ({ ...list, completed: !list.completed })
    : list));
  render();
};

const removeCalenderList = id => {
  calenderList = calenderList.filter(list => +id !== list.order);
  console.log(calenderList);
  render();
};

const settingChange = id => {
  
}

const showOnload = matchingUser => {
  const { sidePanel } = matchingUser;
  calenderList = sidePanel;
  render();
};

window.onload = () => {
  // localStorage.setItem('userTk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Indvb3Nlb25nIiwicHciOiJkbGRudGpkIn0.63MuIIELRLur7rTsxhYr7ALe7Gy4UKVVpZZcBEjVSuk');

  async function getList() {
    try {
      // const sendUrl = 'users';
      const response = await axios.get('users');
      const _calenderList = await response.data;
      const matchingUser = await _calenderList.find(item => item.token === localStorage.getItem('userTk'));
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

$addCalenderListBox.onclick = e => {
  const ParentNodeId = e.target.parentNode.id;

  if (e.target.matches('.remove-calendar-list')) {
    removeCalenderList(ParentNodeId);
  } else if (e.target.matches('.setting-change')) {
    settingChange(ParentNodeId);
  }
};
