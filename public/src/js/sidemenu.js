// State
let calenderList = [];
// DOM Node
const $input = document.getElementById('add-calender');
const $addListSubmit = document.querySelector('.add-list-submit');
const $addCalenderListBox = document.querySelector('.add-calender-list-box');
// function
const render = () => {
  let sidePanel = '';
  calenderList.forEach(list => {
    sidePanel += `<li class="${list.order} calendar-list">
    <input type="checkbox" id="add-calender-list${list.order}" class="checkbox" ${list.checked ? 'checked' : ''}>
    <label id="listLabel" class="checkboxLabel${list.order}" for="add-calender-list${list.order}">${list.class}
    <div class="reset-checkbox reset-checkbox${list.order}"></div></label>
    ${list.order !== 1 ? '<i class="remove-calendar-list far fa-times-circle"></i>' : ''}
    </li>`;
  });
  $addCalenderListBox.innerHTML = sidePanel;
  calenderList.forEach(list => {
    const $resetCheckbox = document.querySelector(`.reset-checkbox${list.order}`);
    if (list.checked) {
      $resetCheckbox.style.background = list.color;
      $resetCheckbox.style.display = 'block';
    } else {
      $resetCheckbox.style.display = 'none';
    }
  });
};

// let arrColor = ['#AD1457', '#F4511E', '#E4C441', '#0B8043', '#3F51B5', '#8E24AA', '#D81B60', '#EF6C00', '#C0CA33', '#009688', '#7986CB', '#795548'];
// const randomColor = () => {
//   let colorIndex = Math.floor((Math.random() * arrColor.length));
//   let ColorRandom = arrColor[colorIndex];
//   let _arrColor = arrColor.filter(item => item !== ColorRandom);
//   arrColor = _arrColor;
 
//   if (arrColor.length === 0) {
//     alert('캘린더 추가는 10개까지 가능합니다');
//   }
//   return ColorRandom;
// };

let colorArray = [];

const randomColor = () => {
  const str = 'abcdef0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    const count = Math.floor(Math.random() * str.length);
    random += str[count];
  }
  let rc = '#' + random;

  if (colorArray.includes(rc)) {
    for (let i = 0; i < 6; i++) {
      const count = Math.floor(Math.random() * str.length);
      random += str[count];
    }
  } else {
    colorArray.push(rc);
    return rc;
  }
};

const getNextOrder = () => Math.max(0, ...calenderList.map(({ order }) => order)) + 1;

const addListCalender = content => {
  const newCalenderList = {
    order: getNextOrder(), class: content, color: randomColor(), checked: true
  };
  calenderList = [...calenderList, newCalenderList];
  document.getElementById('select-schedule').innerHTML += `<option value="${newCalenderList.order}">${newCalenderList.class}</option>`;
  async function postList() {
    try {
      const sendUrl = `users/${localStorage.getItem('userTk')}/tables`;
      const response = await axios.post(sendUrl, newCalenderList);
      const _calenderList = await response.data;
      calenderList = _calenderList;
      render();
    } catch (err) {
      console.error(err);
    }
  }
  postList();
};
const changeCompleted = order => {
  calenderList = calenderList.map(list => (+order === list.order ? ({ ...list, checked: !list.checked }) : list));
  render();
};
const showOnload = matchingUser => {
  let option = '';
  matchingUser.forEach(list => {
    option += `<option value="${list.order}">${list.class}</option>`;
  });
  document.getElementById('select-schedule').innerHTML = option;
};

const removeCalenderList = order => {
  calenderList = calenderList.filter(list => +order !== list.order);
  async function deleteList() {
    try {
      const response = await axios.delete(`users/${localStorage.getItem('userTk')}/tables/${order}`);
      const matchingUser = await response.data;
      calenderList = await matchingUser;
      showOnload(calenderList);
      render();
    } catch (err) {
      console.error(err);
    }
  }
  deleteList();
  render();
};
window.addEventListener('load', function () {
  async function getList() {
    try {
      const response = await axios.get(`users/${localStorage.getItem('userTk')}/tables`);
      const matchingUser = await response.data;
      calenderList = await matchingUser;
      showOnload(calenderList);
      render();
    } catch (err) {
      console.error(err);
    }
  }
  getList();
});

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
  const ParentNodeId = e.target.parentNode.classList[0];
  changeCompleted(ParentNodeId);
};
$addCalenderListBox.onclick = e => {
  const ParentNodeClass = e.target.parentNode.classList[0];
  console.log(e.target);
  if (e.target.matches('.remove-calendar-list')) {
    removeCalenderList(ParentNodeClass);
  } else if (e.target.matches('.setting-change')) {
    // settingChange(ParentNodeId);
  }
};
