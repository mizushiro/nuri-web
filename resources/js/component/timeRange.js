const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const temp = new Date(start);
  while (temp <= end) {
    const yyyy = temp.getFullYear();
    const mm = String(temp.getMonth() + 1).padStart(2, '0');
    const dd = String(temp.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
    temp.setDate(temp.getDate() + 1);
  }
  return dates;
};

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export class TimeRange {
  constructor(opt) {
    this.id = opt.id;
    this.wrap = document.querySelector(`.timeRange[data-time-range="${this.id}"]`);
    
    this.rangeType = opt.rangeType;
    this.isDayMode = (this.rangeType === 'day');
    this.isCustomRange = (this.rangeType === 'datetime' || this.rangeType === 'relative');
    
    if (this.wrap) {
      this.wrap.setAttribute('data-range-type', this.rangeType || 'legacy');
    }
    
    if (this.isDayMode) {
      if (this.wrap) {
        this.wrap.innerHTML = '';
      }
      this._initDay(opt);
    } else {
      if (this.wrap && !this.wrap.querySelector('.timeRange-bar')) {
        const controlsHtml = `
          <div class="time-range-control-area">
            <button type="button" class="timeRange-prev" aria-label="이전">
              <i class="icon-aspect-play-prev" data-size="20"></i>
            </button>
            <button type="button" class="timeRange-play" aria-label="실행"></button>
            <button type="button" class="timeRange-next" aria-label="다음">
              <i class="icon-aspect-play-next" data-size="20"></i>
            </button>
          </div>
          <div class="timeRange-bar">
            <input type="range" class="timeRange-range" />
          </div>
        `;
        this.wrap.innerHTML = controlsHtml;
      }
    
      this.input = this.wrap.querySelector('.timeRange-range');
      this.bar = this.wrap.querySelector('.timeRange-bar');
      this.fake = this.wrap.querySelector('.timeRange-fake-input');
        
      if (this.isCustomRange) {
        this._initCustom(opt);
      } else {
        this._initLegacy(opt);
      }
    }
  }

  _initDay(opt) {
    this.onChange = opt.onChange || function() {};
    
    // 1. Determine base date (today)
    const baseDate = opt.today ? new Date(opt.today) : new Date();
    this.todayStr = formatDate(baseDate);
    
    // 2. Determine date range
    let start, end;
    if (opt.start && opt.end) {
      start = new Date(opt.start.split(' ')[0] + 'T00:00:00');
      end = new Date(opt.end.split(' ')[0] + 'T00:00:00');
    } else {
      const daysBefore = typeof opt.daysBefore === 'number' ? Math.max(0, opt.daysBefore) : 3;
      const daysAfter = typeof opt.daysAfter === 'number' ? Math.max(0, opt.daysAfter) : 3;
      
      start = new Date(baseDate);
      start.setDate(start.getDate() - daysBefore);
      end = new Date(baseDate);
      end.setDate(end.getDate() + daysAfter);
    }
    
    this.dayItemList = getDatesInRange(start, end);
    
    // 3. Initial selected date
    if (opt.value) {
      this.selectedDateStr = typeof opt.value === 'string' ? opt.value.split(' ')[0] : formatDate(opt.value);
    } else {
      this.selectedDateStr = this.dayItemList.includes(this.todayStr) ? this.todayStr : this.dayItemList[0];
    }
    
    // 4. Construct HTML
    const weekNames = ['일', '월', '화', '수', '목', '금', '토'];
    const itemsHtml = this.dayItemList.map(dateStr => {
      const d = new Date(dateStr + 'T00:00:00');
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dayName = weekNames[d.getDay()];
      const isToday = (dateStr === this.todayStr);
      const isActive = (dateStr === this.selectedDateStr);
      
      return `
        <button type="button" class="time-range-day-item ${isActive ? 'active' : ''} ${isToday ? 'is-today' : ''}" data-date="${dateStr}">
          <span class="day-date-text">${yyyy}.${mm}.${dd} ${dayName}</span>
        </button>
      `;
    }).join('');
    
    const makeHtml = `
      <div class="time-range-day-wrap">
        <div class="time-range-day-list">
          ${itemsHtml}
        </div>
      </div>
    `;
    
    this.wrap.innerHTML = makeHtml;
    this.dayWrap = this.wrap.querySelector('.time-range-day-wrap');
    this.dayList = this.wrap.querySelector('.time-range-day-list');
    
    this._initDragScroll();
  }

  _initDragScroll() {
    if (!this.dayWrap) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let isMoved = false;

    this.dayWrap.addEventListener('mousedown', (e) => {
      isDown = true;
      isMoved = false;
      startX = e.pageX - this.dayWrap.offsetLeft;
      scrollLeft = this.dayWrap.scrollLeft;
    });

    this.dayWrap.addEventListener('mouseleave', () => {
      isDown = false;
    });

    this.dayWrap.addEventListener('mouseup', () => {
      isDown = false;
    });

    this.dayWrap.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.dayWrap.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(x - startX) > 5) {
        isMoved = true;
      }
      this.dayWrap.scrollLeft = scrollLeft - walk;
    });

    const dayButtons = this.dayList.querySelectorAll('.time-range-day-item');
    dayButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (isMoved) {
          isMoved = false;
          return;
        }
        const dateStr = btn.getAttribute('data-date');
        this.setValue(dateStr);
      });
    });
  }

  _scrollToCenter(targetElement, isSmooth = true) {
    if (!this.dayWrap) return;
    const target = targetElement || (this.dayList ? this.dayList.querySelector('.time-range-day-item.active') : null);
    if (!target) return;

    const wrapWidth = this.dayWrap.clientWidth;
    const itemLeft = target.offsetLeft;
    const itemWidth = target.clientWidth;

    if (wrapWidth === 0 || itemWidth === 0) return;

    const targetScrollLeft = itemLeft - (wrapWidth / 2) + (itemWidth / 2);

    this.dayWrap.scrollTo({
      left: targetScrollLeft,
      behavior: isSmooth ? 'smooth' : 'auto'
    });
  }

  _initCustom(opt) {
    this.timeScale = 1;
    this.optPoint = opt.point;
    this.step = opt.step || 10; // Default 10 minutes
    this.playTime = opt.playTime || 3000;
    this.onChange = opt.onChange || function() {};
    
    // 1. Determine Start and End Datetime
    if (this.rangeType === 'datetime') {
      this.startDateTime = new Date(opt.start.replace(' ', 'T'));
      this.endDateTime = new Date(opt.end.replace(' ', 'T'));
    } else {
      // relative
      const relativeHours = Math.max(1, Math.min(240, Number(opt.relativeHours) || 24));
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      const flooredMinutes = Math.floor(totalMinutes / this.step) * this.step;
      this.startDateTime = new Date(now);
      this.startDateTime.setHours(0, 0, 0, 0);
      this.startDateTime.setMinutes(flooredMinutes);
      this.endDateTime = new Date(this.startDateTime.getTime() + relativeHours * 60 * 60 * 1000);
    }
    
    const totalDurationMs = this.endDateTime.getTime() - this.startDateTime.getTime();
    this.totalHours = totalDurationMs / (1000 * 60 * 60);
    this.isSingleTrack = (this.totalHours <= 24);
    
    // 2. Generate Calendar Dates List
    this.dateList = getDatesInRange(this.startDateTime, this.endDateTime);
    this.totalDays = this.dateList.length;
    this.currentDayIndex = 0;
    this.currentDateStr = this.dateList[0];
    
    // 3. Construct HTML
    const optionsHtml = this.dateList.map(dateStr => {
      const dottedDate = dateStr.replace(/-/g, '.');
      return `<option value="${dateStr}">${dottedDate}</option>`;
    }).join('');
    
    const makeHtml = `
      <div class="time-range-day">
        <i class="icon-aspect-calendar-b" data-size="20"></i>
        <select class="timeRange-date-select" style="border: 0; background: none; outline: 0; font-weight: 700; font-size: 1.4rem; color: #19213D; cursor: pointer; appearance: none; -webkit-appearance: none;">
          ${optionsHtml}
        </select>
        <span class="timeRange-time-display" style="font-size: 1.4rem;">${this._formatTime(this.value || 0)}</span>
      </div>
      <div class="timeRange-line"></div>
      <div class="timeRange-fake-input">
        <div class="timeRange-fake-handle" style="pointer-events: auto;">
          <b class="timeRange-fake-value"></b>
        </div>
        <div class="timeRange-fake-track">
          <div class="timeRange-today">
            <b class="timeRange-today-text">00:00</b>
          </div>
        </div>
      </div>
    `;
    
    this.bar.insertAdjacentHTML('beforeend', makeHtml);
    this.fake = this.wrap.querySelector('.timeRange-fake-input');
    this.fakeHandle = this.wrap.querySelector('.timeRange-fake-handle');
    this.fakeTrack = this.wrap.querySelector('.timeRange-fake-track');
    this.fakeTodayText = this.wrap.querySelector('.timeRange-today-text');
    this.dateSelect = this.wrap.querySelector('.timeRange-date-select');
    this.valueBox = this.wrap.querySelector('.timeRange-fake-value');
    this.timeDisplay = this.wrap.querySelector('.timeRange-time-display');
    
    this.playBtn = this.wrap.querySelector('.timeRange-play');
    this.playPrev = this.wrap.querySelector('.timeRange-prev');
    this.playNext = this.wrap.querySelector('.timeRange-next');
    
    this._playTimer = null;
    
    // Initialize slider limits for the current page
    this._setupTrackForCurrentPage();
    
    // Set initial value
    if (opt.value) {
      if (typeof opt.value === 'string') {
        const valDate = new Date(opt.value.replace(' ', 'T'));
        if (!isNaN(valDate.getTime())) {
          this._setValueByDateTime(valDate);
        } else {
          this._setToEarliestTime();
        }
      } else if (Array.isArray(opt.value) && opt.value.length === 2) {
        // Legacy value format [hour, minute]
        const hour = opt.value[0];
        const min = opt.value[1];
        if (this.isSingleTrack) {
          const valDate = new Date(this.startDateTime);
          valDate.setHours(hour, min, 0, 0);
          if (valDate < this.startDateTime) {
            valDate.setDate(valDate.getDate() + 1);
          }
          this._setValueByDateTime(valDate);
        } else {
          this.setValue(hour * 60 + min);
        }
      } else {
        this.setValue(Number(opt.value));
      }
    } else {
      this._setToEarliestTime();
    }
  }

  _setupTrackForCurrentPage() {
    if (this.isSingleTrack) {
      // Single track covers the whole range
      this.dayStartMinutes = 0;
      this.dayEndMinutes = Math.round((this.endDateTime.getTime() - this.startDateTime.getTime()) / (60 * 1000));
      this.maxLimit = this.dayEndMinutes;
    } else {
      // Multi day page: track covers 00:00 to 24:00 (0 to 1440 minutes)
      this.dayStartMinutes = 0;
      this.dayEndMinutes = 1440;
      
      const startDateStr = formatDate(this.startDateTime);
      const endDateStr = formatDate(this.endDateTime);
      
      if (this.currentDateStr === startDateStr) {
        this.dayStartMinutes = this.startDateTime.getHours() * 60 + this.startDateTime.getMinutes();
      }
      if (this.currentDateStr === endDateStr) {
        this.dayEndMinutes = this.endDateTime.getHours() * 60 + this.endDateTime.getMinutes();
      }
      
      this.maxLimit = 1440;
    }
    
    // Update visual disabled zones
    this._updateDisabledZones();
    
    // Generate snap points
    this._generatePointsForCurrentDay();
    
    // Re-render ticks and labels
    this._renderTimeline();
    
    // Disable date selection when range is 24 hours or less
    if (this.dateSelect) {
      this.dateSelect.style.pointerEvents = this.isSingleTrack ? 'none' : 'auto';
    }
    const dayWrap = this.wrap.querySelector('.time-range-day');
    if (dayWrap) {
      dayWrap.style.cursor = this.isSingleTrack ? 'default' : 'pointer';
    }
    
    // Update prev/next disabled states
    this._updatePrevNextButtons();
  }

  _updateDisabledZones() {
    // Remove existing disabled zones first
    const existing = this.bar.querySelectorAll('.timeRange-disabled-zone');
    existing.forEach(el => el.remove());
    
    if (this.isSingleTrack) return;
    
    const leftWidthPercent = (this.dayStartMinutes / 1440) * 100;
    const rightWidthPercent = ((1440 - this.dayEndMinutes) / 1440) * 100;
    
    if (leftWidthPercent > 0) {
      const leftZone = document.createElement('div');
      leftZone.className = 'timeRange-disabled-zone left';
      leftZone.style.cssText = `position: absolute; left: -2rem; top: 0; bottom:auto; width: calc(${leftWidthPercent}% + 2rem); background: rgba(0, 0, 0, 0.4); pointer-events: none; z-index: 1; height:0.6rem; border-radius: 0.4rem 0 0 0.4rem;`;
      this.fake.appendChild(leftZone);
    }
    if (rightWidthPercent > 0) {
      const rightZone = document.createElement('div');
      rightZone.className = 'timeRange-disabled-zone right';
      rightZone.style.cssText = `position: absolute; right: 0; top: 0; bottom:auto; width: ${rightWidthPercent}%; background: #4b4b4b; pointer-events: none; z-index: 1; height:0.6rem; border-radius: 0 0.4rem 0.4rem 0;`;
      this.fake.appendChild(rightZone);
    }
  }

  _generatePointsForCurrentDay() {
    this.points = [];
    
    // Snap points are defined within the selectable range [dayStartMinutes, dayEndMinutes]
    for (let i = this.dayStartMinutes; i <= this.dayEndMinutes; i += this.step) {
      this.points.push(i);
    }
    
    if (this.points[this.points.length - 1] < this.dayEndMinutes) {
      this.points.push(this.dayEndMinutes);
    }
    
    // Filter and sort points
    this.points = [...new Set(this.points)].sort((a, b) => a - b);
  }

  _renderTimeline() {
    const line = this.bar.querySelector('.timeRange-line');
    if (!line) return;
    
    line.innerHTML = '';
    line.style.display = 'block';
    line.style.position = 'relative';
    line.style.height = '.6rem';
    line.style.width = '100%';
    
    const trackStart = 0;
    const trackEnd = this.isSingleTrack ? this.dayEndMinutes : 1440;
    const duration = trackEnd - trackStart;
    
    const totalHours = duration / 60;
    let labelInterval = 3;
    if (totalHours <= 6) {
      labelInterval = 1;
    } else if (totalHours <= 12) {
      labelInterval = 2;
    }
    
    // If optPoint is defined as a custom number of minutes, use it for labelInterval
    if (typeof this.optPoint === 'number') {
      labelInterval = this.optPoint / 60;
    }
    
    const shownLabelMinutes = [];
    
    // Draw minor ticks every step, major ticks on hour boundaries
    for (let m = trackStart; m <= trackEnd; m += this.step) {
      const isStart = (m === trackStart);
      const isEnd = (m === trackEnd);
      
      let isHourBoundary = false;
      if (typeof this.optPoint === 'number') {
        isHourBoundary = (m % this.optPoint === 0);
      } else {
        isHourBoundary = (m % 60 === 0);
      }
      
      const isMajor = isStart || isEnd || isHourBoundary;
      const percent = (m / duration) * 100;
      
      let showLabel = false;
      let labelText = '';
      
      // Determine label text
      if (isMajor) {
        let labelDate;
        if (this.isSingleTrack) {
          labelDate = new Date(this.startDateTime.getTime() + m * 60 * 1000);
        } else {
          labelDate = new Date(this.currentDateStr + 'T00:00:00');
          labelDate.setMinutes(m);
        }
        labelText = formatTime(labelDate);
        
        if (isStart || isEnd) {
          showLabel = true;
        } else if (isHourBoundary) {
          const hourVal = m / 60;
          showLabel = (hourVal % labelInterval === 0);
        }
        
        // Prevent label overlap (at least 45 minutes of space)
        if (showLabel) {
          const tooClose = shownLabelMinutes.some(lm => Math.abs(lm - m) < 45);
          if (tooClose) {
            showLabel = false;
          } else {
            shownLabelMinutes.push(m);
          }
        }
      }
      
      const isSelectable = (m >= this.dayStartMinutes && m <= this.dayEndMinutes);
      
      const tick = document.createElement('div');
      tick.className = 'timeRange-tick';
      tick.style.position = 'absolute';
      tick.style.left = `${percent}%`;
      tick.style.top = '0';
      tick.style.height = '1.4rem';
      tick.style.display = 'flex';
      tick.style.flexDirection = 'column';
      tick.style.alignItems = 'center';
      
      const tickColor = isSelectable ? '#000' : 'rgba(0, 0, 0, 0.2)';
      const labelColor = isSelectable ? '#fff' : 'rgba(255, 255, 255, 0.4)';
      const hrHeight = isMajor ? '1.6rem' : '1rem';
      
      tick.innerHTML = `
        <hr style="${showLabel ? '' : 'display: none;'} border: none; border-left: 1px solid ${tickColor}; margin: 0; width: 1px; height: ${hrHeight}; pointer-events: none;" />
        ${showLabel ? `<b style="position: absolute; top: 1.8rem; color: ${labelColor}; font-size: 1.2rem; font-weight: 700; white-space: nowrap; pointer-events: none;">${labelText}</b>` : ''}
      `;
      line.appendChild(tick);
    }
  }

  _setValueByDateTime(date) {
    const dateStr = formatDate(date);
    if (this.isSingleTrack) {
      // Find offset in minutes
      const diffMin = Math.round((date.getTime() - this.startDateTime.getTime()) / (60 * 1000));
      this.setValue(diffMin);
    } else {
      // Find day index
      const dayIndex = this.dateList.indexOf(dateStr);
      if (dayIndex !== -1) {
        this._setCurrentDayIndex(dayIndex);
        const minutes = date.getHours() * 60 + date.getMinutes();
        this.setValue(minutes);
      } else {
        this._setToEarliestTime();
      }
    }
  }

  _setToEarliestTime() {
    if (this.isSingleTrack) {
      this.setValue(0);
    } else {
      this._setCurrentDayIndex(0);
      this.setValue(this.dayStartMinutes);
    }
  }

  _setCurrentDayIndex(dayIndex) {
    if (this.isCustomRange) {
      const maxIndex = this.dateList.length - 1;
      this.currentDayIndex = Math.max(0, Math.min(maxIndex, dayIndex));
      this.currentDateStr = this.dateList[this.currentDayIndex];
      if (this.dateSelect) {
        this.dateSelect.value = this.currentDateStr;
      }
      this._setupTrackForCurrentPage();
    } else {
      const maxDayIndex = Math.max(0, this.totalDays - 1);
      this.currentDayIndex = Math.min(Math.max(0, dayIndex), maxDayIndex);
      this.currentDate = this._addDaysToDate(this.date, this.currentDayIndex);
      if (this.dateInput) {
        this.dateInput.value = this.currentDate;
      }
      this._updatePrevNextButtons();
    }
  }

  _updatePrevNextButtons() {
    let isPrevDisabled = false;
    let isNextDisabled = false;

    if (this.isCustomRange) {
      if (this.isSingleTrack) {
        isPrevDisabled = true;
        isNextDisabled = true;
      } else {
        isPrevDisabled = (this.currentDayIndex === 0);
        isNextDisabled = (this.currentDayIndex === this.totalDays - 1);
      }
    } else {
      if (this.totalDays <= 1) {
        isPrevDisabled = true;
        isNextDisabled = true;
      } else {
        isPrevDisabled = (this.currentDayIndex === 0);
        isNextDisabled = (this.currentDayIndex === this.totalDays - 1);
      }
    }

    if (this.playPrev) {
      this.playPrev.disabled = isPrevDisabled;
      this.playPrev.style.opacity = isPrevDisabled ? '0.3' : '1';
      this.playPrev.style.pointerEvents = isPrevDisabled ? 'none' : 'auto';
    }
    if (this.playNext) {
      this.playNext.disabled = isNextDisabled;
      this.playNext.style.opacity = isNextDisabled ? '0.3' : '1';
      this.playNext.style.pointerEvents = isNextDisabled ? 'none' : 'auto';
    }
  }

  _setValueCustom(val) {
    let v = Number(val);
    if (v < this.dayStartMinutes) v = this.dayStartMinutes;
    if (v > this.dayEndMinutes) v = this.dayEndMinutes;
    
    // Snap to closest points
    v = this.points.reduce((prev, curr) =>
      Math.abs(curr - v) < Math.abs(prev - v) ? curr : prev
    , this.dayStartMinutes);
    
    this.value = v;
    this.displayValue = v;
    this.input.value = v;
    
    this._updateFakeHandle();
    this._updateValueBox();
    
    // Determine exact current datetime
    let currentDateObj;
    if (this.isSingleTrack) {
      currentDateObj = new Date(this.startDateTime.getTime() + this.value * 60 * 1000);
      
      // Dynamic date select sync when crossing midnight in single track
      const curDateStr = formatDate(currentDateObj);
      if (this.dateSelect && this.dateSelect.value !== curDateStr) {
        this.dateSelect.value = curDateStr;
        this.currentDateStr = curDateStr;
        this.currentDayIndex = this.dateList.indexOf(curDateStr);
        this._updatePrevNextButtons();
      }
    } else {
      currentDateObj = new Date(this.currentDateStr + 'T00:00:00');
      currentDateObj.setMinutes(this.value);
    }
    
    const formattedDate = formatDate(currentDateObj);
    const formattedTime = formatTime(currentDateObj);
    
    this.onChange(formattedDate + ' ' + formattedTime, formattedTime, currentDateObj);
  }

  _setStepCustom(step) {
    this.step = step;
    this.input.step = step;
    this._setupTrackForCurrentPage();
    this._setToEarliestTime();
  }

  _moveByPointCustom(direction) {
    if (this._playTimer) {
      this._stopPlayCustom();
    }
    
    if (direction > 0) {
      if (!this.isSingleTrack && this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(this.dayStartMinutes);
      }
    } else {
      if (!this.isSingleTrack && this.currentDayIndex > 0) {
        this._setCurrentDayIndex(this.currentDayIndex - 1);
        this.setValue(this.dayStartMinutes);
      }
    }
  }

  _startPlayCustom() {
    if (this._playTimer) return;
    
    this.playBtn.setAttribute('data-toggle-state', 'selected');
    
    // Loop reset if at the very end
    if (this.isSingleTrack) {
      if (this.value >= this.dayEndMinutes) {
        this.setValue(0);
      }
    } else {
      if (this.currentDayIndex >= this.totalDays - 1 && this.value >= this.dayEndMinutes) {
        this._setCurrentDayIndex(0);
        this.setValue(this.dayStartMinutes);
      }
    }
    
    this._playTimer = setInterval(() => {
      const nextPoint = this.points.find(p => p > this.value);
      if (nextPoint !== undefined) {
        this.setValue(nextPoint);
      } else if (!this.isSingleTrack && this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(this.dayStartMinutes);
      } else {
        this._stopPlayCustom();
      }
    }, this.playTime);
  }

  _stopPlayCustom() {
    if (this._playTimer) {
      clearInterval(this._playTimer);
      this._playTimer = null;
    }
    if (this.playBtn) {
      this.playBtn.removeAttribute('data-toggle-state');
    }
  }

  _initRangeCustom() {
    this.input.min = 0;
    this.input.max = this.isSingleTrack ? this.dayEndMinutes : 1440;
    this.input.step = this.step;
    this.input.value = this.value;
    
    if (this._inputHandler) {
      this.input.removeEventListener('input', this._inputHandler);
    }
    this._inputHandler = (e) => {
      let logical = Number(e.target.value);
      if (logical < this.dayStartMinutes) logical = this.dayStartMinutes;
      if (logical > this.dayEndMinutes) logical = this.dayEndMinutes;
      
      this.value = logical;
      this.displayValue = logical;
      this._updateFakeHandle();
      this._updateValueBox();
      
      // Determine time and trigger onChange
      let currentDateObj;
      if (this.isSingleTrack) {
        currentDateObj = new Date(this.startDateTime.getTime() + this.value * 60 * 1000);
        // Date select update
        const curDateStr = formatDate(currentDateObj);
        if (this.dateSelect && this.dateSelect.value !== curDateStr) {
          this.dateSelect.value = curDateStr;
          this.currentDateStr = curDateStr;
          this.currentDayIndex = this.dateList.indexOf(curDateStr);
          this._updatePrevNextButtons();
        }
      } else {
        currentDateObj = new Date(this.currentDateStr + 'T00:00:00');
        currentDateObj.setMinutes(this.value);
      }
      
      this.onChange(formatDate(currentDateObj) + ' ' + formatTime(currentDateObj), formatTime(currentDateObj), currentDateObj);
    };
    this.input.addEventListener('input', this._inputHandler);
    
    if (this._mouseupHandler) {
      this.input.removeEventListener('mouseup', this._mouseupHandler);
    }
    this._mouseupHandler = (e) => {
      const logical = Number(this.input.value);
      let closest = this.points.reduce((prev, curr) =>
        Math.abs(curr - logical) < Math.abs(prev - logical) ? curr : prev
      , this.dayStartMinutes);
      
      if (closest < this.dayStartMinutes) closest = this.dayStartMinutes;
      if (closest > this.dayEndMinutes) closest = this.dayEndMinutes;
      
      this.setValue(closest);
    };
    this.input.addEventListener('mouseup', this._mouseupHandler);
  }

  _initCustomRange() {
    this._initRangeCustom();
    this._updateFakeHandle();
    this._updateValueBox();
    
    if (this.dateSelect) {
      if (this._dateSelectChangeHandler) {
        this.dateSelect.removeEventListener('change', this._dateSelectChangeHandler);
      }
      this._dateSelectChangeHandler = (e) => {
        const newDate = e.target.value;
        const index = this.dateList.indexOf(newDate);
        if (index !== -1) {
          this._setCurrentDayIndex(index);
          this.setValue(this.dayStartMinutes);
        }
      };
      this.dateSelect.addEventListener('change', this._dateSelectChangeHandler);
    }
    
    // Play/prev/next event handlers
    if (this.playBtn) {
      if (this._playClickHandler) {
        this.playBtn.removeEventListener('click', this._playClickHandler);
      }
      this._playClickHandler = () => {
        if (this._playTimer) {
          this._stopPlayCustom();
        } else {
          this._startPlayCustom();
        }
      };
      this.playBtn.addEventListener('click', this._playClickHandler);
    }
    
    if (this.playPrev) {
      if (this._playPrevClickHandler) {
        this.playPrev.removeEventListener('click', this._playPrevClickHandler);
      }
      this._playPrevClickHandler = () => {
        this._moveByPointCustom(-1);
      };
      this.playPrev.addEventListener('click', this._playPrevClickHandler);
    }
    
    if (this.playNext) {
      if (this._playNextClickHandler) {
        this.playNext.removeEventListener('click', this._playNextClickHandler);
      }
      this._playNextClickHandler = () => {
        this._moveByPointCustom(1);
      };
      this.playNext.addEventListener('click', this._playNextClickHandler);
    }
  }

  // --- LEGACY IMPLEMENTATION FOR BACKWARD COMPATIBILITY ---

  _initLegacy(opt) {
    this.max = 24 * 60;
    this.trackOffset = 60;
    this.trackMax = this.max + this.trackOffset;
    this.timeScale = 1;
    this.step = opt.step || 10;
    this.date = opt.date || new Date().toISOString().split('T')[0];
    this.minmaxDay = opt.minmaxDay || null;
    this.totalDays = this._normalizeTotalDays(opt.totalDays ?? opt.days ?? opt.dayCount ?? 4);
    this.currentDayIndex = 0;
    this.currentDate = this._addDaysToDate(this.date, this.currentDayIndex);

    const makeHtml = `
      <div class="time-range-day">
        <i class="icon-aspect-calendar-b" data-size="20"></i>
        <input type="date" value="${this.date}" class="timeRange-date-input" min="${this.minmaxDay ? this.minmaxDay[0] : this.date}" max="${this.minmaxDay ? this.minmaxDay[1] : this._addDaysToDate(this.date, this.totalDays - 1)}" disabled />
      </div>
      <div class="timeRange-line"></div>
      <div class="timeRange-fake-input">
        <div class="timeRange-fake-handle" style="pointer-events: auto;">
          <b class="timeRange-fake-value"></b>
        </div>
        <div class="timeRange-fake-track">
          <div class="timeRange-today">
            <b class="timeRange-today-text">00:00</b>
          </div>
        </div>
      </div>
    `;

    this.bar.insertAdjacentHTML('beforeend', makeHtml);
    this.fakeHandle = this.wrap.querySelector('.timeRange-fake-handle');
    this.fakeTrack = this.wrap.querySelector('.timeRange-fake-track');
    this.fakeTodayText = this.wrap.querySelector('.timeRange-today-text');

    // point parsing
    let pointClass = '';
    if (typeof opt.point === 'number') {
      const interval = opt.point;
      this.points = [];
      for (let i = 0; i <= this.max; i += interval) {
        this.points.push(i);
      }
      if (this.points[this.points.length - 1] < this.max) {
        this.points.push(this.max);
      }
      if (this.points[this.points.length - 1] > this.max) {
        this.points[this.points.length - 1] = this.max;
      }
      pointClass = `time-${interval}`;
    } else if (Array.isArray(opt.point)) {
      this.points = opt.point.slice();
      if (this.points[this.points.length - 1] > this.max) {
        this.points[this.points.length - 1] = this.max;
      }
      if (opt.point.length === 1 && typeof opt.point[0] === 'number') {
        pointClass = `time-${opt.point[0]}`;
      } else {
        pointClass = '';
      }
    } else {
      const interval = 60;
      this.points = [];
      for (let i = 0; i <= this.max; i += interval) {
        this.points.push(i);
      }
      if (this.points[this.points.length - 1] < this.max) {
        this.points.push(this.max);
      }
      pointClass = `time-${interval}`;
    }

    if (this.wrap && pointClass) {
      this.wrap.classList.forEach(cls => {
        if (cls.startsWith('time-')) this.wrap.classList.remove(cls);
      });
      this.wrap.classList.add(pointClass);
    }
    
    this.onChange = opt.onChange || function(){};
    this.valueBox = this.wrap.querySelector('.timeRange-fake-value');
    this.dateInput = this.wrap.querySelector('.timeRange-date-input');
    this.playTime = opt.playTime || 3000;
    this.playBtn = this.wrap.querySelector('.timeRange-play');
    this.playPrev = this.wrap.querySelector('.timeRange-prev');
    this.playNext = this.wrap.querySelector('.timeRange-next');
    this._playTimer = null;
    this._playClickHandler = null;
    this._playPrevClickHandler = null;
    this._playNextClickHandler = null;
    this._inputHandler = null;
    this._dateInputClickHandler = null;
    this._dateInputChangeHandler = null;

    this._setCurrentDayIndex(0);

    if (Array.isArray(opt.value) && opt.value.length === 2) {
      this.value = opt.value[0] * 60 + opt.value[1];
    } else {
      this.value = opt.value || 0;
    }
    this.displayValue = this._logicalToDisplay(this.value);
    this.upperLimit = this.max;
  }

  _normalizeTotalDays(totalDays) {
    const parsed = Number(totalDays);
    if (!Number.isFinite(parsed) || parsed < 1) return 4;
    return Math.floor(parsed);
  }

  _addDaysToDate(dateStr, dayOffset) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  }

  _getSortedPoints() {
    return [...new Set(this.points)]
      .map((p) => Number(p))
      .filter((p) => !Number.isNaN(p))
      .sort((a, b) => a - b);
  }

  _displayToLogical(displayVal) {
    if (displayVal >= this.trackMax) return this.max;
    const shifted = displayVal - this.trackOffset;
    return shifted < 0 ? shifted + this.max : shifted;
  }

  _logicalToDisplay(logicalVal) {
    if (logicalVal >= this.max) return this.trackMax;
    return logicalVal + this.trackOffset;
  }

  _resolveDisplayFromLogical(logicalVal, referenceDisplay) {
    if (logicalVal === this.max) return this.trackOffset;
    if (logicalVal === this.max - 60) return this.trackMax - this.trackOffset;
    return this._logicalToDisplay(logicalVal);
  }

  _formatTime(val) {
    const actualVal = val * this.timeScale;
    const dayMinutes = 24 * 60;
    const normalized = ((actualVal % dayMinutes) + dayMinutes) % dayMinutes;
    const hour = Math.floor(normalized / 60);
    const min = normalized % 60;
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  }

  _getActualValue(val) {
    return (this.currentDayIndex * this.max + val) * this.timeScale;
  }

  _getDisplayDate() {
    const date = new Date(this.currentDate);
    if (Number.isNaN(date.getTime())) return this.currentDate;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  _updateDateTooltip() {
    if (this.isCustomRange) {
      // Custom mode doesn't use legacy date input
    } else {
      if (this.dateInput) {
        this.dateInput.value = this.currentDate;
      }
    }
  }

  _updateValueBox() {
    if (this.isCustomRange) {
      if (!this.fakeTodayText) return;
      let dateObj;
      if (this.isSingleTrack) {
        dateObj = new Date(this.startDateTime.getTime() + this.value * 60 * 1000);
      } else {
        dateObj = new Date(this.currentDateStr + 'T00:00:00');
        dateObj.setMinutes(this.value);
      }
      const timeStr = formatTime(dateObj);
      this.fakeTodayText.textContent = timeStr;
      if (this.timeDisplay) {
        this.timeDisplay.textContent = timeStr;
      }
    } else {
      if (!this.fakeTodayText) return;
      const timeStr = this._formatTime(this.value);
      this.fakeTodayText.textContent = timeStr;
      if (this.timeDisplay) {
        this.timeDisplay.textContent = timeStr;
      }
    }
  }

  _updateFakeHandle() {
    if (!this.fakeHandle) return;
    let percent;
    if (this.isCustomRange) {
      const minVal = this.input.min ? Number(this.input.min) : 0;
      const maxVal = this.input.max ? Number(this.input.max) : 1440;
      percent = (this.displayValue - minVal) / (maxVal - minVal) * 100;
    } else {
      percent = (this.displayValue - this.input.min) / (this.input.max - this.input.min) * 100;
    }
    this.fakeHandle.style.left = `calc(${percent}% )`;
    this.fakeTrack.style.width = `${percent}%`;
    this._updateDateTooltip();
  }

  init() {
    if (this.isDayMode) {
      const scrollToActive = (smooth = false) => {
        const activeItem = this.dayList ? this.dayList.querySelector('.time-range-day-item.active') : null;
        if (activeItem) {
          this._scrollToCenter(activeItem, smooth);
        }
      };

      requestAnimationFrame(() => scrollToActive(false));
      setTimeout(() => scrollToActive(false), 50);
      setTimeout(() => scrollToActive(true), 300);

      if (!this._hasResizeListener) {
        this._hasResizeListener = true;
        window.addEventListener('resize', () => {
          if (this.isDayMode) {
            scrollToActive(false);
          }
        });
      }
    } else if (this.isCustomRange) {
      this._initCustomRange();
      this._initFakeHandleDrag();
    } else {
      this._initLegacyRange();
      this._initFakeHandleDrag();
    }
  }

  _initFakeHandleDrag() {
    if (!this.fakeHandle || !this.input) return;
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      this.fakeHandle.style.pointerEvents = 'none';
      return;
    }
    
    let isDragging = false;
    
    const onMouseDown = (e) => {
      e.preventDefault();
      isDragging = true;
      
      // Register temporary move and up listeners on window
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      
      // Handle initial click position
      updateValueFromCoords(e.clientX);
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      updateValueFromCoords(e.clientX);
    };
    
    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        
        // Trigger the snap to points on release
        if (this.isCustomRange) {
          this.setValue(this.value);
        } else {
          // Snap in legacy mode
          let closest = this.points.reduce((prev, curr) =>
            Math.abs(curr - this.value) < Math.abs(prev - this.value) ? curr : prev
          );
          if (closest > this.upperLimit) closest = this.upperLimit;
          this.setValue(closest);
        }
      }
    };
    
    const updateValueFromCoords = (clientX) => {
      const rect = this.input.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.max(0, Math.min(1, percent));
      
      const min = Number(this.input.min) || 0;
      const max = Number(this.input.max) || 1440;
      let logicalVal = min + percent * (max - min);
      
      if (this.isCustomRange) {
        if (logicalVal < this.dayStartMinutes) logicalVal = this.dayStartMinutes;
        if (logicalVal > this.dayEndMinutes) logicalVal = this.dayEndMinutes;
        
        // Update input range visually and value
        this.value = logicalVal;
        this.displayValue = logicalVal;
        this.input.value = logicalVal;
        this._updateFakeHandle();
        this._updateValueBox();
        
        // Trigger onChange
        let currentDateObj;
        if (this.isSingleTrack) {
          currentDateObj = new Date(this.startDateTime.getTime() + this.value * 60 * 1000);
          
          // Date select update when crossing midnight during drag
          const curDateStr = formatDate(currentDateObj);
          if (this.dateSelect && this.dateSelect.value !== curDateStr) {
            this.dateSelect.value = curDateStr;
            this.currentDateStr = curDateStr;
            this.currentDayIndex = this.dateList.indexOf(curDateStr);
          }
        } else {
          currentDateObj = new Date(this.currentDateStr + 'T00:00:00');
          currentDateObj.setMinutes(this.value);
        }
        
        this.onChange(formatDate(currentDateObj) + ' ' + formatTime(currentDateObj), formatTime(currentDateObj), currentDateObj);
      } else {
        // Legacy mode logic
        let logical = this._displayToLogical(logicalVal);
        if (logical > this.upperLimit) logical = this.upperLimit;
        
        this.value = logical;
        this.displayValue = this._logicalToDisplay(logical);
        this.input.value = this.displayValue;
        
        this._updateFakeHandle();
        this._updateValueBox();
        this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
      }
    };
    
    this.fakeHandle.addEventListener('mousedown', onMouseDown);
  }

  _initLegacyRange() {
    this.input.min = 0;
    this.input.max = this.trackMax;
    this.input.step = this.step;
    this.input.value = Math.min(this.displayValue, this.trackMax);
    
    if (this._inputHandler) {
      this.input.removeEventListener('input', this._inputHandler);
    }
    this._inputHandler = (e) => {
      let display = Number(e.target.value);
      let logical = this._displayToLogical(display);
      if (logical < this.upperLimit && logical + this.step > this.upperLimit) {
        logical = this.upperLimit;
      }
      if (logical > this.upperLimit) logical = this.upperLimit;
      if (this._displayToLogical(display) !== logical) {
        display = this._logicalToDisplay(logical);
      }
      this.value = logical;
      this.displayValue = display;
      this.input.value = display;
      this._updateFakeHandle();
      this._updateValueBox();
      this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
    };
    this.input.addEventListener('input', this._inputHandler);

    if (this._mouseupHandler) {
      this.input.removeEventListener('mouseup', this._mouseupHandler);
    }
    this._mouseupHandler = (e) => {
      const display = Number(this.input.value);
      const logical = this._displayToLogical(display);
      let closest = this.points.reduce((prev, curr) =>
        Math.abs(curr - logical) < Math.abs(prev - logical) ? curr : prev
      );
      if (closest > this.upperLimit) {
        closest = this.upperLimit;
      }
      const snappedDisplay = this._resolveDisplayFromLogical(closest, display);
      this.value = closest;
      this.displayValue = snappedDisplay;
      this.input.value = snappedDisplay;
      this._updateFakeHandle();
      this._updateValueBox();
      this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
    };
    this.input.addEventListener('mouseup', this._mouseupHandler);

    this._updateFakeHandle();
    this._updateValueBox();

    if (this.dateInput) {
      if (this._dateInputClickHandler) {
        this.dateInput.removeEventListener('click', this._dateInputClickHandler);
      }
      if (this._dateInputChangeHandler) {
        this.dateInput.removeEventListener('change', this._dateInputChangeHandler);
      }

      this._dateInputClickHandler = () => {
        if (typeof this.dateInput.showPicker === 'function') {
          this.dateInput.showPicker();
        }
      };
      this._dateInputChangeHandler = (e) => {
        this.date = e.target.value;
        this._setCurrentDayIndex(0);
        this.setValue(this.value);
      };

      this.dateInput.addEventListener('click', this._dateInputClickHandler);
      this.dateInput.addEventListener('change', this._dateInputChangeHandler);
    }

    if (this.playBtn) {
      if (this._playClickHandler) {
        this.playBtn.removeEventListener('click', this._playClickHandler);
      }
      this._playClickHandler = () => {
        if (this._playTimer) {
          this._stopPlayLegacy();
        } else {
          this._startPlayLegacy();
        }
      };
      this.playBtn.addEventListener('click', this._playClickHandler);
    }

    if (this.playPrev) {
      if (this._playPrevClickHandler) {
        this.playPrev.removeEventListener('click', this._playPrevClickHandler);
      }
      this._playPrevClickHandler = () => {
        this._moveByPointLegacy(-1);
      };
      this.playPrev.addEventListener('click', this._playPrevClickHandler);
    }

    if (this.playNext) {
      if (this._playNextClickHandler) {
        this.playNext.removeEventListener('click', this._playNextClickHandler);
      }
      this._playNextClickHandler = () => {
        this._moveByPointLegacy(1);
      };
      this.playNext.addEventListener('click', this._playNextClickHandler);
    }
  }

  _stopPlayLegacy() {
    if (this._playTimer) {
      clearInterval(this._playTimer);
      this._playTimer = null;
    }
    this.playBtn.removeAttribute('data-toggle-state');
  }

  _startPlayLegacy() {
    if (this._playTimer) return;
    const sortedPoints = this._getSortedPoints();
    const firstPoint = sortedPoints[0] ?? 0;

    if (this.currentDayIndex >= this.totalDays - 1 && this.value >= this.upperLimit) {
      this._setCurrentDayIndex(0);
      const resetPoint = sortedPoints.find((p) => p < this.upperLimit) ?? sortedPoints[0] ?? 0;
      this.setValue(resetPoint);
    }

    this.playBtn.setAttribute('data-toggle-state', 'selected');
    this._playTimer = setInterval(() => {
      let next = sortedPoints.find((p) => p > this.value);
      if (next !== undefined && next <= this.upperLimit) {
        this.setValue(next);
        if (this.currentDayIndex >= this.totalDays - 1 && next >= this.upperLimit) {
          this._stopPlayLegacy();
        }
        return;
      }
      if (this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(firstPoint);
        return;
      }
      this.setValue(this.upperLimit);
      this._stopPlayLegacy();
    }, this.playTime);
  }

  _moveByPointLegacy(direction) {
    if (this._playTimer) {
      this._stopPlayLegacy();
    }

    if (direction > 0) {
      if (this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(0);
      }
    } else {
      if (this.currentDayIndex > 0) {
        this._setCurrentDayIndex(this.currentDayIndex - 1);
        this.setValue(0);
      }
    }
  }

  stopPlay() {
    if (this.isCustomRange) {
      this._stopPlayCustom();
    } else {
      this._stopPlayLegacy();
    }
  }

  setValue(val) {
    if (this.isDayMode) {
      let dateStr = val;
      if (val instanceof Date) {
        dateStr = formatDate(val);
      } else if (typeof val === 'string') {
        dateStr = val.split(' ')[0];
      }
      if (!this.dayItemList || !this.dayItemList.includes(dateStr)) return;
      
      this.selectedDateStr = dateStr;
      
      if (this.dayList) {
        const items = this.dayList.querySelectorAll('.time-range-day-item');
        let selectedItem = null;
        items.forEach(btn => {
          if (btn.getAttribute('data-date') === dateStr) {
            btn.classList.add('active');
            selectedItem = btn;
          } else {
            btn.classList.remove('active');
          }
        });
        if (selectedItem) {
          this._scrollToCenter(selectedItem);
        }
      }
      const selectedDateObj = new Date(dateStr + 'T00:00:00');
      this.onChange(dateStr, selectedDateObj);
    } else if (this.isCustomRange) {
      this._setValueCustom(val);
    } else {
      let v = val;
      if (Array.isArray(v) && v.length === 2) {
        v = v[0] * 60 + v[1];
      }
      if (v > this.upperLimit) v = this.upperLimit;
      this.value = v;
      this.displayValue = this._logicalToDisplay(v);
      this.input.value = this.displayValue;
      this._updateFakeHandle();
      this._updateValueBox();
      this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
    }
  }

  setStep(step) {
    if (this.isDayMode) return;
    if (this.isCustomRange) {
      this._setStepCustom(step);
    } else {
      this.step = step;
      this.input.step = step;
      this.value = 0;
      this.displayValue = this._logicalToDisplay(0);
      this.input.value = this.displayValue;
      this._initLegacyRange();
      this._updateFakeHandle();
      this._updateValueBox();
      this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
    }
  }

  setRelativeHours(hours) {
    if (this.isDayMode || !this.isCustomRange || this.rangeType !== 'relative') return;
    
    this.relativeHours = Math.max(1, Math.min(240, Number(hours) || 24));
    
    // Recalculate start and end datetimes
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const flooredMinutes = Math.floor(totalMinutes / this.step) * this.step;
    this.startDateTime = new Date(now);
    this.startDateTime.setHours(0, 0, 0, 0);
    this.startDateTime.setMinutes(flooredMinutes);
    this.endDateTime = new Date(this.startDateTime.getTime() + this.relativeHours * 60 * 60 * 1000);
    
    // Normalize end date if needed
    if (this.endDateTime.getHours() === 0 && this.endDateTime.getMinutes() === 0 && this.endDateTime > this.startDateTime) {
      this.endDateTime = new Date(this.endDateTime.getTime() - 1);
    }
    
    const totalDurationMs = this.endDateTime.getTime() - this.startDateTime.getTime();
    this.totalHours = totalDurationMs / (1000 * 60 * 60);
    this.isSingleTrack = (this.totalHours <= 24);
    
    // Generate new dates list
    this.dateList = getDatesInRange(this.startDateTime, this.endDateTime);
    this.totalDays = this.dateList.length;
    
    // Reset page index
    this.currentDayIndex = 0;
    this.currentDateStr = this.dateList[0];
    
    // Reconstruct dropdown HTML
    if (this.dateSelect) {
      const optionsHtml = this.dateList.map(dateStr => {
        const dottedDate = dateStr.replace(/-/g, '.');
        return `<option value="${dateStr}">${dottedDate}</option>`;
      }).join('');
      this.dateSelect.innerHTML = optionsHtml;
      this.dateSelect.value = this.currentDateStr;
    }
    
    // Reset track and value
    this._setupTrackForCurrentPage();
    this._initRangeCustom();
    this._setToEarliestTime();
  }

  updateOptions(opt) {
    // 1. Stop any active playback
    if (this._playTimer) {
      if (this.isCustomRange) {
        this._stopPlayCustom();
      } else if (!this.isDayMode) {
        this._stopPlayLegacy();
      }
    }
    
    // 2. Clear wrapper contents
    this.wrap.innerHTML = '';
    
    // 3. Clear event listeners from range input and date picker
    if (this.input) {
      if (this._inputHandler) {
        this.input.removeEventListener('input', this._inputHandler);
      }
      if (this._mouseupHandler) {
        this.input.removeEventListener('mouseup', this._mouseupHandler);
      }
    }
    if (this.dateSelect && this._dateSelectChangeHandler) {
      this.dateSelect.removeEventListener('change', this._dateSelectChangeHandler);
    }
    if (this.dateInput) {
      if (this._dateInputClickHandler) {
        this.dateInput.removeEventListener('click', this._dateInputClickHandler);
      }
      if (this._dateInputChangeHandler) {
        this.dateInput.removeEventListener('change', this._dateInputChangeHandler);
      }
    }
    
    // 4. Reset component properties
    this.rangeType = opt.rangeType;
    this.isDayMode = (this.rangeType === 'day');
    this.isCustomRange = (this.rangeType === 'datetime' || this.rangeType === 'relative');
    if (this.wrap) {
      this.wrap.setAttribute('data-range-type', this.rangeType || 'legacy');
    }
    
    if (this.isDayMode) {
      this._initDay(opt);
    } else {
      const controlsHtml = `
        <div class="time-range-control-area">
          <button type="button" class="timeRange-prev" aria-label="이전">
            <i class="icon-aspect-play-prev" data-size="20"></i>
          </button>
          <button type="button" class="timeRange-play" aria-label="실행"></button>
          <button type="button" class="timeRange-next" aria-label="다음">
            <i class="icon-aspect-play-next" data-size="20"></i>
          </button>
        </div>
        <div class="timeRange-bar">
          <input type="range" class="timeRange-range" />
        </div>
      `;
      this.wrap.innerHTML = controlsHtml;
      
      this.input = this.wrap.querySelector('.timeRange-range');
      this.bar = this.wrap.querySelector('.timeRange-bar');
      this.fake = this.wrap.querySelector('.timeRange-fake-input');
      
      if (this.isCustomRange) {
        this._initCustom(opt);
      } else {
        this._initLegacy(opt);
      }
    }
    
    // 5. Reinitialize handlers and redraw UI
    this.init();
    
    // 6. Reset position if not day mode
    if (!this.isDayMode) {
      if (this.isCustomRange) {
        this._setToEarliestTime();
      } else {
        this.setValue(0);
      }
    }
  }

  setUpperLimit(upperLimit) {
    if (this.isDayMode) return;
    if (this.isCustomRange) {
      // Upper limit is dynamic in custom range
    } else {
      if (Array.isArray(upperLimit) && upperLimit.length === 2) {
        this.upperLimit = upperLimit[0] * 60 + upperLimit[1];
      } else {
        this.upperLimit = Number(upperLimit);
      }
      if (this.upperLimit > this.max) {
        this.upperLimit = this.max;
      }
      if (this.value > this.upperLimit) {
        this.setValue(this.upperLimit);
      }
      this._initLegacyRange();
      this._updateFakeHandle();
      this._updateValueBox();
    }
  }

  setTotalDays(totalDays) {
    if (this.isDayMode) return;
    if (this.isCustomRange) {
      // Dynamic in custom range
    } else {
      this.totalDays = this._normalizeTotalDays(totalDays);
      if (this.currentDayIndex > this.totalDays - 1) {
        this._setCurrentDayIndex(this.totalDays - 1);
        this.setValue(Math.min(this.value, this.upperLimit));
      } else {
        this._setCurrentDayIndex(this.currentDayIndex);
      }
    }
  }

  setPlayTime(playTime) {
    if (this.isDayMode) return;
    this.playTime = playTime;
    if (this._playTimer) {
      if (this.isCustomRange) {
        this._stopPlayCustom();
        this._startPlayCustom();
      } else {
        this._stopPlayLegacy();
        this._startPlayLegacy();
      }
    }
  }

  setPoint(point) {
    if (this.isDayMode) return;
    if (this.isCustomRange) {
      this.optPoint = point;
      this._setupTrackForCurrentPage();
    } else {
      let pointClass = '';
      if (typeof point === 'number') {
        const interval = point;
        this.points = [];
        for (let i = 0; i <= this.max; i += interval) {
          this.points.push(i);
        }
        if (this.points[this.points.length - 1] < this.max) {
          this.points.push(this.max);
        }
        if (this.points[this.points.length - 1] > this.max) {
          this.points[this.points.length - 1] = this.max;
        }
        pointClass = `time-${interval}`;
      } else if (Array.isArray(point)) {
        this.points = point.slice();
        if (this.points[this.points.length - 1] > this.max) {
          this.points[this.points.length - 1] = this.max;
        }
        if (point.length === 1 && typeof point[0] === 'number') {
          pointClass = `time-${point[0]}`;
        } else {
          pointClass = '';
        }
      } else {
        const interval = 60;
        this.points = [];
        for (let i = 0; i <= this.max; i += interval) {
          this.points.push(i);
        }
        if (this.points[this.points.length - 1] < this.max) {
          this.points.push(this.max);
        }
        pointClass = `time-${interval}`;
      }
      if (this.wrap && pointClass) {
        this.wrap.classList.forEach(cls => {
          if (cls.startsWith('time-')) this.wrap.classList.remove(cls);
        });
        this.wrap.classList.add(pointClass);
      }
    }
  }

  /**
   * 현재 시각을 기준으로 슬라이더를 스냅 위치로 이동시킵니다.
   * @param {number} intervalMinutes 스냅 간격(분). 3시간=180, 1시간=60
   * @param {object} options
   *   mode: 'floor' (기본값) → 현재시각 기준 가장 가까운 "이전" 정시로 스냅 (world/shrt 3시간용)
   *         'nearestBuffer' → 정시 반올림 후 bufferMinutes만큼 뒤로 미뤄서 스냅 (vsrt 1시간용)
   *   bufferMinutes: nearestBuffer 모드에서 더해줄 분 (vsrt는 60 = "정시 반올림 +1시간")
   */
  moveToCurrentTime(intervalMinutes, { mode = 'ceil', bufferMinutes = 1 } = {}) {
    const now = new Date();
    const totalMinutesNow = now.getHours() * 60 + now.getMinutes();

    let targetMinutes;
    if (mode === 'nearestBuffer') {
      const nearest = Math.round(totalMinutesNow / intervalMinutes) * intervalMinutes;
      targetMinutes = nearest + bufferMinutes;
    } else {
      // ceil: 예보자료이므로 현재시각을 이미 지난 슬롯으로 보지 않고 다음 슬롯으로 올림
      targetMinutes = Math.ceil((totalMinutesNow + bufferMinutes) / intervalMinutes) * intervalMinutes;
    }

    let dayCarry = 0;
    if (targetMinutes >= 1440) {
      dayCarry = Math.floor(targetMinutes / 1440);
      targetMinutes = targetMinutes % 1440;
    }

    if (this.isCustomRange) {
      const targetDate = new Date(now);
      targetDate.setHours(0, 0, 0, 0);
      targetDate.setDate(targetDate.getDate() + dayCarry);
      targetDate.setMinutes(targetMinutes);
      this._setValueByDateTime(targetDate);
    } else {
      this._setCurrentDayIndex(dayCarry !== 0 ? this.currentDayIndex + dayCarry : 0);
      this.setValue(targetMinutes);
    }
  }

  configureDataRange(config) {
    const { startOffset, dataCount, dataInterval, baseDate } = config;
    const baseMidnight = new Date(`${baseDate}T00:00:00`);
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    const startDT = new Date(baseMidnight.getTime() + startOffset * 60000);
    const endMinutes = startOffset + (dataCount - 1) * dataInterval;
    const endDT = new Date(baseMidnight.getTime() + endMinutes * 60000);

    this.updateOptions({
      rangeType: 'datetime',
      start: fmt(startDT),
      end: fmt(endDT),
      step: dataInterval,
      point: dataInterval,
      onChange: this.onChange,
      playTime: this.playTime,
    });
  }
  /**
   * relative 모드 시작 시각 계산 (예보자료이므로 과거 슬롯 제외, 다음 슬롯으로 올림)
   */
  _calcRelativeStart(stepMinutes) {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const bufferMinutes = 1; // 정각에 걸쳐있어도 다음 슬롯으로 넘어가게 하는 버퍼
    let ceiledMinutes = Math.ceil((totalMinutes + bufferMinutes) / stepMinutes) * stepMinutes;

    let dayCarry = 0;
    if (ceiledMinutes >= 1440) {
      dayCarry = Math.floor(ceiledMinutes / 1440);
      ceiledMinutes = ceiledMinutes % 1440;
    }

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + dayCarry);
    start.setMinutes(ceiledMinutes);
    return start;
  }
}