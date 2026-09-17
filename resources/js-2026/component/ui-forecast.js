// 선택된 날짜 및 스크롤 동기화 상태 관리 변수
let currentSelectedDate = null;
let isProgrammaticScroll = false;
let programmaticScrollTimer = null;
let weatherSwiperInstance = null;

/**
 * 일별 예보 카드 클릭 시 시간별 예보의 해당 날짜 위치로 스크롤 이동하는 함수
 * @param {string} targetDate - 선택한 날짜 (예: '05.24')
 */
export const scrollToHourlyDate = (targetDate) => {
  if (!targetDate) return;

  isProgrammaticScroll = true;
  clearTimeout(programmaticScrollTimer);
  programmaticScrollTimer = setTimeout(() => {
    isProgrammaticScroll = false;
  }, 600);

  // Mode 1, Mode 2 & Mode 3: 가로 스크롤 뷰포트 이동
  const viewport = document.querySelector('.hourly-scroll-viewport');
  if (viewport) {
    const targetBlock = viewport.querySelector(`.date-group[data-date="${targetDate}"], .list-date-block[data-date="${targetDate}"]`);
    if (targetBlock) {
      if ('onscrollend' in window) {
        viewport.addEventListener('scrollend', () => {
          isProgrammaticScroll = false;
        }, { once: true });
      }

      viewport.scrollTo({
        left: targetBlock.offsetLeft,
        behavior: 'smooth'
      });
    }
  }
};

/**
 * 특정 날짜의 카드를 활성화하고 상단 Swiper 및 시간별 예보를 동기화하는 함수
 * @param {string} targetDate - 선택할 날짜 (예: '05.24')
 * @param {Object} options
 * @param {boolean} options.fromScroll - 가로 스크롤에 의한 동기화 여부
 */
export const selectWeatherCard = (targetDate, options = {}) => {
  const { fromScroll = false } = options;
  if (!targetDate) return;
  if (currentSelectedDate === targetDate) return;

  currentSelectedDate = targetDate;

  // 1. Swiper 날씨 카드 active 상태 갱신
  const weatherCards = document.querySelectorAll('.weather-card');
  let targetIndex = -1;
  let targetCard = null;

  weatherCards.forEach((card, idx) => {
    if (card.dataset.date === targetDate) {
      targetCard = card;
      targetIndex = idx;
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  // date-group 및 list-date-block data-current 속성 갱신
  const dateGroups = document.querySelectorAll('.date-group, .list-date-block');
  dateGroups.forEach(group => {
    group.setAttribute('data-current', group.dataset.date === targetDate ? 'true' : 'false');
  });

  if (!targetCard) return;

  // 2. Swiper 슬라이드 위치 조정 (선택된 카드가 화면 밖으로 벗어나면 화면 안으로 이동)
  if (weatherSwiperInstance && targetIndex >= 0) {
    const swiperEl = document.querySelector('.weather-swiper');
    if (swiperEl) {
      const swiperRect = swiperEl.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();

      // 카드가 화면 왼쪽으로 벗어난 경우
      if (cardRect.left < swiperRect.left + 5) {
        weatherSwiperInstance.slideTo(targetIndex);
      }
      // 카드가 화면 오른쪽으로 벗어난 경우
      else if (cardRect.right > swiperRect.right - 5) {
        const visibleSlides = Math.floor(weatherSwiperInstance.slidesPerViewDynamic?.() || weatherSwiperInstance.params.slidesPerView || 1);
        const targetSlide = Math.max(0, targetIndex - visibleSlides + 1);
        weatherSwiperInstance.slideTo(targetSlide);
      }
    }
  }

  // 3. 하단 안내 영역 업데이트
  const infoDetail = document.getElementById('selected-info-detail');
  if (infoDetail) {
    infoDetail.textContent = `${targetCard.dataset.day}(${targetCard.dataset.date}) - 오전 ${targetCard.dataset.amTemp} (강수 ${targetCard.dataset.amRain}) / 오후 ${targetCard.dataset.pmTemp} (강수 ${targetCard.dataset.pmRain})`;
  }

  // 4. 데이터 수집 및 커스텀 이벤트 전달
  const cardData = {
    day: targetCard.dataset.day,
    date: targetCard.dataset.date,
    amTemp: targetCard.dataset.amTemp,
    amRain: targetCard.dataset.amRain,
    pmTemp: targetCard.dataset.pmTemp,
    pmRain: targetCard.dataset.pmRain
  };
  console.log('[콜백 실행] 선택한 날씨 정보:', cardData);
  targetCard.dispatchEvent(new CustomEvent('weatherSelect', { detail: cardData, bubbles: true }));

  // 5. 카드 클릭 등 스크롤 외에서 선택한 경우 시간별 예보 스크롤 이동
  if (!fromScroll) {
    scrollToHourlyDate(targetDate);
  }
};

/**
 * Swiper 초기화 함수 및 데이터 바인딩
 * @param {Array} data - 날씨 카드 데이터 목록
 */
export const weatherSwiperExe = (data) => {
  // JSON 데이터를 Swiper 슬라이드 HTML 문자열로 생성하는 함수
  const weatherSlideMaker = (dataList) => {
    let result = '';
    dataList.forEach((item, idx) => {
      const displayDay = idx === 0 ? '오늘' : idx === 1 ? '내일' : idx === 2 ? '모레' : (item.dayOfWeek || item.day);
      result += `
        <div class="swiper-slide weather-card ${item.active ? 'active' : ''}" data-date="${item.date}" data-day="${displayDay}" data-am-temp="${item.amTemp}" data-am-rain="${item.amRain}" data-pm-temp="${item.pmTemp}" data-pm-rain="${item.pmRain}">
          <div class="card-header">
            <strong class="day">${displayDay}</strong>
            <span class="date">${item.date}</span>
          </div>
          <div class="card-body">
            <div class="time-col am">
              <div class="weather-icon">
                <div data-icon-weather="${item.amIcon}">
                  <span class="sr-only">${item.amText}</span>
                </div>
              </div>
              <span class="temp am">${item.amTemp}</span>
              <span class="rain">${item.amRain}</span>
            </div>
            <div class="time-col pm">
              <div class="weather-icon">
                <div data-icon-weather="${item.pmIcon}">
                  <span class="sr-only">${item.pmText}</span>
                </div>
              </div>
              <span class="temp pm">${item.pmTemp}</span>
              <span class="rain">${item.pmRain}</span>
            </div>
          </div>
        </div>
      `;
    });
    return result;
  };

  // HTML 슬라이드 노드 추가
  const wrapper = document.querySelector('.weather-swiper .swiper-wrapper');
  if (wrapper) {
    wrapper.innerHTML = weatherSlideMaker(data);
  }

  // 기존 Swiper 인스턴스 정리
  if (weatherSwiperInstance && typeof weatherSwiperInstance.destroy === 'function') {
    weatherSwiperInstance.destroy(true, true);
    weatherSwiperInstance = null;
  }

  // Swiper 인스턴스 생성 (한 화면에 6개 노출)
  weatherSwiperInstance = new Swiper('.weather-swiper', {
    slidesPerView: 6,
    slidesPerGroup: 1, // 버튼 클릭 시 하나씩 이동
    spaceBetween: 12,
    navigation: {
      nextEl: '.weather-swiper-next',
      prevEl: '.weather-swiper-prev',
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 8 },
      640: { slidesPerView: 3, spaceBetween: 10 },
      768: { slidesPerView: 4, spaceBetween: 12 },
      1024: { slidesPerView: 6, spaceBetween: 12 }
    }
  });

  // 초기 선택 날짜 설정
  const activeData = Array.isArray(data) ? (data.find(item => item.active) || data[0]) : null;
  const initialActive = document.querySelector('.weather-card.active') || document.querySelector('.weather-card');
  currentSelectedDate = activeData ? activeData.date : (initialActive ? initialActive.dataset.date : null);

  // 카드 클릭 이벤트 및 콜백 바인딩
  const weatherCards = document.querySelectorAll('.weather-card');
  weatherCards.forEach((card) => {
    card.addEventListener('click', function () {
      selectWeatherCard(this.dataset.date, { fromScroll: false });
    });
  });
};

/**
 * 시간별 예보 컴포넌트 실행 함수
 * @param {Array} data - weather.json 데이터
 */
export const hourlyForecastExe = (data) => {
  let currentInterval = 1; // 1: 1시간 간격, 3: 3시간 간격
  let currentViewMode = 'mode1'; // mode1: 선형 차트, mode2: 막대 차트, mode3: 리스트

  const getWindAngle = (dir) => {
    if (typeof dir === 'number') return dir;
    const angles = {
      'N': 0, 'NNE': 23, 'NE': 45, 'ENE': 68,
      'E': 90, 'ESE': 113, 'SE': 135, 'SSE': 158,
      'S': 180, 'SSW': 203, 'SW': 225, 'WSW': 248,
      'W': 270, 'WNW': 293, 'NW': 315, 'NNW': 338
    };
    return angles[dir] ?? 0;
  };

  const filterHours = (hours, interval) => {
    if (!hours) return [];
    if (interval === 1) return hours;
    // 3시간 간격 필터링 (03시, 06시, 09시, 12시, 15시, 18시, 21시, 00시 등)
    return hours.filter(h => {
      const num = parseInt(h.time);
      return num % 3 === 0;
    });
  };

  const renderComponent = () => {
    const container = document.getElementById('hourly-forecast-content');
    if (!container) return;

    // hourly 데이터가 존재하는 날짜 항목만 사용
    const validDates = data.filter(d => d.hourly && d.hourly.length > 0);
    if (!currentSelectedDate && validDates.length > 0) {
      const activeItem = validDates.find(d => d.active) || validDates[0];
      currentSelectedDate = activeItem.date;
    }

    if (currentViewMode === 'mode3') {
      // Mode 3: 리스트 형태 (가로 스크롤 및 상단 스와이퍼 연동)
      let html = '<div class="hourly-list-container hourly-scroll-viewport"><div class="hourly-list-wrapper">';
      validDates.forEach((dayItem, dayIndex) => {
        const hours = filterHours(dayItem.hourly, currentInterval);
        const isCurrent = currentSelectedDate ? (dayItem.date === currentSelectedDate) : (dayIndex === 0);
        html += `
          <div class="list-date-block" data-date="${dayItem.date}" data-length="${hours.length}" data-current="${isCurrent}">
            <div class="list-date-header">
              ${dayItem.forecastType ? `<span class="badge-type">${dayItem.forecastType}</span>` : ''}
              <span class="date-pill"> <span class="date-pill-icon"><span data-icon="calendar-check"></span></span> ${dayItem.date} ${dayItem.dayOfWeek || dayItem.day}</span>
              <span class="temp-range">
                <span class="temp-range-group">
                  최저 <span class="min-temp">${dayItem.minTemp || '-'}</span>
                </span>
                <span class="divider">|</span>
                <span class="temp-range-group">
                  최고 <span class="max-temp">${dayItem.maxTemp || '-'}</span>
                </span>
              </span>
            </div>
            <table class="hourly-list-table">
              <thead>
                <tr>
                  <th>시각</th>
                  <th>날씨</th>
                  <th>기온(체감)</th>
                  <th>강수량</th>
                  <th>강수강도</th>
                  <th>강수확률</th>
                  <th>바람</th>
                  <th>습도</th>
                  <th>폭염영향</th>
                </tr>
              </thead>
              <tbody>
        `;
        hours.forEach(h => {
          let windText = '-';
          if (Array.isArray(h.windText)) {
            if (h.windText.length >= 3) {
              windText = `${h.windText[0]} ${h.windText[1]} ${h.windText[2]}m/s`;
            } else if (h.windText.length === 2) {
              windText = `${h.windText[0]} ${h.windText[1]}`;
            } else if (h.windText.length === 1) {
              windText = h.windText[0];
            }
          } else if (h.windText) {
            windText = h.windText;
          }

          html += `
            <tr>
              <td>${h.time}</td>
              <td>
                <div class="td-weather">
                  <div data-icon-weather="${h.icon}"></div>
                  <span>${h.text}</span>
                </div>
              </td>
              <td><strong>${h.temp}</strong><span class="sensory-temp">(${h.sensoryTemp})</span></td>
              <td>${h.precip || '-'}</td>
              <td>${h.precipIntensity || '-'}</td>
              <td>${h.rainProb || '0%'}</td>
              <td>${windText}</td>
              <td>${h.humidity || '-'}</td>
              <td>${h.heatImpact || '-'}</td>
            </tr>
          `;
        });
        html += `
              </tbody>
            </table>
          </div>
        `;
      });
      html += '</div></div>';
      container.innerHTML = html;

      // 드래그 스크롤 이벤트 바인딩
      bindDragScroll();
      // 가로 스크롤 시 상단 스와이퍼 날짜 연동 바인딩
      bindScrollSync();
      return;
    }

    // Mode 1 (선형 차트) 및 Mode 2 (막대 차트)
    const isBarChartMode = (currentViewMode === 'mode2');

    let fixedColHtml = '';
    if (isBarChartMode) {
      fixedColHtml = `
        <div class="hourly-fixed-column">
          <div class="fixed-header-cell"><span class="info-icon">i</span></div>
          <div class="fixed-row-cell row-time">시각</div>
          <div class="fixed-row-cell row-weather">날씨</div>
          <div class="fixed-row-cell row-temp-chart">기온</div>
          <div class="fixed-row-cell row-rain-prob has-chart">강수확률</div>
          <div class="fixed-row-cell row-wind has-chart">풍향/풍속(m/s)</div>
          <div class="fixed-row-cell row-humidity has-chart">습도</div>
        </div>
      `;
    } else {
      fixedColHtml = `
        <div class="hourly-fixed-column">
          <div class="fixed-header-cell"><span class="info-icon">i</span></div>
          <div class="fixed-row-cell row-time">시각</div>
          <div class="fixed-row-cell row-weather">날씨</div>
          <div class="fixed-row-cell row-temp-chart">기온</div>
          <div class="fixed-row-cell row-sensory">체감온도</div>
          <div class="fixed-row-cell row-precip">강수량(mm)</div>
          <div class="fixed-row-cell row-rain-prob">강수확률</div>
          <div class="fixed-row-cell row-wind">바람(m/s)</div>
          <div class="fixed-row-cell row-humidity">습도</div>
          <div class="fixed-row-cell row-heat">폭염영향</div>
        </div>
      `;
    }

    let scrollViewportHtml = `
      <div class="hourly-scroll-viewport">
        <div class="hourly-dates-wrapper">
    `;

    validDates.forEach((dayItem, dayIndex) => {
      const isLastDate = (dayIndex === validDates.length - 1);
      const hours = filterHours(dayItem.hourly, currentInterval);
      const isCurrent = currentSelectedDate ? (dayItem.date === currentSelectedDate) : (dayIndex === 0);
      scrollViewportHtml += `
        <div class="date-group" data-date="${dayItem.date}" data-length="${hours.length}" data-current="${isCurrent}">
          <div class="date-sticky-header">
            <span class="badge-type">${dayItem.forecastType}</span>
            <span class="date-pill"> <span class="date-pill-icon"><span data-icon="calendar-check"></span></span> ${dayItem.date} ${dayItem.dayOfWeek || dayItem.day}</span>
            <span class="temp-range">
              <span class="temp-range-group">
                최저 <span class="min-temp">${dayItem.minTemp || '-'}</span>
              </span>
              <span class="divider">|</span>
              <span class="temp-range-group">
                최고 <span class="max-temp">${dayItem.maxTemp || '-'}</span>
              </span>
            </span>
          </div>
          <div class="hourly-columns-row">
      `;

      hours.forEach(h => {
        if (isBarChartMode) {
          scrollViewportHtml += `
            <div class="hourly-col">
              <div class="cell row-time cell-time">
                <span class="sr-only">시각</span>
                ${h.time}
              </div>
              <div class="cell row-weather cell-weather">
                <span class="sr-only">날씨</span>
                <div data-icon-weather="${h.icon}">
                  <span class="sr-only">${h.text}</span>
                </div>
              </div>
              <div class="cell row-temp-chart cell-temp-chart">
                <span class="sr-only">기온</span>
              </div>
              <div class="cell row-rain-prob cell-rain-chart has-chart" data-rain-prob="${h.rainProb}">
                <span class="sr-only">강수확률</span>
              </div>
              <div class="cell row-wind cell-wind-chart has-chart" data-wind-dir="${typeof h.windDir === 'number' ? h.windDir : getWindAngle(h.windDir)}" data-wind-speed="${Array.isArray(h.windText) ? (h.windText.length >= 3 ? h.windText[2] : h.windText[1]) : (h.windSpeed || '0')}">
                <span class="sr-only">풍향/풍속</span>
              </div>
              <div class="cell row-humidity cell-humidity-chart has-chart" data-humidity="${h.humidity}">
                <span class="sr-only">습도</span>
              </div>
            </div>
          `;
        } else {
          scrollViewportHtml += `
            <div class="hourly-col">
              <div class="cell row-time cell-time">
                <span class="sr-only">시각</span>
                ${h.time}
              </div>
              <div class="cell row-weather cell-weather">
                <span class="sr-only">날씨</span>
                <div data-icon-weather="${h.icon}">
                  <span class="sr-only">${h.text}</span>
                </div>
              </div>
              <div class="cell row-temp-chart cell-temp-chart">
                <span class="sr-only">기온</span>
              </div>
              <div class="cell row-sensory cell-sensory">
                <span class="sr-only">체감기온</span>
                <div class="cell-sensory-value">${h.sensoryTemp}</div>
              </div>
              <div class="cell row-precip cell-precip">
                <span class="sr-only">강수량</span>
                <div class="cell-precip-value">${h.precip}</div>
              </div>
              <div class="cell row-rain-prob cell-rain-prob">
                <span class="sr-only">강수확률</span>
                <div class="cell-rain-prob-value">${h.rainProb}</div>
              </div>
              <div class="cell row-wind cell-wind">
                <span class="sr-only">${Array.isArray(h.windText) ? `${h.windText[0]} ${h.windText.length >= 3 ? h.windText[1] + ' ' : ''}${h.windText.length >= 3 ? h.windText[2] : h.windText[1]}m/s` : '풍향 및 풍속'}</span>
                <span class="wind-arrow" data-icon="wind-arrow" style="transform: rotate(${typeof h.windDir === 'number' ? h.windDir : getWindAngle(h.windDir)}deg);"></span>
                <span class="wind-strength">${Array.isArray(h.windText) && h.windText.length >= 3 ? h.windText[1] : '약'}</span>
                <span class="wind-text">${Array.isArray(h.windText) ? (h.windText.length >= 3 ? h.windText[2] : h.windText[1]) : (h.windSpeed || '0')}</span>
              </div>
              <div class="cell row-humidity cell-humidity">
                <span class="sr-only">습도</span>
                ${h.humidity}
              </div>
              <div class="cell row-heat cell-heat">
                <span class="sr-only">폭염영향</span>
                ${h.heatImpact || '-'}
              </div>
            </div>
          `;
        }
      });

      if (isLastDate) {
        if (isBarChartMode) {
          scrollViewportHtml += `
            <div class="hourly-col empty-col">
              <div class="cell row-time cell-time"></div>
              <div class="cell row-weather cell-weather"></div>
              <div class="cell row-temp-chart cell-temp-chart"></div>
              <div class="cell row-rain-prob cell-rain-chart has-chart"></div>
              <div class="cell row-wind cell-wind-chart has-chart"></div>
              <div class="cell row-humidity cell-humidity-chart has-chart"></div>
            </div>
          `;
        } else {
          scrollViewportHtml += `
            <div class="hourly-col empty-col">
              <div class="cell row-time cell-time"></div>
              <div class="cell row-weather cell-weather"></div>
              <div class="cell row-temp-chart cell-temp-chart"></div>
              <div class="cell row-sensory cell-sensory"><div class="cell-sensory-value"></div></div>
              <div class="cell row-precip cell-precip"><div class="cell-precip-value"></div></div>
              <div class="cell row-rain-prob cell-rain-prob"><div class="cell-rain-prob-value"></div></div>
              <div class="cell row-wind cell-wind"></div>
              <div class="cell row-humidity cell-humidity"></div>
              <div class="cell row-heat cell-heat"></div>
            </div>
          `;
        }
      }

      scrollViewportHtml += `
          </div>
        </div>
      `;
    });

    scrollViewportHtml += `
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="hourly-grid-container ${isBarChartMode ? 'mode-bar-chart' : 'mode-line-chart'}">
        ${fixedColHtml}
        ${scrollViewportHtml}
      </div>
    `;

    // 드래그 스크롤 이벤트 바인딩
    bindDragScroll();
    // 가로 스크롤 시 상단 스와이퍼 날짜 연동 바인딩
    bindScrollSync();
  };

  // 마우스 드래그 스크롤 바인딩 함수
  const bindDragScroll = () => {
    const slider = document.querySelector('.hourly-scroll-viewport');
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, input, select')) return;
      isDown = true;
      slider.classList.add('grabbing');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('grabbing');
    });

    slider.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('grabbing');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  };

  // 가로 스크롤 시 상단 Swiper 날짜 연동 바인딩
  const bindScrollSync = () => {
    const viewport = document.querySelector('.hourly-scroll-viewport');
    if (!viewport) return;

    let scrollRafId = null;

    const onViewportScroll = () => {
      if (isProgrammaticScroll) return;
      if (scrollRafId) return;

      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        syncDateFromScroll();
      });
    };

    viewport.addEventListener('scroll', onViewportScroll, { passive: true });

    // 사용자의 직접적인 마우스 클릭/드래그/터치/휠 입력 시 프로그래밍 스크롤 잠금 해제
    const unlockScroll = () => {
      isProgrammaticScroll = false;
      if (programmaticScrollTimer) {
        clearTimeout(programmaticScrollTimer);
        programmaticScrollTimer = null;
      }
    };

    viewport.addEventListener('pointerdown', unlockScroll, { passive: true });
    viewport.addEventListener('wheel', unlockScroll, { passive: true });
    viewport.addEventListener('touchstart', unlockScroll, { passive: true });
  };

  // 현재 가로 스크롤 위치를 기준으로 활성화할 날짜 계산 및 연동
  const syncDateFromScroll = () => {
    const viewport = document.querySelector('.hourly-scroll-viewport');
    if (!viewport) return;

    const dateGroups = viewport.querySelectorAll('.date-group, .list-date-block');
    if (!dateGroups.length) return;

    const scrollLeft = viewport.scrollLeft;
    // 고정 컬럼 또는 화면 좌측 기준 오프셋 (약 24px)
    const checkOffset = 24;
    const checkPos = scrollLeft + checkOffset;

    let activeDate = null;

    for (let i = 0; i < dateGroups.length; i++) {
      const group = dateGroups[i];
      const start = group.offsetLeft;
      const end = start + group.offsetWidth;

      if (checkPos >= start && checkPos < end) {
        activeDate = group.dataset.date;
        break;
      }
    }

    // 스크롤 끝에 도달했을 때 마지막 날짜 처리
    const isScrolledToEnd = Math.ceil(scrollLeft + viewport.clientWidth) >= viewport.scrollWidth - 10;
    if (isScrolledToEnd) {
      activeDate = dateGroups[dateGroups.length - 1].dataset.date;
    }

    if (activeDate) {
      selectWeatherCard(activeDate, { fromScroll: true });
    }
  };

  // 초기 렌더링
  renderComponent();

  // 간격 버튼 이벤트 바인딩
  const intervalBtns = document.querySelectorAll('.hourly-interval-btn');
  intervalBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      intervalBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentInterval = parseInt(this.dataset.interval);
      renderComponent();
      if (currentSelectedDate) {
        scrollToHourlyDate(currentSelectedDate);
      }
    });
  });

  // 뷰 모드 버튼 이벤트 바인딩
  const viewBtns = document.querySelectorAll('.hourly-view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentViewMode = this.dataset.view;
      renderComponent();
      if (currentSelectedDate) {
        scrollToHourlyDate(currentSelectedDate);
      }
    });
  });
};

/**
 * 예보 UI 통합 실행 함수
 * 외부에서 불러온 데이터를 전달받아 내부에서 일별(Swiper) 및 시간별 예보를 각각 분기 실행합니다.
 * @param {Array} data - 날씨 예보 데이터
 */
export const uiForecastExe = (data) => {
  if (!data) return;
  weatherSwiperExe(data);
  hourlyForecastExe(data);
};

export const initForecast = uiForecastExe;


