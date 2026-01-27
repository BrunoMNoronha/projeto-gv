// Script principal da tela de login
const loginForm = document.getElementById('login-form');
const toast = document.getElementById('toast');

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 3000);
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const matricula = document.getElementById('matricula')?.value || '';
    const password = document.getElementById('password')?.value || '';

    if (matricula === '99999999' && password === '123456') {
      window.location.href = '/home.html';
    } else {
      showToast('Matrícula ou senha incorretos.');
    }
  });
}

// Comportamento simples de menu ativo na home
const menuItems = document.querySelectorAll('.sidebar .menu-item');
if (menuItems && menuItems.length) {
  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      menuItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}
