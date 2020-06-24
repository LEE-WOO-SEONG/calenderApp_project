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
const saveToken = value => localStorage.setItem('userTk', value);

// 회원정보로 로그인 시 userinfo 확인
const validateUserinfo = async (userid, userpw) => {
  try {
    const res = await axios('http://localhost:3000/users');
    const users = await res.data;
    const user = users.find(user => user.id === userid);

    if (!user) return alert('일치하는 회원정보가 없습니다.');
    const userPw = user.pw;

    if (userPw === userpw) {
      pageMove('http://localhost:3000/calender.html');
      saveToken(user.token);
    }
  } catch (err) {
    console.error(err);
  }
};

// API로그인 시 userinfo 추가
const insertUserinfo = async (token, id) => {
  try {
    // 등록된 회원인지 확인
    const res = await axios.get('http://localhost:3000/users');
    const users = await res.data;
    const loginedId = users.find(user => user.id === id);
    if (loginedId) {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        token
      });
    } else {
      await axios.post('http://localhost:3000/users', {
        id,
        token,
        tables: [{
          order: 1,
          class: '할일',
          color: 'red',
          checked: true
        }],
        schedules: []
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// 카카오 계정으로 로그인
const loginKakao = () => {
  Kakao.init('3b5c9ef85ff48abab916a905a688be13');

  Kakao.Auth.loginForm({
    success() {
      const kakaoToken = Kakao.Auth.getAccessToken();
      localStorage.removeItem('kakao_c40e0085c128623f6673bddf89c54ff6');

      Kakao.API.request({ url: '/v2/user/me' })
        .then(({ kakao_account }) => insertUserinfo(kakaoToken, kakao_account.email))
        .then(() => saveToken(kakaoToken))
        .then(() => pageMove('http://localhost:3000/calender.html'))
        .catch(console.error);
    },
    fail(err) {
      alert(JSON.stringify(err));
    },
  });
};

// 구글 계정으로 로그인
const loginGoogle = async () => {
  try {
    await gapi.load('auth2', async function () {
      const gauth2 = await gapi.auth2.init({
        client_id: '11449302546-1mphucu8jkiucnp0r4nc6mhd09foarir.apps.googleusercontent.com'
      });
      const res = await gauth2.signIn({ scope: 'profile email' });
      const googleToken = await res.getAuthResponse().id_token;
      const googleEmail = await res.getBasicProfile().getEmail();

      await insertUserinfo(googleToken, googleEmail);
      await saveToken(googleToken);
      await pageMove('http://localhost:3000/calender.html');
    });
  } catch (err) {
    console.error(err);
  }
};

/* event */
// 로그아웃 확인
window.addEventListener('load', () => {
  if (localStorage.getItem('userTk')) {
    pageMove('http://localhost:3000/calender.html');
  } else $modalContainer.classList.add('active');
});

// 회원정보로 로그인
$loginForm.onclick = ({ target }) => {
  if (!target.matches('.btn-login')) return;

  const userId = $inputId.value;
  const userPw = $inputPw.value;

  if (!userId || !userId.trim()) {
    alert('ID를 입력하세요');
  } else if (!userPw) {
    alert('Password를 입력하세요');
  } else {
    $inputId.value = '';
    $inputPw.value = '';
    validateUserinfo(userId, userPw);
  }
};

$inputPw.onkeyup = e => {
  if (e.keyCode !== 13) return;

  const userId = $inputId.value;
  const userPw = $inputPw.value;

  if (!userId || !userId.trim()) {
    alert('ID를 입력하세요');
  } else if (!userPw) {
    alert('Password를 입력하세요');
  } else {
    $inputId.value = '';
    $inputPw.value = '';
    validateUserinfo(userId, userPw);
  }
};

// 카카오 계정으로 로그인
$btnKakao.onclick = loginKakao;

// 구글 계정으로 로그인
$btnGoogle.onclick = loginGoogle;

// 로그아웃 모달 내부 확인버튼
$modalContainer.onclick = ({ target }) => {
  if (!target.matches('.btn-modalClose')) return;
  $modalContainer.classList.remove('active');
};
