const timebar = new Vue({
    el: '#timebar',
    data: {
        DateTime: luxon.DateTime,
        type: "",
        contentType: "obs",
        typeList: [],
        displayDate: null,
        startDatetime: 'startDatetime',
        data: [],
        dateList: [], // Date 객체
        display: false,
        initialIndex: null,
        value: 0, // active data index
        dayValue: null, // active day index
        intervalFunction: null,
        interval: "500",
        playing: false,
        loaded: false,
        autoPlay: true, // 지도 조작 시 wmts 요청이 되어서 자동으로 play됨
        waitCount: 0,
        preprocess: [],	// function
        dateFormat: null,
        dateFormatList: {
            "ko-default": new Intl.DateTimeFormat('ko-KR', {weekday: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: "h23" }),
            "ko-short": new Intl.DateTimeFormat('ko-KR', {weekday: 'short', day: 'numeric', hourCycle: "h23" }),
            "ko-hm": new Intl.DateTimeFormat('ko-KR', {hour: 'numeric', minute: 'numeric', hourCycle: "h23" }),
        },
        lang: "ko",

        isDragging: false,
        dragEnded: false,
        startX: 0,
        startTranslateX: 0,
        currentTranslateX: null,
        maxTranslateX: 0,
        scrollLeft: null,
        startValue: null,
        valueOffset: 0,
        latestClientX: 0,
        isUpdateScheduled: false,
        animationFrameId: null,
        dragElement: null,
    },
    computed: {
        currentDate: function() {
            return this.displayDate || null;
        },
        uniqueDateList: function() {
            return [...new Set(
                this.dateList?.map(ts => ts.toISODate())
            )].map(str => this.DateTime.fromISO(str));
        },
        timebarDayTranslationStyle() {
            let standard = Math.floor(this.uniqueDateList.length / 2);
            let remainder = this.uniqueDateList.length % 2 == 0 ? 0.5 : 0;
            let offset = this.dayValue - standard + remainder;

            let x = -128 * offset;

            if (this.isDragging && this.dragElement == 'timebar-days') {
                x = this.currentTranslateX;
            }

            return {
                transform: `translateX(${x}px)`,
            };
        },
        timebarHourTranslationStyle() {
            let standard = Math.floor(this.dateList.length / 2);
            let remainder = this.dateList.length % 2 == 0 ? 0.5 : 0;
            let offset = (this.value - standard + remainder);
            let x = -64 * offset;

            if (this.isDragging && this.dragElement == 'timebar-hours') {
                x = this.currentTranslateX;
            }

            return {
                transform: `translateX(${x}px)`,
            };
        },
        displayLabel () {
            if (['seaWAV', 'seaWSD', 'seaVEC'].includes(this.type) && this.value < 4) {
                return 'obs';
            }
            else if (this.type == 'sobs-pop' && this.value == 0) {
                return 'obs';
            }
            else if (this.type == 'simple-pop') {
                return this.value <= this.initialIndex ? 'obs' : 'prdt';
            }
            else {
                return this.contentType;
            }
        }
    },
    created: function () {
        this.dateFormat = this.dateFormatList[`${this.lang}-default`];
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeyDown);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
        /**
         * type
         * initValue 시작 위치
         * dateList는 utc 상태로 들어온다/ String (서버에서 LocalDateTime이 String형태로 넘어오는 모습)
         */
        setTimebar: function(type, data, initValue, preprocess) {
            this.data = data;

            if (this.intervalFunction) {
                this.stop();
            }
            if (data === null) {
                this.typeList = this.removeItem(this.typeList, type);
                this.delPreprocess({type: type, preprocess: preprocess});
                if(this.typeList.length === 0) {
                    this.dateList = [];
                    this.display = false;
                    this.loaded = false;
                    this.autoPlay = true;
                    this.setDateFormat("default");
                }
            } else {
                this.type = type;
                // this.typeList.push(type);

                // if(this.dateList.length > data.length) {
                    this.dateList = [];
                // }
                if (this.dateList.length === 0) {
                    for(let d of data) {
                        let dt = this.DateTime.fromFormat(d.ftm, 'yyyyMMddhh');
                        this.dateList.push(dt);
                    }
                }
                if (typeof initValue === 'number') {
                    this.initialIndex = initValue;
                    this.setIndex(initValue);
                }
                else {
                    this.value = initValue ? 0: dateList.length - 1;
                    this.initialIndex = null;
                }
                this.displayDate = this.dateList[this.value];
                this.display = true;
                document.body.classList.add('timebar-enabled');

                // const today = this.DateTime.now();
                // this.dayValue = this.uniqueDateList.findIndex((date) => date.hasSame(today, 'day'));
                this.dayValue = this.uniqueDateList.findIndex((date) => date.hasSame(this.currentDate, 'day'));
                if (this.dayValue < 0) this.dayValue = 0;

                if (preprocess !== undefined) { // 타임바를 조작할 때 전처리가 있는 경우
                    this.loaded = false;
                    this.addPreprocess({type: type, preprocess: preprocess});
                }
            }
        },
        play() {
            const _this = this;
            const max = this.dateList.length;
            this.playing = true;
            if (!this.intervalFunction) {
                this.intervalFunction = setInterval(function () {
                    let value = Number(_this.value) + 1;
                    if(value >= max) {
                        value = 0;
                    }
                    _this.setIndex(value);
                }, Number(this.interval));
            }
        },
        stop() {
            clearInterval(this.intervalFunction);
            this.intervalFunction = null;
            this.playing = false;
            this.autoPlay = false;
        },
        setIndex(value, flag) {
            if (this.dragEnded) return;

            const _this = this;
            this.value = Number(value);
            if (this.value < 0) this.value = 0;
            if (this.value >= this.dateList.length) this.value = this.dateList.length;

            this.displayDate = this.dateList[this.value];

            const dayIndex = this.uniqueDateList.findIndex((date) => date.hasSame(this.currentDate, 'day'));
            this.setDayIndex(dayIndex);

            // // trigger image player
            // if (!flag) {
                currentImagePlayer.setImage(value);
            // }
        },
        setDayIndex(index, flag) {
            if (this.dragEnded) return;

            index = Number(index);
            if (index < 0) index = 0;
            if (index >= this.uniqueDateList.length) index = this.uniqueDateList.length - 1;

            const offset = index - this.dayValue;

            this.dayValue = index;

            let targetDate = this.currentDate.plus({'days': offset});
            let i = this.dateList.findIndex((date) => date.hasSame(targetDate, 'hour'));

            if (i < 0) {
                targetDate = this.uniqueDateList[index];
                i = this.dateList.findIndex((date) => date.hasSame(targetDate, 'day'));
            }

            if (flag) {
                this.setIndex(i);
            }
        },
        changeInterval() {
            if(this.playing) {
                this.stop();
                this.play();
            }
        },
        addPreprocess(prepross) {
            const radar = ["pop", "pty"];
            if (radar.includes(prepross.type)) {
                this.preprocess.push(prepross);
            } else {
                this.preprocess.unshift(prepross);
            }
        },
        delPreprocess(prepross) {
            let delIndex = -1, index = 0;
            for (p of this.preprocess) {
                if(p.type === prepross.type) {
                    delIndex = index;
                    break;
                }
                index ++;
            }
            if (delIndex !== -1 ) {
                this.preprocess.splice(delIndex, 1);
            }
        },
        removeItem(array, value) {
            let index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        },
        timeBackward() {
            var value = this.value;
            if(value > 0) {
                this.setIndex(value-1);
            }
        },
        timeForward() {
            var value = this.value;
            if(value < this.dateList.length-1) {
                this.setIndex(value+1);
            }
        },
        handleKeyDown(event) {
            if (event.key === 'ArrowLeft') {
                this.timeBackward();
            } else if (event.key === 'ArrowRight') {
                this.timeForward();
            }
        },
        setDateFormat(type) {
            this.dateFormat = this.dateFormatList[`${this.lang}-${type}`];
        },
        getHour(date) {
            return this.dateFormatList[`${this.lang}-hm`].format(date);
        },

        localizedDate(date, addWeekday) {
            if (typeof date === 'string' || typeof date === 'number') {
                date = this.DateTime.fromMillis(date);
            }

            let options = {month: 'long', day: 'numeric'};

            if (addWeekday) {
                options = {
                    ...options,
                    weekday: 'short',
                };
            }
                
            return date.setLocale('ko').toLocaleString(options);
        },

        startDrag(e) {
            this.dragElement = e.currentTarget.id;

            const dragElement = this.dragElement == 'timebar-hours' ? this.$refs.timebarHours : this.$refs.timebarDays;
            if (!dragElement) return;

            const isTouchEvent = e.type.startsWith('touch');
            const startClientX = isTouchEvent ? e.touches[0].clientX : e.clientX;

            this.isDragging = false;

            this.latestClientX = startClientX;

            if (isTouchEvent) {
                window.addEventListener('touchmove', this.onMove);
                window.addEventListener('touchend', this.endDrag);
                window.addEventListener('touchcancel', this.endDrag);
            } else {
                window.addEventListener('mousemove', this.onMove);
                window.addEventListener('mouseup', this.endDrag);
            }

            const matrix = new WebKitCSSMatrix(window.getComputedStyle(dragElement).transform);
            const currentX = matrix.m41;

            this.startX = startClientX;
            this.startTranslateX = currentX;
            this.startValue = this.dragElement == 'timebar-hours' ? this.value : this.dayValue;

            if (!this.currentTranslateX) {
                this.currentTranslateX = currentX;
            }
        },
        onMove(e) {
            // if (!e.type.startsWith('touch')) {
            //     e.preventDefault();
            // }

            this.isDragging = true;

            this.latestClientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;

            if (!this.isUpdateScheduled) {
                this.animationFrameId = requestAnimationFrame(this.update);
                this.isUpdateScheduled = true;
            }
        },
        update() {
            const w = this.dragElement == 'timebar-hours' ? -64 : -128;
            const hw = this.dragElement == 'timebar-hours' ? 32 : 64;

            const dx = this.latestClientX - this.startX;
            const calculatedOffset = Math.floor((dx - hw) / w);
            const newTranslateX = this.startTranslateX + dx;

            if (this.valueOffset != calculatedOffset) {
                let newIndex = this.startValue + calculatedOffset;
                if (newIndex >= (this.dateList.length - 1)) {
                    newIndex = (this.dateList.length - 1);
                }

                if (this.dragElement == 'timebar-hours') {
                    this.setIndex(newIndex);
                }
                else {
                    this.setDayIndex(newIndex, true);
                }
                this.valueOffset = calculatedOffset;
            }
            this.currentTranslateX = newTranslateX; //Math.max(this.maxTranslateX, Math.min(0, newTranslateX));

            this.isUpdateScheduled = false;
        },
        endDrag(e) {
            window.removeEventListener('mousemove', this.onMove);
            window.removeEventListener('mouseup', this.endDrag);
            window.removeEventListener('touchmove', this.onMove);
            window.removeEventListener('touchend', this.endDrag);
            window.removeEventListener('touchcancel', this.endDrag);

            if (this.isUpdateScheduled) {
                cancelAnimationFrame(this.animationFrameId);
                this.isUpdateScheduled = false;
            }

            if (this.isDragging) {
                this.dragEnded = true;
                setTimeout(() => {
                    this.dragEnded = false;
                }, 0);
                this.isDragging = false;
            }
            this.update();
        },
    }
});
