/* variables */

// api 키
const kakaoKey = '3b5c9ef85ff48abab916a905a688be13';
const googleId = '11449302546-1mphucu8jkiucnp0r4nc6mhd09foarir.apps.googleusercontent.com'
const facebookId = '708249806679556';

// dom
const $btnKakao = document.querySelector('.btn-kakao');
const $btnGoogle = document.querySelector('.btn-google');
const $modalContainer = document.querySelector('.modal-container');

/* functions */
const pageMove = url => location.replace(url);

const removeToken = item => localStorage.removeItem(item);

const saveToken = (key, value) => localStorage.setItem(key, value);

// 카카오 로그인
const loginKakao = () => {
  Kakao.Auth.loginForm({
    success: function () {
      pageMove('http://akakqogk.dothome.co.kr/calender.html');
      saveToken('kakaoTk', Kakao.Auth.getAccessToken());
    },
    fail: function (err) {
      alert(JSON.stringify(err))
    },
  })
}

Kakao.init(kakaoKey);

const logoutKakao = () => Kakao.Auth.logout();


// 구글 로그인
const googleInit = id => {
  gapi.load('auth2', function () {
    window.gauth2 = gapi.auth2.init({
      client_id: id
    });
  });
}

googleInit(googleId);

const loginGoogle = () => {
  gauth2.signIn()
    .then(() => {
      if (gauth2.isSignedIn.get()) {
        const gtoken = gauth2.currentUser.get().getAuthResponse().id_token;
        pageMove('http://akakqogk.dothome.co.kr/calender.html');
        saveToken('googleTk', gtoken);
      }
    });
};

const logoutGoogle = async () => {
  const auth2 = await gapi.auth2.getAuthInstance();
  auth2.signOut();
};


// async function getUserinfo() {
//   try {
//     const res = await axios('http://localhost:3000/users');
//     const user = await res.data;
//     console.log(user);
//   } catch (err) {
//     console.log(err);
//   }
// }

// getUserinfo();

// event

window.addEventListener('load', () => {
  if (localStorage.getItem('kakaoTk')) {
    logoutKakao();
    removeToken('kakaoTk');
    $modalContainer.classList.add('active');
  } else if (localStorage.getItem('googleTk')) {
    logoutGoogle();
    removeToken('googleTk');
    $modalContainer.classList.add('active');
  }
});

$btnKakao.onclick = loginKakao;

$btnGoogle.onclick = loginGoogle;

$modalContainer.onclick = ({ target }) => {
  if (!target.matches('.btn-modalClose')) return;
  $modalContainer.classList.remove('active');
}