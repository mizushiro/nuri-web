import { loadContent } from '../utils/utils.js';
import { FocusTrap } from '../utils/utils.js';

export default class Dropdown {
  // Private 필드 선언
  #option;
  #id;
  #ps;
  #area;
  #callback;
  #src;
  #srcCallback;
  #wrap;
  #button;
  #text;
  #panel;
  #panelInner;
  #html;
  #boundHandleToggle;
  #boundHandleOutsideClick;
  #isArea;

  constructor(opt) {
    const defaults = {
      area: document.querySelector('.area-dropdown[data-area="body"]'),
      src: null,
      scroll: null,
      ps: null, // bl,bc,br,tl,tc,tr,lt,lc,lb,rt,rc,rb, null(auto tl/bl)
      srcCallback: null,
      callback: null,
    };

    this.#option = { ...defaults, ...opt };
    this.#id = this.#option.id;
    this.#ps = this.#option.ps;
    this.#area = this.#option.area;
    this.#callback = this.#option.callback;
    this.#src = this.#option.src;
    this.#srcCallback = this.#option.srcCallback;

    this.#wrap = document.querySelector(`[data-dropdown="${this.#id}"]`);
    
    if (!this.#wrap) {
      // console.error(`Error: Dropdown wrapper with data-dropdown="${this.#id}" not found.`);
      return;
    }
    if (!this.#area) {
      console.error(`Error: Dropdown wrapper with data-area="${this.#id}" not found.`);
      return; 
    }
    this.#button = this.#wrap.querySelector(`[data-dropdown-button="${this.#id}"]`);
    this.#text = this.#button ? this.#button.querySelector(`[data-dropdown-text="${this.#id}"]`) : null;
    this.#panel = document.querySelector(`[data-dropdown-panel="${this.#id}"]`);
    this.#panelInner = document.querySelector(`[data-dropdown-section="${this.#id}"]`);
    this.#html = document.documentElement;

    this.#boundHandleToggle = this.#handleToggle.bind(this);
    this.#boundHandleOutsideClick = this.#handleOutsideClick.bind(this);

    this.#isArea = this.#wrap.querySelector('[data-dropdown-panel]');
  }

  init() {
    if (!this.#wrap) {
      return false;
    }
    this.#setupElements();
    this.#addEventListeners();

    // resize 이벤트 리스너도 destroy 시 제거 필요
    window.addEventListener('resize', this.reset); 
    this.#button.addEventListener('click', this.#boundHandleToggle); // init에서 이미 한 번 추가되는 부분
    this.#callback && this.#callback();
  }

  #setupElements() {
    if (this.#src) {
      loadContent({
        area: this.#area,
        src: this.#src,
        insert: true,
      })
      .then(() => {
        if (this.#text) {
          this.#text.dataset.dropdownText = this.#id;
        }
        if (this.#button) {
          this.#button.dataset.dropdownButton = this.#id;
          this.#button.setAttribute('aria-controls', this.#id);
          this.#button.setAttribute('aria-expanded', 'false');
        }
  
        this.#panel = document.querySelector(`[data-dropdown-panel="${this.#id}"]`);
        this.#panelInner = document.querySelector(`[data-dropdown-section="${this.#id}"]`);
        this.#panel.dataset.dropdownPanel = this.#id;
        this.#panel.setAttribute('aria-hidden', 'true');
        this.#panel.setAttribute('tabindex', '-1');
        this.#panel.id = this.#id;

        this.#isArea = this.#wrap.querySelector('[data-dropdown-panel]');
        this.#srcCallback && this.#srcCallback();
      })
      .catch(err => console.error('Error loading tab content:', err));
    } else {
     
      if (this.#text) {
        this.#text.dataset.dropdownText = this.#id;
      }
      if (this.#button) {
        this.#button.dataset.dropdownButton = this.#id;
        this.#button.setAttribute('aria-controls', this.#id);
        this.#button.setAttribute('aria-expanded', 'false');
      }
      if (this.#panel) {
        this.#panel.dataset.dropdownPanel = this.#id;
        this.#panel.setAttribute('aria-hidden', 'true');
        this.#panel.setAttribute('tabindex', '-1');
        this.#panel.id = this.#id;
      }
    }
  }
  
  #addEventListeners() {
    if (this.#button) {
      // init()에서 이미 추가되므로 중복될 수 있습니다. init()에서 한 번만 추가하도록 조정하거나,
      // init()의 `this.button.addEventListener('click', this.boundHandleToggle);` 라인을 제거하고 
      // 여기서만 추가하는 것을 권장합니다.
      this.#button.addEventListener('click', this.#boundHandleToggle); 
    }
  }

  #removeEventListeners() {
    if (this.#button) {
      this.#button.removeEventListener('click', this.#boundHandleToggle);
    }
    this.#html.removeEventListener('click', this.#boundHandleOutsideClick);
  }

  #handleOutsideClick = (e) => {
    if (!this.#wrap || !this.#panel) return; // destroy 후 호출 방지
    const isClickInsideDropdown = this.#wrap.contains(e.target) || this.#panel.contains(e.target);
    if (!isClickInsideDropdown) {
      this.hide();
    }
  };

  #handleToggle = () => {
    if (!this.#button || !this.#panel) return;
    const isExpanded = this.#button.getAttribute('aria-expanded') === 'true';
    isExpanded ? this.hide() : this.show();
  };

  reset = () => {
    const expanded = document.querySelector('[data-dropdown-panel][aria-hidden="false"]');

    if (expanded && expanded !== this.#panel) {
      expanded.setAttribute('aria-hidden', true);
      document.querySelector(`[data-dropdown-button="${expanded.dataset.dropdownPanel}"]`).setAttribute('aria-expanded', false);
    }
  }

  show() {
    if (!this.#button || !this.#panel) return;

    this.#button.setAttribute('aria-expanded', true);
    this.#panel.setAttribute('aria-hidden', false); 

    const rect = this.#button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scroll_t = document.documentElement.scrollTop;
    this.#panel.style.height = rect.height + 'px';

    if (this.#ps) {
      this.#panel.dataset.ps = this.#ps;
    } else {
      this.#panel.dataset.ps = (rect.bottom + this.#panelInner.offsetHeight < viewportHeight) ? 'bl' : 'tl';
    }

    if (!this.#isArea) {
      this.#panel.style.width = rect.width + 'px';
      this.#panel.style.left = rect.x + 'px';
      this.#panel.style.top = (rect.y + scroll_t) + 'px';
    } 

    this.#panel.focus();
    this.#html.addEventListener('click', this.#boundHandleOutsideClick);

    new FocusTrap(this.#panel);
  }
  
  hide() {
    if (!this.#button || !this.#panel) return;

    this.#html.removeEventListener('click', this.#boundHandleOutsideClick);
    this.#button.setAttribute('aria-expanded', 'false');
    this.#panel.setAttribute('aria-hidden', 'true');
    this.#button.focus();
  }

  destroy() {
    this.#removeEventListeners();
    window.removeEventListener('resize', this.reset);

    this.#wrap = null;
    this.#button = null;
    this.#text = null;
    this.#panel = null;
    this.#panelInner = null;
    this.#area = null;
    
    // 3. (필요하다면) 컴포넌트가 생성한 DOM 요소 제거
    // 예를 들어, loadContent로 동적으로 삽입된 패널을 제거하고 싶다면
    if (this.#panel && this.#panel.parentNode && this.#src) {
      this.#panel.parentNode.removeChild(this.#panel); // 실제 DOM에서 패널 제거
    }

    console.log(`Dropdown with ID "${this.#id}" destroyed.`);
  }
}