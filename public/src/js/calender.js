// variables
const $btnLogout = document.querySelector('.api-btn');



// functions

const pageMove = url => location.replace(url);

// events
$btnLogout.onclick = () => {
  pageMove('http://akakqogk.dothome.co.kr');
}