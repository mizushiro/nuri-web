import Accordion from './component/accordion.js';
import ButtonSelection from './component/buttonSelection.js';
import Dialog from './component/dialog.js';
import Dropdown from './component/dropdown.js';
import RangeSlider from './component/range.js';
import RangeSliderDual from './component/rangeDual.js';
import Tab from './component/tab.js';
import Tooltip from './component/tooltip.js';
import ToggleController from './component/toggleController.js';
import TimeTimeline from './component/timeTimeline.js';
import SplitSlider from '../../resources/js/utils/splitSlider.js';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs'

import { 
	loadContent, 
	RadioAllcheck, 
	HoverMenu, 
	FakeRadio,
	getUrlParameter,
	ScrollTrigger,
} from './utils/utils.js';

export const UX = {
	Accordion,
	ButtonSelection,
	Dialog,
	Dropdown,
	Tab,
	Tooltip,
	RangeSlider,
	RangeSliderDual,
	ToggleController,
	TimeTimeline,
	
	RadioAllcheck,
	HoverMenu,
	FakeRadio,
	ScrollTrigger,
	getUrlParameter,

	init: (type) => {
		const global = 'UI';
		if (!window[global]) {
			window[global] = {};
		}
		const Global = window[global];

		Global.exe = {
			dropdown: {},
			modal: {},
			tab: {},
			acco: {},
			toggle: {},
		}	//실행용
		Global.dev = {} //개발용
		Global.pub = {} //퍼블용
		Global.map = {} //퍼블용

		UX._loadCommonLayout(type);

		UI.exe.tooltip = new Tooltip('[data-tooltip="click"]');
		UI.exe.toggle = new ToggleController({ 
			area: document.body
		});

		UI.exe.scrollContentMenu = () => {
			const para = getUrlParameter('sub');
			if (para) {
				const selected = document.querySelector('.data-content-nav-2depth[data-state="selected"]');
				selected ? selected.dataset.state="" : '';
				const current = document.querySelector(`.data-content-nav-2depth[data-id="${para}"]`);
				const target = document.querySelector(`.data-content-section-sub-box[data-id="${para}"]`);

				current.dataset.state = "selected";
				setTimeout(() => {
					target.scrollIntoView({
						block: 'start',
						behavior: 'smooth',
						inline: 'nearest'
					});
				}, 500);
			}

			let isMoving = false;
			const nav2depths = document.querySelectorAll('.data-content-nav-2depth');
			const actScroll = (e) => {
				const _this = e.currentTarget;
				const dataId = _this.dataset.id;
				const selected = document.querySelector('.data-content-nav-2depth[data-state="selected"]');
				const target = document.querySelector(`.data-content-section-sub-box[data-id="${dataId}"]`);

				if (target) {
					e.preventDefault();
					selected ? selected.dataset.state = '' : '';
					_this.dataset.state = 'selected';
					isMoving = true;
					target.scrollIntoView({
						block: 'start',
						behavior: 'smooth',
						inline: 'nearest'
					});
					window.addEventListener('scrollend', onScrollEnd);
					function onScrollEnd() {
						isMoving = false;
						window.removeEventListener('scrollend', onScrollEnd);
					}
				} 
			}
			nav2depths.forEach(item => {
				item.addEventListener('click', actScroll)
			});

			setTimeout(() => {
				const boxs = document.querySelectorAll('.data-content-section-sub-box');
				let arrryTop = [];
				const arrryId = [];

				boxs.forEach(item => {
					arrryTop.push(item.getBoundingClientRect().top + window.scrollY - 120);
					arrryId.push(item.dataset.id);
				});

				const content = document.querySelector('.data-content-section-group');
				const myCallbackFunction = () => {
					arrryTop = [];
					boxs.forEach(item => {
						arrryTop.push(item.getBoundingClientRect().top + window.scrollY - 120);
					});
				}
				const resizeObserver = new ResizeObserver(entries => {
					for (const entry of entries) {
						myCallbackFunction();
					}
				});
				resizeObserver.observe(content);

				const act = () => {
					let largestOfSmall = -Infinity;
					let largestOfSmallIndex = -1;
					for (let i = 0; i < arrryTop.length; i++) {
						const currentNumber = arrryTop[i];
						if (currentNumber < window.scrollY && currentNumber > largestOfSmall) {
							largestOfSmall = currentNumber;
							largestOfSmallIndex = i; 
						}
					}
					const selected = document.querySelector('.data-content-nav-2depth[data-state="selected"]');
					selected ? selected.dataset.state = '' : '';
					!largestOfSmallIndex || largestOfSmallIndex < 0 ? largestOfSmallIndex = 0 : '';
					document.querySelector(`.data-content-nav-2depth[data-id="${arrryId[largestOfSmallIndex]}"]`).dataset.state = 'selected';
				}

				window.addEventListener('scroll', act);
			}, 500);

			const dateInputs = document.querySelectorAll('.form-input-date');
      if (dateInputs.length) {
        dateInputs.forEach(input => {
          input.addEventListener('click', () => {
            input.showPicker();
          });
          const icon = input.parentElement.querySelector('.icon-aspect-calendar');
          if (icon) {
            icon.addEventListener('click', () => {
              input.showPicker();
            });
          }
        });
      }

      document.querySelectorAll(".ui-legend-box").forEach((legendBox) => {
        const groups = Array.from(legendBox.querySelectorAll(".ui-legend-group"));
        const prevBtn = legendBox.querySelector(".icon-aspect-prev").closest("button");
        const nextBtn = legendBox.querySelector(".icon-aspect-next").closest("button");
        const currentPageEl = legendBox.querySelector(".ui-legend-page-current");
        const totalPageEl = legendBox.querySelector(".ui-legend-page-total");
        let currentPage = 0;
        const totalPages = groups.length; 
        totalPageEl.textContent = totalPages;

        const updateView = () => {
          groups.forEach((group, index) => {
            group.style.display = index === currentPage ? "flex" : "none";
          });
          currentPageEl.textContent = currentPage + 1;
          prevBtn.disabled = currentPage === 0;
          nextBtn.disabled = currentPage === totalPages - 1;
        }

        prevBtn.addEventListener("click", () => {
          if (currentPage > 0) {
            currentPage--;
            updateView();
          }
        });
        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPages - 1) {
            currentPage++;
            updateView();
          }
        });

        updateView();
      });
		}
		if (document.querySelectorAll(".data-table-more-box .btn-base").length) {
			document.querySelectorAll(".data-table-more-box .btn-base").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tableBox = btn.closest(".data-table-more-box").previousElementSibling;
          if (tableBox && tableBox.classList.contains("more-data-table")) {
            const isShown = tableBox.getAttribute("data-show") === "true";
            tableBox.setAttribute("data-show", isShown ? "false" : "true");
            const textEl = btn.querySelector(".btn-text");
            let currentText = textEl.textContent;
            
            if (currentText.includes("보기") || currentText.includes("열기")) {
              btn.setAttribute("data-original-text", currentText);
              textEl.textContent = currentText.replace(/보기|열기/g, "닫기");
            } else if (currentText.includes("닫기")) {
              const originalText = btn.getAttribute("data-original-text");
              if (originalText) {
                textEl.textContent = originalText;
              } else {
                textEl.textContent = currentText.replace(/닫기/g, "보기");
              }
            }
          }
        });
      });
		}
		
	},
	_loadCommonLayout: (type) => {
		console.log('load common layout:', type);
		// header
		if (document.querySelector('[data-id="header"]')) {
			loadContent({
				area: document.querySelector('[data-id="header"]'),
				src: '../inc/header.html',
				insert: true
			})
			.then(() => {
				UI.exe.mainNav = new HoverMenu({
					id: 'main',
				});
				UI.exe.headerToggle = new ToggleController({ 
					area: document.querySelector('.header[data-id="header"]')
				});
			})
			.catch(err => console.error('Error loading header content:', err));
		}
		// footer
		if (type === 'main') {
			if (document.querySelector('[data-id="footer"]')) {
				loadContent({
					area: document.querySelector('[data-id="footer"]'),
					src: '../inc/footer-main.html',
					insert: true
				})
				.then(() => {
					console.log('footer');

					const swiperAgency = new Swiper('[data-swiper="agency"]', {
						loop: true,
						autoplay: {
							delay: 3000,
							disableOnInteraction: false,
						},
						navigation: {
							nextEl: '.footer-agency-next',
							prevEl: '.footer-agency-prev',
						},
						slidesPerView: 'auto',
						speed: 600,
						breakpoints: {
							320: {
								slidesPerView: 2,
								spaceBetween: 10,
							},
							768: {
								slidesPerView: 4,
								spaceBetween: 0,
							},
							1024: {
								slidesPerView: 6,
								spaceBetween: 0,
							}
						}
					});

					// 자동재생 제어 기능 추가
					let isAutoplayRunning = true;
					const pauseBtn = document.querySelector('[data-action="pause"]');
					const playBtn = document.querySelector('[data-action="play"]');

					if (pauseBtn && playBtn) {
						pauseBtn.addEventListener('click', () => {
							swiperAgency.autoplay.stop();
							isAutoplayRunning = false;
							pauseBtn.style.display = 'none';
							playBtn.style.display = 'flex';
							pauseBtn.classList.remove('active');
							playBtn.classList.add('active');
						});

						playBtn.addEventListener('click', () => {
							swiperAgency.autoplay.start();
							isAutoplayRunning = true;
							playBtn.style.display = 'none';
							pauseBtn.style.display = 'flex';
							playBtn.classList.remove('active');
							pauseBtn.classList.add('active');
						});

						// 초기 상태 설정
						pauseBtn.classList.add('active');
					}

				})
				.catch(err => console.error('Error loading footer content:', err));
			}
		} else {
			if (document.querySelector('[data-id="footer"]')) {
				loadContent({
					area: document.querySelector('[data-id="footer"]'),
					src: '../inc/footer.html',
					insert: true
				})
				.then(() => {
					console.log('footer');
				})
				.catch(err => console.error('Error loading footer content:', err));
			}
		}
		
		// side sub
		if (document.querySelector('[data-id="aside"]')) {
			loadContent({
				area: document.querySelector('[data-id="aside"]'),
				src: '../inc/aside.html',
				insert: true
			})
			.then(() => {
      	let n = getUrlParameter('maptype');
				if (!n) n = 1;
				const items = document.querySelectorAll('.aside-nav-item');
				items[Number(n) - 1].dataset.navState = 'selected';
			})
			.catch(err => console.error('Error loading aside content:', err));
		}
	},
	utils: {
		loadContent,
		getUrlParameter,
	},
	searchHeader: ( selector ) => {
		console.log('load search header:', selector);
		loadContent({
			area: selector,
			src: '../inc/search.html',
			insert: false
		})
		.then(() => {
				console.log('Search content loaded successfully');
		})
		.catch(err => console.error('Error loading search content:', err));
	}
}

