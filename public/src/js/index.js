/* variables */
// dom
const $loginForm = document.getElementById('login-form');
const $inputId = document.getElementById('login-id');
const $inputPw = document.getElementById('login-pw');
const $btnKakao = document.querySelector('.btn-kakao');
const $btnGoogle = document.querySelector('.btn-google');
const $modalContainer = document.querySelector('.modal-container');

/* functions */
const pageMove = url => location.replace(url);
const removeToken = () => localStorage.removeItem('userTk');
const saveToken = (value) => localStorage.setItem('userTk', value);


// 회원정보로 로그인 시 userinfo 확인
const validateUserinfo = async (userid, userpw) => {
  try {
    const res = await axios('http://localhost:3000/users');
    const users = await res.data;  
    const user = users.find(user => user.id == userid);

    if (!user) return alert('일치하는 회원정보가 없습니다.');
    const userPw = user.pw;

    if (userPw === userpw) {
      pageMove('http://akakqogk.dothome.co.kr/calender.html');
      saveToken(user.token)
    } 
  } catch (err) {
    console.error(err);
  }
}

// API로그인 시 userinfo 추가
const insertUserinfo = async (token, id) => {
  try {
    // 등록된 회원인지 확인
    const res = await axios('http://localhost:3000/users');
    const users = await res.data;
    const loginedId = users.find(user => user.id === id);
    if (loginedId) return;

    await axios('http://localhost:3000/users', {
      method: 'POST',
      data: {
        "token": token,
        "id": id,
        "title": [],
        "calender": []
      }
    })
  } catch(err) {
    console.error(err);
  }
}

// 카카오 계정으로 로그인
Kakao.init('3b5c9ef85ff48abab916a905a688be13');

const loginKakao = () => {
  Kakao.Auth.loginForm({
    success: function () {
      const kakaoToken = Kakao.Auth.getAccessToken();

      Kakao.API.request({url: '/v2/user/me'})
        .then(({ kakao_account }) => insertUserinfo(kakaoToken, kakao_account.email))
        .then(() => saveToken(kakaoToken))
        .then(() => pageMove('http://akakqogk.dothome.co.kr/calender.html'))
        .catch(console.error);
    },
    fail: function (err) {
      alert(JSON.stringify(err))
    },
  })
}

const logoutKakao = () => {
  if (!Kakao.Auth.getAccessToken()) return;
  Kakao.Auth.logout();
}


// 구글 계정으로 로그인
(googleInit = () => {
  gapi.load('auth2', function () {
    window.gauth2 = gapi.auth2.init({
      client_id: '11449302546-1mphucu8jkiucnp0r4nc6mhd09foarir.apps.googleusercontent.com'
    });
  });
})();

const loginGoogle = () => {

  gauth2.signIn()
    .then(() => {
      const googleToken = gauth2.currentUser.get().getAuthResponse().id_token;
      const googleEmail = gauth2.currentUser.get().getBasicProfile().getEmail();    
      insertUserinfo(googleToken, googleEmail);
      saveToken(googleToken);
    })
    .then(() => pageMove('http://akakqogk.dothome.co.kr/calender.html'))
    .catch(console.error);
};

const logoutGoogle = async () => {
  try {
    const auth2 = await gapi.auth2.getAuthInstance();
    auth2.signOut();  
  } catch(err) {
    console.error(err);
  }
};


/* event */
// 로그아웃 확인
window.addEventListener('load', () => {
  if (!localStorage.getItem('userTk')) return;
    logoutKakao();
    logoutGoogle();
    removeToken();
    $modalContainer.classList.add('active');
});

// 회원정보로 로그인
$loginForm.onclick = ({ target }) => {
  if(!target.matches('.btn-login')) return;

  const userId = $inputId.value;
  const userPw = $inputPw.value;

  if(!userId || !userId.trim()) {
    return alert('ID를 입력하세요')
  } else if(!userPw) {
    return alert('Password를 입력하세요')
  }

  $inputId.value = '';
  $inputPw.value = '';
  validateUserinfo(userId, userPw);
}

$inputPw.onkeyup = e => {
  if(e.keyCode !== 13) return;

  let userId = $inputId.value;
  let userPw = $inputPw.value;

  if(!userId || !userId.trim()) {
    return alert('ID를 입력하세요')
  } else if(!userPw) {
    return alert('Password를 입력하세요')
  }

  $inputId.value = '';
  $inputPw.value = '';
  validateUserinfo(userId, userPw);

  e.stopPropagation;
}

// 카카오 계정으로 로그인
$btnKakao.onclick = loginKakao;

// 구글 계정으로 로그인
$btnGoogle.onclick = loginGoogle;

// 로그아웃 모달 내부 확인버튼
$modalContainer.onclick = ({ target }) => {
  if (!target.matches('.btn-modalClose')) return;
  $modalContainer.classList.remove('active');
}