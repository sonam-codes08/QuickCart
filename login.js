(function(){
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  function showToast(msg){
    const container = $('#toastContainer');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2400);
  }

  function setTab(tab){
    const isLogin = tab === 'login';

    $('#tabLogin').classList.toggle('active', isLogin);
    $('#tabSignup').classList.toggle('active', !isLogin);

    $('#loginForm').classList.toggle('auth-hidden', !isLogin);
    $('#signupForm').classList.toggle('auth-hidden', isLogin);

    $('#authTitle').textContent = isLogin ? 'Welcome back' : 'Create your account';
    $('#authSub').textContent = isLogin
      ? 'Log in to track orders and reorder faster.'
      : 'Sign up to start ordering in minutes.';

    $('#authSwitch').innerHTML = isLogin
      ? 'New here? <a href="#" id="switchToSignup">Create an account</a>'
      : 'Already have an account? <a href="#" id="switchToLogin">Log in</a>';

    // rebind the link inside the switch line since we just replaced its HTML
    const switchLink = $('#authSwitch a');
    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      setTab(isLogin ? 'signup' : 'login');
    });
  }

  function init(){
    $('#tabLogin').addEventListener('click', () => setTab('login'));
    $('#tabSignup').addEventListener('click', () => setTab('signup'));

    $('#switchToSignup').addEventListener('click', (e) => {
      e.preventDefault();
      setTab('signup');
    });

    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Logged in — welcome back! (demo only)');
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    });

    $('#signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Account created — welcome to QuickCart! (demo only)');
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();