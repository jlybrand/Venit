document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const navList = document.querySelector('.nav-list');
  console.log(menu);
  console.log(navList);
  menu.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

});
