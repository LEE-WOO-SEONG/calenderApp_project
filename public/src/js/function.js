export async function getUser() {
    try { 
    const response = await axios.get('users');
    const data = response.data.find(users => users.token === localStorage.getItem("userTk"));
    const $inner = document.getElementById(`${data.calender[0].date}`);
    $inner.querySelector('.schedule-inner-container').innerHTML = `<div class="schedule-list li3" role="button">${data.calender[0].content}</div>`;
    } catch (error) {
      console.error(error);
    }
  }

  window.onload = () => {
    localStorage.setItem("userTk", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFrYWtxb2drIiwicHciOiJsZWUifQ.AmqHxe3ZSKHwMSsIYxQoGiLcZBvWVmjwLUwx45SyXCM" )
}