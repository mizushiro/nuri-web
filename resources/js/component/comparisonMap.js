export class ComparisonMap {
  constructor(opt) {
    this.id = opt.id;
    this.wrap = document.querySelector(`[data-comparison-map="${this.id}"]`);
    this.left = this.wrap.querySelector(`[data-comparison-left="${this.id}"]`);
    this.right = this.wrap.querySelector(`[data-comparison-right="${this.id}"]`);
    this.handle = this.wrap.querySelector(`[data-comparison-handle="${this.id}"]`);

    this.init();
  }

  init() {
    this.handle.addEventListener('mousedown', this.startDrag);
    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.stopDrag);
  }

  startDrag = (e) => {
    e.preventDefault();
    this.isDragging = true;
    this.dragStartX = e.clientX;
    // handle의 현재 위치를 wrap 기준으로 저장
    const wrapRect = this.wrap.getBoundingClientRect();
    const handleRect = this.handle.getBoundingClientRect();
    this.startLeft = handleRect.left - wrapRect.left;
  }

  onDrag = (e) => {
    if (!this.isDragging) return;
    const wrapRect = this.wrap.getBoundingClientRect();
    const handleRect = this.handle.getBoundingClientRect();
    const maxMove = wrapRect.width - handleRect.width;
    // 드래그 시작 위치 + 마우스 이동량
    let newLeft = this.startLeft + (e.clientX - this.dragStartX);
    newLeft = Math.max(0, Math.min(newLeft, maxMove));
    const leftPercent = (newLeft / maxMove) * 100;
    this.wrap.style.gridTemplateColumns = `${leftPercent}% auto 1fr`;
  }

  stopDrag = (e) => {
    if (!this.isDragging) return;
    this.isDragging = false;
    // 드래그 종료 후 추가 동작 필요시 여기에 작성
  }
}

export class TimeRangeHistory {

  constructor(opt) {
    this.baseKST = new Date(opt.date);
    this.baseKST.setHours(0, 0, 0, 0);
    const minmaxArr = [];
    const minmaxDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    minmaxArr[0] = minmaxDate(this.baseKST);
    const endDate = new Date(this.baseKST);
    endDate.setDate(this.baseKST.getDate() + 3);
    minmaxArr[1] = minmaxDate(endDate);


    this.max = 24 * 60;
    this.trackOffset = 0;
    this.trackMax = this.max;
    this.timeScale = 1;
    this.id = opt.id;
    this.wrap = document.querySelector(`.timeRange[data-time-range="${this.id}"]`);
    this.input = this.wrap.querySelector('.timeRange-range');
    this.bar = this.wrap.querySelector('.timeRange-bar');
    this.step = opt.step || 10; // 기본 10분
    this.date = opt.date || new Date().toISOString().split('T')[0]; // 날짜 설정 (YYYY-MM-DD)
    this.minmaxDay = opt.minmaxDay || null; // 선택 가능한 날짜 범위 설정 (YYYY-MM-DD)
    this.totalDays = this._normalizeTotalDays(opt.totalDays ?? opt.days ?? opt.dayCount ?? 4);
    this.currentDayIndex = 0;
    this.currentDate = this._addDaysToDate(this.date, this.currentDayIndex);

    this.upperLimit = this.max;
    this.onChange = opt.onChange || function () {};
    this.playTime = opt.playTime || 3000;

    this.rangeday = this.wrap.querySelector('.timeRange-date-input');

    this._firstDayOffset = opt.startOffset ?? 9 * 60;
    this._dataCount = opt.dataCount ?? 80;  // 데이터 개수
    this._dataCount = opt.dataCount ?? 24;  // 데이터 개수
    this._dataInterval = opt.dataInterval ?? 180;  // 데이터 간격(분)

    const totalMinutes = this._firstDayOffset + (this._dataCount - 1) * this._dataInterval;
    this._lastDayIndex = Math.floor(totalMinutes / this.max);  // 3
    this._lastPointValue = totalMinutes % this.max;  // 360 = 06:00

    // 3일치 시간 구간 생성 (3시간 간격)
    const timeSlots = [];
    for (let i = 0; i < 24; i += 1) {
      const dt = new Date(this.baseKST.getTime() + i * 60 * 60 * 1000);
      timeSlots.push(dt);
    }

    const dayGroups = {};
    timeSlots.forEach(dt => {
      const dateKey = `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
      if (!dayGroups[dateKey]) dayGroups[dateKey] = [];
      dayGroups[dateKey].push(dt);
    });


    if (Array.isArray(opt.value) && opt.value.length === 2) {
      // 기본 분 환산 값에 9시간(9 * 60분)을 더하기
      this.value = (opt.value[0] * 60 + opt.value[1]) + (9 * 60);
    } else if (typeof opt.value === 'number') {
      this.value = opt.value + (9 * 60);
    } else {
      this.value = 9 * 60; // 값이 없을 때도 기본 09:00(KST) 시작
    }

    // 만약 9시간을 더해서 24:00(1440분)을 초과한다면 하루 주기를 순환하도록 보정
    this.value = this.value % (24 * 60);

    const makeTimeRangeHtml = () => {
      let lineHtml = `<div class="time-range-day">
        <i class="icon-aspect-calendar-b" data-size="20"></i>
          <div class="timeRange-date-input">${this.currentDate}${this._formatTime(this.value)}</div>
          
      </div>
      <div class="timeRange-line">
          `;

      Object.entries(dayGroups).forEach(([dateLabel, slots]) => {
        slots.forEach((dt) => {
          const hh = String(dt.getHours()).padStart(2, '0');
          const mm = String(dt.getMinutes()).padStart(2, '0');
          lineHtml += `<div class="timeRange-hour"><hr><hr><hr><hr><hr><hr><b>${hh}:${mm}</b></div>`;
        });
      });
      lineHtml += `</div>`;

      const fakeInputHtml = `</div>
    <div class="timeRange-fake-input">
      <div class="timeRange-fake-handle">
        <b class="timeRange-fake-value"></b>
      </div>
      <div class="timeRange-fake-track">
        <div class="timeRange-today">
            <b class="timeRange-today-text">${this._formatTime(this.value)}</b>
        </div>
      </div>
    </div>`;


      return lineHtml + fakeInputHtml;
    };

    const insertHtml = makeTimeRangeHtml();

    if (this.rangeday) {
      this.rangeday.value = minmaxArr[0];
      this.rangeday.min = minmaxArr[0];
      this.rangeday.max = minmaxArr[1];
    }

    this.bar.insertAdjacentHTML('beforeend', insertHtml);
    this.fakeHandle = this.wrap.querySelector('.timeRange-fake-handle');
    this.fakeTrack = this.wrap.querySelector('.timeRange-fake-track');
    this.fakeTodayText = this.wrap.querySelector('.timeRange-today-text');
    // this.fakeTodayText.textContent = `${new Date(this.date).getMonth() + 1}월 ${new Date(this.date).getDate()}일`;

    // point 처리: 숫자면 배열로 변환, 마지막 값 1440(24*60) 초과시 1440으로 보정
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

    // .timeRange에 time-xxx 클래스 추가 (기존 time-xxx 제거)
    if (this.wrap && pointClass) {
      this.wrap.classList.forEach(cls => {
        if (cls.startsWith('time-')) this.wrap.classList.remove(cls);
      });
      this.wrap.classList.add(pointClass);
    }
    this.onChange = opt.onChange || function () {
    };
    this.valueBox = this.wrap.querySelector('.timeRange-fake-value');
    this.dateInput = this.wrap.querySelector('.timeRange-date-input');
    this.playTime = opt.playTime || 3000; // 기본 3초
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

    this.displayValue = this._logicalToDisplay(this.value);
    // upperLimit 옵션 처리 (실제 선택 제한용)
    // if (opt.upperLimit) {
    //   if (Array.isArray(opt.upperLimit) && opt.upperLimit.length === 2) {
    //     this.upperLimit = opt.upperLimit[0] * 60 + opt.upperLimit[1];
    //   } else {
    //     this.upperLimit = Number(opt.upperLimit);
    //   }
    // } else {
    //   this.upperLimit = this.max; // 제한 없으면 24:00
    // }
    // if (this.upperLimit > this.max) {
    //   this.upperLimit = this.max;
    // }
    // // this._initRange();
    // // this._updateFakeHandle();
    // // this._updateValueBox();
    // // upperLimit보다 value가 크면 보정
    // if (this.value > this.upperLimit) {
    //   this.setValue(this.upperLimit);
    // }
    this.upperLimit = this.max;
  }

  setPoint(point) {
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
    // .timeRange에 time-xxx 클래스 추가 (기존 time-xxx 제거)
    if (this.wrap && pointClass) {
      this.wrap.classList.forEach(cls => {
        if (cls.startsWith('time-')) this.wrap.classList.remove(cls);
      });
      this.wrap.classList.add(pointClass);
    }
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

  _setCurrentDayIndex(dayIndex) {
    const maxDayIndex = Math.min(Math.max(0, this.totalDays - 1), this._lastDayIndex ?? this.totalDays - 1);

    this.currentDayIndex = Math.min(Math.max(0, dayIndex), maxDayIndex);
    this.currentDate = this._addDaysToDate(this.date, this.currentDayIndex);
    if (this.dateInput) {
        this.dateInput.value = this.currentDate;
    }
  }

  _getSortedPoints() {
    const points = [...new Set(this.points)]
      .map((p) => Number(p))
      .filter((p) => !Number.isNaN(p))
      .sort((a, b) => a - b);

    // 첫째 날이면 startOffset 미만 제거
    if (this.currentDayIndex === 0) {
      return points.filter(p => p >= this._firstDayOffset);
    }
    return points;
  }

  _moveByPoint(direction) {
    const sortedPoints = this._getSortedPoints();
    if (!sortedPoints.length) return;

    if (this._playTimer) {
      this._stopPlay();
    }

    const ONE_DAY_MINUTES = 24 * 60;
    if (direction > 0) {
      // ▶▶ 버튼 (+24시간 이동)
      const targetNextDayPoint = this.value + ONE_DAY_MINUTES;
      const nextDayPoint = sortedPoints.find((p) => p >= targetNextDayPoint && p <= this.upperLimit);
      if (nextDayPoint !== undefined) {
        const daysAdvanced = Math.floor((nextDayPoint - this.value) / ONE_DAY_MINUTES);

        const nextDayIndex = this.currentDayIndex + daysAdvanced;

        // 마지막 날 초과 방지
        if (nextDayIndex > this._lastDayIndex) {
          this._setCurrentDayIndex(this._lastDayIndex);
          this.setValue(this._lastPointValue);
          return;
        }

        // 마지막 날인데 포인트가 lastPointValue 초과
        if (nextDayIndex === this._lastDayIndex && nextDayPoint > this._lastPointValue) {
          this._setCurrentDayIndex(this._lastDayIndex);
          this.setValue(this._lastPointValue);
          return;
        }

        if (daysAdvanced > 0) {
          this._setCurrentDayIndex(nextDayIndex);
        }

        this.setValue(nextDayPoint);
        return;
      }

      /*if (this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        // this.setValue(this.value);

        // 마지막 날이면 lastPointValue 초과 못하게
        if (this.currentDayIndex >= this._lastDayIndex) {
          this.setValue(Math.min(this.value, this._lastPointValue));
        } else {
          this.setValue(this.value);
        }
        return;
      }*/

      if (this.currentDayIndex < this._lastDayIndex) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        if (this.currentDayIndex >= this._lastDayIndex) {
          this.setValue(Math.min(this.value, this._lastPointValue));
        } else {
          this.setValue(this.value);
        }
        return;
      }

      // this.setValue(this.upperLimit);
      this.setValue(this._lastPointValue);
      return;

      /*const nextPoint = sortedPoints.find((p) => p > this.value && p <= this.upperLimit);
      if (nextPoint !== undefined) {
        this.setValue(nextPoint);
        return;
      }

      if (this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(sortedPoints[0]);
        return;
      }

      this.setValue(this.upperLimit);
      return;*/
    } else {
      // ◀◀ 버튼 (-24시간 이동)
      const targetPrevDayPoint = this.value - ONE_DAY_MINUTES;
      const prevDayPoint = [...sortedPoints].reverse().find((p) => p <= targetPrevDayPoint && p >= 0);
      if (prevDayPoint !== undefined) {
        const daysRegressed = Math.floor((this.value - prevDayPoint) / ONE_DAY_MINUTES);
        if (daysRegressed > 0 && this.currentDayIndex - daysRegressed >= 0) {
          this._setCurrentDayIndex(this.currentDayIndex - daysRegressed);
        }

        // 첫째 날이면 _firstDayOffset 미만으로 못 가게
        if (this.currentDayIndex === 0 && prevDayPoint < this._firstDayOffset) {
          this.setValue(this._firstDayOffset);
      return;
    }

        this.setValue(prevDayPoint);
        return;
      }

      if (this.currentDayIndex > 0) {
        this._setCurrentDayIndex(this.currentDayIndex - 1);
        // this.setValue(this.value);
        // 첫째 날로 돌아오면 _firstDayOffset으로 고정
        if (this.currentDayIndex === 0) {
          this.setValue(this._firstDayOffset);
        } else {
          this.setValue(this.value);
        }
        return;
      }
    }

    // this.setValue(sortedPoints[0]);
    // 첫째 날 첫번째 포인트
    this.setValue(this._firstDayOffset);

    /* const prevCandidates = sortedPoints.filter((p) => p < this.value);
    if (prevCandidates.length) {
      this.setValue(prevCandidates[prevCandidates.length - 1]);
      return;
    }

    if (this.currentDayIndex > 0) {
      this._setCurrentDayIndex(this.currentDayIndex - 1);
      const prevDayPoint = [...sortedPoints].reverse().find((p) => p <= this.upperLimit) ?? this.upperLimit;
      this.setValue(prevDayPoint);
      return;
    }

     this.setValue(sortedPoints[0]);*/
  }

  _startPlay() {
    if (this._playTimer) return;
    const sortedPoints = this._getSortedPoints();
    
    // 마지막 날까지 모두 완료된 상태에서 다시 재생하면 첫째 날부터 재시작
    // if (this.currentDayIndex >= this.totalDays - 1 && this.value >= this.upperLimit) {
    //   this._setCurrentDayIndex(0);
    //   const resetPoint = sortedPoints.find((p) => p < this.upperLimit) ?? sortedPoints[0] ?? 0;
    //   this.setValue(resetPoint);
    // }

    // 마지막 날 마지막 포인트 계산
    const allSortedPoints = [...new Set(this.points)]
        .map(p => Number(p))
        .filter(p => !Number.isNaN(p))
        .sort((a, b) => a - b);
    // 마지막 날 마지막 포인트에 있으면 처음부터 재시작
    if (this.currentDayIndex >= this._lastDayIndex && this.value >= this._lastPointValue) {
      this._setCurrentDayIndex(0);
      this.setValue(this._firstDayOffset);
    }

    this.playBtn.setAttribute('data-toggle-state', 'selected');
    this._playTimer = setInterval(() => {
      let next = allSortedPoints.find((p) => p > this.value);

      /*if (next !== undefined && next <= this.upperLimit) {
        this.setValue(next);
        if (this.currentDayIndex >= this.totalDays - 1 && next >= this.upperLimit) {
          this._stopPlay();
        }

        return;
      }

      if (this.currentDayIndex < this.totalDays - 1) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        // this.setValue(firstPoint);
        // 다음 날은 0번 포인트(00:00)부터 시작
        this.setValue(allSortedPoints[0]);
        return;
      }*/

      if (next !== undefined) {
        // 마지막 날이면 lastPointValue 초과 못하게
        if (this.currentDayIndex >= this._lastDayIndex && next > this._lastPointValue) {
          this.setValue(this._lastPointValue);
          this._stopPlay();
          return;
        }
        // 24:00이면 다음 날 00:00으로 이동
        if (next === this.max && this.currentDayIndex < this._lastDayIndex) {
          this._setCurrentDayIndex(this.currentDayIndex + 1);
          this.setValue(0);
          return;
        }
        this.setValue(next);
        return;
      }

      // 현재 날 포인트 다 소진 → 다음 날로
      if (this.currentDayIndex < this._lastDayIndex) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        this.setValue(allSortedPoints[0]);  // 다음 날 00:00부터
        return;
      }

      // 마지막 날 마지막 포인트
      this.setValue(this._lastPointValue);
      this._stopPlay();

      // this.setValue(this.upperLimit);
      // this._stopPlay();
    }, this.playTime);
  }

  _stopPlay() {
    if (this._playTimer) {
      clearInterval(this._playTimer);
      this._playTimer = null;
    }
    this.playBtn.removeAttribute('data-toggle-state');
  }

  _initRange() {
    // 00-...-24 직선축(0~1440분), step 적용
    this.input.min = 0;
    this.input.max = this.max;
    this.input.step = this.step;
    this.input.value = Math.min(this.displayValue, this.trackMax);
    // input 이벤트 중복 방지
    if (this._inputHandler) {
      this.input.removeEventListener('input', this._inputHandler);
    }
    this._inputHandler = (e) => {
      let display = Number(e.target.value);
      let logical = this._displayToLogical(display);

      // 첫째 날 startOffset 미만으로 못 가게
      if (this.currentDayIndex === 0 && logical < this._firstDayOffset) {
        logical = this._firstDayOffset;
        display = this._logicalToDisplay(logical);
      }

      // 마지막 날 제한
      if (this.currentDayIndex >= this._lastDayIndex && logical > this._lastPointValue) {
        logical = this._lastPointValue;
        display = this._logicalToDisplay(logical);
      }

      // step 단위로 이동 시 upperLimit보다 적게 남아도 마지막 이동에서 upperLimit로 snap
      // (예: 900→1080, step=180, upperLimit=1000이면 900→1000으로 이동)
      if (logical < this.upperLimit && logical + this.step > this.upperLimit) {
        logical = this.upperLimit;
      }
      if (logical > this.upperLimit) logical = this.upperLimit;
      // 드래그 중에는 마우스 위치를 그대로 유지하고, mouseup에서만 최종 위치 보정
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

    // 마우스업 시 step 기준으로 스냅
    if (this._mouseupHandler) {
      this.input.removeEventListener('mouseup', this._mouseupHandler);
      this.input.removeEventListener('touchend', this._mouseupHandler);
    }
    this._mouseupHandler = (e) => {
      const display = Number(this.input.value);
      const logical = this._displayToLogical(display);
      const validPoints = this._getSortedPoints();  // ← _getSortedPoints 사용
      // point 배열에서 가장 가까운 값으로 스냅
      let closest = validPoints.reduce((prev, curr) =>
        Math.abs(curr - logical) < Math.abs(prev - logical) ? curr : prev
      );
      // let closest = this.points.reduce((prev, curr) =>
      //   Math.abs(curr - logical) < Math.abs(prev - logical) ? curr : prev
      // );


      // 첫째 날 startOffset 미만 제한
      if (this.currentDayIndex === 0 && closest < this._firstDayOffset) {
        closest = this._firstDayOffset;
      }

      // 마지막 날 lastPointValue 초과 제한
      if (this.currentDayIndex >= this._lastDayIndex && closest > this._lastPointValue) {
        closest = this._lastPointValue;
      }

      if (closest > this.upperLimit) {
        closest = this.upperLimit;
      }

      // 24:00(1440)이면 다음 날 00:00으로 이동
      if (closest === this.max && this.currentDayIndex < this._lastDayIndex) {
        this._setCurrentDayIndex(this.currentDayIndex + 1);
        closest = 0;
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
    this.input.addEventListener('touchend', this._mouseupHandler);
  }
  _updateValueBox() {
    if (!this.fakeTodayText) return;
      this.fakeTodayText.textContent = this._formatTime(this.value);
  }
  _updateFakeHandle() {
    if (!this.fakeHandle) return;
    // 백분율 위치 계산
    const percent = (this.displayValue - this.input.min) / (this.input.max - this.input.min) * 100;
    this.fakeHandle.style.left = `calc(${percent}% )`;
    this.fakeTrack.style.width = `${percent}%`;
    this._updateDateTooltip();
  }

  _displayToLogical(displayVal) {
    // if (displayVal >= this.trackMax) return this.max;
    // const shifted = displayVal - this.trackOffset;
    // return shifted < 0 ? shifted + this.max : shifted;
    return Math.min(displayVal, this.max);
  }

  _logicalToDisplay(logicalVal) {
    // if (logicalVal >= this.max) return this.trackMax;
    // return logicalVal + this.trackOffset;
    return Math.min(logicalVal, this.trackMax);
  }

  _resolveDisplayFromLogical(logicalVal, referenceDisplay) {
    // mouseup 최종 보정 규칙
    // 1) 최종값이 24:00이면 항상 00:00 위치로 이동
    // if (logicalVal === this.max) return this.trackOffset;
    // 2) 최종값이 23:00이면 항상 뒤쪽(22-23-24 구간)의 23:00 위치로 이동
    // if (logicalVal === this.max - 60) return this.trackMax - this.trackOffset;
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
    if (this.dateInput) {
      if (this.dateInput.tagName === 'INPUT') {
        this.dateInput.value = this.currentDate;
      } else {
        this.dateInput.textContent = `${this.currentDate} ${this._formatTime(this.value)}`;
      }
    }
  }

  setStep(step) {
    this.step = step;
    this.input.step = step;
    // step 변경 시 현재 값도 step에 맞게 보정
    this.value = Math.round(this.value / step) * step;
    this.displayValue = this._logicalToDisplay(this.value);
    this.input.value = this.displayValue;
    this._updateFakeHandle();
    this._updateValueBox();
    this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
  }

  setValue(val) {
    let v = val;
    if (v > this.upperLimit) v = this.upperLimit;
    this.value = v;
    this.displayValue = this._logicalToDisplay(v);
    this.input.value = this.displayValue;
    this._updateFakeHandle();
    this._updateValueBox();
    this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
  }

  init() {
    // 외부에서 호출 시에도 값/step 반영
    this._initRange();
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

    // playBtn 이벤트 중복 방지
    if (this.playBtn) {
      if (this._playClickHandler) {
        this.playBtn.removeEventListener('click', this._playClickHandler);
      }
      this._playClickHandler = () => {
        console.log('playBtn clicked', this.playBtn.getAttribute('data-toggle-state'));
        if (this.playBtn.getAttribute('data-toggle-state') !== 'selected') {
          this._stopPlay();
        } else {
          this._startPlay();
        }
      };
      this.playBtn.addEventListener('click', this._playClickHandler);
    }

    if (this.playPrev) {
      if (this._playPrevClickHandler) {
        this.playPrev.removeEventListener('click', this._playPrevClickHandler);
      }
      this._playPrevClickHandler = () => {
        this._moveByPoint(-1);
      };
      this.playPrev.addEventListener('click', this._playPrevClickHandler);
    }

    if (this.playNext) {
      if (this._playNextClickHandler) {
        this.playNext.removeEventListener('click', this._playNextClickHandler);
      }
      this._playNextClickHandler = () => {
        this._moveByPoint(1);
      };
      this.playNext.addEventListener('click', this._playNextClickHandler);
    }
  }

  setUpperLimit(upperLimit) {
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
    this._initRange();
    this._updateFakeHandle();
    this._updateValueBox();
  }

  setTotalDays(totalDays) {
    this.totalDays = this._normalizeTotalDays(totalDays);
    if (this.currentDayIndex > this.totalDays - 1) {
      this._setCurrentDayIndex(this.totalDays - 1);
      this.setValue(Math.min(this.value, this.upperLimit));
    } else {
      this._setCurrentDayIndex(this.currentDayIndex);
    }
  }

  setPlayTime(playTime) {
    this.playTime = playTime;
    // 재생 중이면 즉시 반영
    if (this._playTimer) {
      this._stopPlay();
      this._startPlay();
    }
  }

  setStep(step) {
    this.step = step;
    this.input.step = step;
    // step 변경 시 현재 값도 step에 맞게 보정
    this.value = Math.round(this.value / step) * step;
    this.displayValue = this._logicalToDisplay(this.value);
    this.input.value = this.displayValue;
    this._initRange();
    this._updateFakeHandle();
    this._updateValueBox();
    this.onChange(this._getActualValue(this.value), this._formatTime(this.value));
  }

  setValue(val) {
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
