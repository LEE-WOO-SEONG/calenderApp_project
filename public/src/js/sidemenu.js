// State
let calenderList = [];
// DOM Node
const $input = document.getElementById('add-calender');
const $addListSubmit = document.querySelector('.add-list-submit');
const $addCalenderListBox = document.querySelector('.add-calender-list-box');
const $addCalenderFirstList = document.querySelector('.add-calender-first-list')
​
​
​
// function
const render = () => {
  let sideNav = '';
  calenderList.forEach(list => {
    sideNav += `<li class="calendar-list">
    <input type="checkbox" id="add-calender-list" class="checkbox" ${list.completed ? 'checked' : ''}>
    <label for="add-calender-list">${list.content}</label>
  </li>`
  });
  $addCalenderListBox.innerHTML = sideNav;
}
​
const addListCalender = content => {
  calenderList = [...calenderList, {id : 4, content, completed: true}]
  render();
}
​
window.onload = () => {
  // calenderList = [
  //   { id : 1, content: '지현', completed : true}
  // ]
​
  async function getList () {
    try {
      const sendUrl = 'users';
      const response = await axios.get(sendUrl);
      const _calenderList = await response.data;
      console.log(_calenderList)
      const matchingUsers = await _calenderList.filter(item => item.token === localStorage.getItem('userTK'));
      console.log(matchingUsers)
      // const matchingUsers = await _calenderList.token
      // console.log(matchingUsers);
​
    } catch(err) {
      console.error(err)
    }
  }
  getList();
  render();
  // addList(); 
}
​
// event handler
$input.onkeyup = e => {
  const content = e.target.value.trim();
  if (!content || e.keyCode !== 13) return;
  addListCalender(content);
  e.target.value = '';
}
​
$addListSubmit.onclick = () => {
  const content = $input.value.trim();
  addListCalender(content);
  $input.value = '';
}