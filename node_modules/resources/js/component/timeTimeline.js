/**
 * TimeTimeline Component
 * - 데이터 기반 날짜/시각 타임라인 선택 및 컨트롤러
 * - day 문자열(YYYYMMDD 또는 YYYY-MM-DD)로부터 날짜 및 요일 자동 계산
 * - 선택된 시간 & 이전 시간 색상 하이라이트 (is-selected, is-past)
 * - 선택된 시간 중앙 위치 자동 스크롤
 * - PC 마우스 드래그 스크롤 및 좌우 스크롤 이동 버튼
 * - 자동 플레이(재생/일시정지) & 이전/다음 날짜 첫시각 이동
 */

// 요일 텍스트 배열
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 날짜 문자열(YYYYMMDD, YYYY-MM-DD 등)을 파싱하여 'MM. DD 요일' 형식 문자열로 변환
 */
function parseDayLabel(dayStr) {
  if (!dayStr) return '';
  const cleanStr = String(dayStr).replace(/[^0-9]/g, '');
  if (cleanStr.length >= 8) {
    const yyyy = parseInt(cleanStr.substring(0, 4), 10);
    const mm = parseInt(cleanStr.substring(4, 6), 10) - 1;
    const dd = parseInt(cleanStr.substring(6, 8), 10);

    const date = new Date(yyyy, mm, dd);
    const monthFormatted = String(mm + 1).padStart(2, '0');
    const dateFormatted = String(dd).padStart(2, '0');
    const dayOfWeek = WEEKDAYS[date.getDay()] || '';

    return `${monthFormatted}. ${dateFormatted} ${dayOfWeek}`;
  }
  return dayStr;
}

export default class TimeTimeline {
  constructor(options = {}) {
    this.id = options.id || 'timeTimeline_' + Math.random().toString(36).substr(2, 9);
    this.containerSelector = options.container || `[data-time-timeline="${this.id}"]`;
    this.wrap = typeof this.containerSelector === 'string' 
      ? document.querySelector(this.containerSelector) 
      : this.containerSelector;

    this.type = options.type || (this.wrap ? this.wrap.getAttribute('data-type') : null);
    this.data = options.data || [];
    this.autoPlayInterval = options.interval || 1000;
    this.onChange = options.onChange || function() {};

    // 선택 상태 관리
    this.selectedDayIndex = typeof options.selectedDayIndex === 'number' ? options.selectedDayIndex : 0;
    this.selectedTimeIndex = typeof options.selectedTimeIndex === 'number' ? options.selectedTimeIndex : 0;

    // 플랫 항목 목록 (전체 시각 리스트)
    this.flatItems = [];

    // 자동 재생 타이머
    this.playTimer = null;
    this.isPlaying = false;

    // 드래그 스크롤 상태
    this.isMouseDown = false;
    this.startX = 0;
    this.scrollLeftPos = 0;
    this.dragDistance = 0;

    if (this.wrap) {
      // type 지정 시 미리 data-type 속성을 세팅하고 렌더링 전 opacity 0 설정하여 깜빡임 방지
      if (this.type) {
        this.wrap.setAttribute('data-type', this.type);
      }
      this.wrap.style.opacity = '0';
      this.init();
    }
  }

  init() {
    this._buildFlatItems();
    this.render();
    this._bindEvents();
    
    // 초기 선택 항목 활성화 및 스크롤
    if (this.flatItems.length > 0) {
      let initialFlatIndex = this._getFlatIndex(this.selectedDayIndex, this.selectedTimeIndex);
      if (initialFlatIndex < 0) initialFlatIndex = 0;

      // range 타입인 경우 초기 선택 항목이 날짜의 첫시간(timeIndex 0)이면 그다음 시간으로 자동 조정
      if (this.type === 'range' && this.flatItems[initialFlatIndex] && this.flatItems[initialFlatIndex].timeIndex === 0) {
        initialFlatIndex = this._getNextPlayIndex(initialFlatIndex - 1);
      }

      this.selectByFlatIndex(initialFlatIndex >= 0 ? initialFlatIndex : 0, false);
    }

    // 렌더링 및 초기 스타일 설정 완료 후 opacity 1로 전환하여 깜빡임 제거
    requestAnimationFrame(() => {
      if (this.wrap) {
        this.wrap.style.opacity = '1';
      }
    });
  }

  /**
   * 입력 데이터로부터 평탄화된 시각 리스트 생성
   */
  _buildFlatItems() {
    this.flatItems = [];
    this.data.forEach((dayData, dayIdx) => {
      const formattedLabel = parseDayLabel(dayData.day);
      dayData.formattedLabel = formattedLabel; // 캐싱

      const times = dayData.times || [];
      times.forEach((timeStr, timeIdx) => {
        this.flatItems.push({
          dayIndex: dayIdx,
          timeIndex: timeIdx,
          day: dayData.day,
          dayLabel: formattedLabel,
          time: timeStr,
          timeLabel: `${timeStr}시`
        });
      });
    });
  }

  /**
   * DOM 동적 렌더링
   */
  render() {
    if (!this.wrap) return;

    this.wrap.classList.add('time-timeline');
    this.wrap.setAttribute('data-time-timeline', this.id);
    if (this.type) {
      this.wrap.setAttribute('data-type', this.type);
    }

    let html = `
      <!-- 상단 컨트롤러 바 -->
      <div class="timeline-control-bar">
        <div class="timeline-player-group">
          <button type="button" class="btn-timeline-control btn-prev-day" aria-label="이전 날짜" title="이전 날짜 이동">
            <i class="icon-aspect-control-prev" data-size="20"></i>
          </button>
          <button type="button" class="btn-timeline-control btn-play-toggle" aria-label="재생" title="자동 재생">
            <i class="icon-aspect-control-play icon-play" data-size="20"></i>
            <i class="icon-aspect-control-stop icon-pause" data-size="20" style="display:none;"></i>
          </button>
          <button type="button" class="btn-timeline-control btn-next-day" aria-label="다음 날짜" title="다음 날짜 이동">
            <i class="icon-aspect-control-next" data-size="20"></i>
          </button>
        </div>
      </div>

      <div class="timeline-scroll-nav">
        <button type="button" class="btn-timeline-scroll btn-scroll-left" aria-label="좌측으로 스크롤" title="좌측 스크롤">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button type="button" class="btn-timeline-scroll btn-scroll-right" aria-label="우측으로 스크롤" title="우측 스크롤">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>

      <!-- 메인 타임라인 구조 -->
      <div class="timeline-main-body">
        <!-- 좌측 고정 라벨 헤더 -->
        <div class="timeline-fixed-header">
          <div class="timeline-label-cell label-day">날짜</div>
          <div class="timeline-label-cell label-time">시각</div>
        </div>

        <!-- 스크롤 트랙 영역 -->
        <div class="timeline-scroll-area">
          <div class="timeline-track">
    `;

    // 날짜별 그룹 생성
    this.data.forEach((dayData, dayIdx) => {
      const times = dayData.times || [];
      const dayLabel = dayData.formattedLabel || parseDayLabel(dayData.day);

      html += `
        <div class="timeline-day-group" data-day-index="${dayIdx}" data-day="${dayData.day}">
          <div class="timeline-day-header">
            <span class="timeline-day-badge" data-day-badge="${dayIdx}">
              <span class="timeline-day-calendar">
              <i class="icon-aspect-calendar2 " data-size="20"></i>
              </span>
              <span class="day-text">${dayLabel}</span>
            </span>
          </div>
          <div class="timeline-time-row">
      `;

      times.forEach((timeStr, timeIdx) => {
        html += `
          <button type="button" 
                  class="timeline-time-btn" 
                  data-day-index="${dayIdx}" 
                  data-time-index="${timeIdx}" 
                  data-time="${timeStr}">
            <span class="time-text">${timeStr}시</span>
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    this.wrap.innerHTML = html;

    // 주요 요소 참조
    this.scrollArea = this.wrap.querySelector('.timeline-scroll-area');
    this.playBtn = this.wrap.querySelector('.btn-play-toggle');
    this.iconPlay = this.wrap.querySelector('.icon-play');
    this.iconPause = this.wrap.querySelector('.icon-pause');
    this.prevDayBtn = this.wrap.querySelector('.btn-prev-day');
    this.nextDayBtn = this.wrap.querySelector('.btn-next-day');
    this.scrollLeftBtn = this.wrap.querySelector('.btn-scroll-left');
    this.scrollRightBtn = this.wrap.querySelector('.btn-scroll-right');
  }

  /**
   * 이벤트 바인딩
   */
  _bindEvents() {
    if (!this.wrap) return;

    // 1. 시간 버튼 클릭 이벤트
    const timeBtns = this.wrap.querySelectorAll('.timeline-time-btn');
    timeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (this.dragDistance > 5) return; // 드래그 시 클릭 무시
        const dayIdx = parseInt(btn.getAttribute('data-day-index'), 10);
        const timeIdx = parseInt(btn.getAttribute('data-time-index'), 10);
        this.selectTime(dayIdx, timeIdx);
      });
    });

    // 2. 재생/일시정지 버튼
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    // 3. 이전/다음 날짜 이동 버튼
    if (this.prevDayBtn) {
      this.prevDayBtn.addEventListener('click', () => this.prevDay());
    }
    if (this.nextDayBtn) {
      this.nextDayBtn.addEventListener('click', () => this.nextDay());
    }

    // 4. 스크롤 좌우 화살표 버튼
    if (this.scrollLeftBtn && this.scrollArea) {
      this.scrollLeftBtn.addEventListener('click', () => {
        const scrollAmount = this.scrollArea.clientWidth * 0.8;
        this.scrollArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }
    if (this.scrollRightBtn && this.scrollArea) {
      this.scrollRightBtn.addEventListener('click', () => {
        const scrollAmount = this.scrollArea.clientWidth * 0.8;
        this.scrollArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // 5. PC 마우스 드래그 가로 스크롤
    if (this.scrollArea) {
      this.scrollArea.addEventListener('mousedown', (e) => {
        this.isMouseDown = true;
        this.dragDistance = 0;
        this.scrollArea.classList.add('is-dragging');
        this.startX = e.pageX - this.scrollArea.offsetLeft;
        this.scrollLeftPos = this.scrollArea.scrollLeft;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isMouseDown) return;
        const x = e.pageX - this.scrollArea.offsetLeft;
        const walk = (x - this.startX);
        this.dragDistance = Math.abs(walk);
        this.scrollArea.scrollLeft = this.scrollLeftPos - walk;
      });

      window.addEventListener('mouseup', () => {
        if (this.isMouseDown) {
          this.isMouseDown = false;
          this.scrollArea.classList.remove('is-dragging');
        }
      });
    }
  }

  /**
   * dayIndex, timeIndex를 플랫 인덱스로 변환
   */
  _getFlatIndex(dayIdx, timeIdx) {
    return this.flatItems.findIndex(item => item.dayIndex === dayIdx && item.timeIndex === timeIdx);
  }

  /**
   * 다음 플레이 순회 인덱스 계산 (range 타입일 경우 각 날짜의 첫시간 timeIndex === 0 은 건너뀀)
   */
  _getNextPlayIndex(currentIdx) {
    if (this.flatItems.length === 0) return 0;

    let nextIdx = currentIdx + 1;
    if (nextIdx >= this.flatItems.length) {
      nextIdx = 0;
    }

    if (this.type === 'range') {
      let loopCount = 0;
      while (this.flatItems[nextIdx] && this.flatItems[nextIdx].timeIndex === 0 && loopCount < this.flatItems.length) {
        nextIdx++;
        if (nextIdx >= this.flatItems.length) {
          nextIdx = 0;
        }
        loopCount++;
      }
    }

    return nextIdx;
  }

  /**
   * 날짜/시각 선택 실행
   */
  selectTime(dayIdx, timeIdx, triggerCallback = true) {
    const flatIdx = this._getFlatIndex(dayIdx, timeIdx);
    if (flatIdx >= 0) {
      this.selectByFlatIndex(flatIdx, triggerCallback);
    }
  }

  /**
   * 플랫 인덱스 기반으로 선택 및 UI 업데이트
   */
  selectByFlatIndex(flatIdx, triggerCallback = true) {
    if (flatIdx < 0 || flatIdx >= this.flatItems.length) return;

    this.currentFlatIndex = flatIdx;
    const targetItem = this.flatItems[flatIdx];
    this.selectedDayIndex = targetItem.dayIndex;
    this.selectedTimeIndex = targetItem.timeIndex;

    // 모든 시각 버튼 스타일 업데이트 (is-selected, is-past)
    const timeBtns = this.wrap.querySelectorAll('.timeline-time-btn');
    let targetBtnEl = null;

    timeBtns.forEach((btn) => {
      const dIdx = parseInt(btn.getAttribute('data-day-index'), 10);
      const tIdx = parseInt(btn.getAttribute('data-time-index'), 10);
      const btnFlatIdx = this._getFlatIndex(dIdx, tIdx);

      btn.classList.remove('is-selected', 'is-past');

      if (btnFlatIdx < flatIdx) {
        btn.classList.add('is-past');
      } else if (btnFlatIdx === flatIdx) {
        btn.classList.add('is-selected');
        targetBtnEl = btn;
      }
    });

    // 날짜 뱃지 selected 상태 업데이트
    const dayBadges = this.wrap.querySelectorAll('.timeline-day-badge');
    dayBadges.forEach((badge) => {
      const dIdx = parseInt(badge.getAttribute('data-day-badge'), 10);
      if (dIdx === this.selectedDayIndex) {
        badge.classList.add('is-selected');
      } else {
        badge.classList.remove('is-selected');
      }
    });

    // 선택된 버튼을 스크롤 영역의 중앙으로 이동
    if (targetBtnEl) {
      this.scrollCenter(targetBtnEl);
    }

    // onChange 콜백 실행
    if (triggerCallback && typeof this.onChange === 'function') {
      this.onChange({
        day: targetItem.day,
        dayLabel: targetItem.dayLabel,
        time: targetItem.time,
        timeLabel: targetItem.timeLabel,
        dayIndex: targetItem.dayIndex,
        timeIndex: targetItem.timeIndex,
        flatIndex: flatIdx
      });
    }
  }

  /**
   * 지정된 버튼 요소를 스크롤 컨테이너의 중앙에 위치하도록 스크롤
   */
  scrollCenter(btnEl) {
    if (!btnEl || !this.scrollArea) return;

    requestAnimationFrame(() => {
      const containerRect = this.scrollArea.getBoundingClientRect();
      const btnRect = btnEl.getBoundingClientRect();

      // 버튼의 뷰포트 중앙 위치와 스크롤 컨테이너의 뷰포트 중앙 위치의 차이 계산
      const containerCenter = containerRect.left + (containerRect.width / 2);
      const btnCenter = btnRect.left + (btnRect.width / 2);
      const diff = btnCenter - containerCenter;

      const targetScrollLeft = this.scrollArea.scrollLeft + diff;

      this.scrollArea.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    });
  }

  /**
   * 자동 플레이 토글
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 자동 플레이 시작
   */
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.iconPlay) this.iconPlay.style.display = 'none';
    if (this.iconPause) this.iconPause.style.display = 'inline-block';
    if (this.playBtn) this.playBtn.classList.add('is-playing');

    // range 타입인 경우 현재 위치가 해당 날짜의 첫시간(timeIndex 0)이면 그다음 시간으로 선택 조정
    if (this.type === 'range' && this.flatItems[this.currentFlatIndex] && this.flatItems[this.currentFlatIndex].timeIndex === 0) {
      const nextValidIdx = this._getNextPlayIndex(this.currentFlatIndex - 1);
      this.selectByFlatIndex(nextValidIdx);
    }

    this.playTimer = setInterval(() => {
      const nextFlatIdx = this._getNextPlayIndex(this.currentFlatIndex);
      this.selectByFlatIndex(nextFlatIdx);
    }, this.autoPlayInterval);
  }

  /**
   * 자동 플레이 일시정지
   */
  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }

    if (this.iconPlay) this.iconPlay.style.display = 'inline-block';
    if (this.iconPause) this.iconPause.style.display = 'none';
    if (this.playBtn) this.playBtn.classList.remove('is-playing');
  }

  /**
   * 자동 플레이 시간 간격(속도) 동적 조절 (밀리초 단위)
   * @param {number} ms - 플레이 간격 (예: 500 = 0.5초, 1000 = 1초, 2000 = 2초)
   */
  setInterval(ms) {
    if (typeof ms === 'number' && ms > 0) {
      this.autoPlayInterval = ms;
      // 재생 중이면 타이머 재설정
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    }
  }

  /**
   * setInterval과 동일한 닉네임 메소드
   */
  setSpeed(ms) {
    this.setInterval(ms);
  }

  /**
   * 이전 날짜 첫 시각 선택 (range 타입일 경우 첫시간을 건너뛰고 그다음 시간 선택)
   */
  prevDay() {
    const prevDayIdx = Math.max(0, this.selectedDayIndex - 1);
    const targetTimeIdx = (this.type === 'range') ? 1 : 0;
    this.selectTime(prevDayIdx, targetTimeIdx);
  }

  /**
   * 다음 날짜 첫 시각 선택 (range 타입일 경우 첫시간을 건너뛰고 그다음 시간 선택)
   */
  nextDay() {
    const maxDayIdx = this.data.length - 1;
    const nextDayIdx = Math.min(maxDayIdx, this.selectedDayIndex + 1);
    const targetTimeIdx = (this.type === 'range') ? 1 : 0;
    this.selectTime(nextDayIdx, targetTimeIdx);
  }

  /**
   * 데이터 동적 갱신
   */
  setData(newData) {
    this.pause();
    this.data = newData || [];
    this.selectedDayIndex = 0;
    this.selectedTimeIndex = 0;
    this.init();
  }

  /**
   * 컴포넌트 해제
   */
  destroy() {
    this.pause();
    if (this.wrap) {
      this.wrap.innerHTML = '';
    }
  }
}
