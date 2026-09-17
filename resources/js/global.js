// document.querySelector('#popup-close-button').addEventListener('click', () => {
//   // window.open('', '_self').close();
//   window.close();
// })

document.querySelectorAll('a[data-target="popup"]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();

    if (window.innerWidth > 768) {
      const url = el.getAttribute('href');
      let windowName = url.split('/').pop();
      window.open(url, windowName, 'width=1120, height=728').focus();
    }
    else {
      // el.target = '_self';
      window.location.href = el.href;
    }
  })
})

$('[data-role="tab-close"]').on('click', function(e) {
	e.preventDefault();
	history.back();
});

$('#language-selector').on('click', function(e) {
  $(this).toggleClass('active');
})

document.querySelector('#snb-open-button')?.addEventListener('click', () => {
  document.querySelector('aside').classList.add('active');
})

document.querySelector('#snb-close-button')?.addEventListener('click', () => {
  document.querySelector('aside').classList.remove('active');
})

document.querySelectorAll('#sitemap a.toggle')?.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();

    // let menu = e.currentTarget.parentNode.querySelector('ul');
    e.currentTarget.classList.toggle('active');
  });
})

document.querySelector('.print.icon')?.addEventListener('click', (e) => {
  e.preventDefault();
  print();
})