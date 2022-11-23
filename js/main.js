// $(document).ready(function(){
	
// });
document.addEventListener('DOMContentLoaded', () => {
// Definition TouchScreen
	const isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (
				isMobile.Android() ||
				isMobile.BlackBerry() ||
				isMobile.iOS() ||
				isMobile.Opera() ||
				isMobile.Windows());
		}
	};
	// Добавление класса на body в зависимости от экрана
	if (isMobile.any()) {
		document.body.classList.add('_touch');

	} else {
		document.body.classList.add('_pc'); // Если не тачСкрин то будет класс пк
	}

// SubMenu
	if (window.matchMedia("(min-width: 801px)").matches) {
		const menuBtns = document.querySelectorAll('.header__list-btn');
		const subMenus = document.querySelectorAll('.header__sublist');
		menuBtns.forEach(el => {
			el.addEventListener('click', (e) => {
				let currentBtn = e.currentTarget;
				let subMenu = currentBtn.closest('.header__list-item').querySelector('.header__sublist');

				menuBtns.forEach(el => {
					if (el !== currentBtn) {
						el.classList.remove('_active');
					}
				});
				subMenus.forEach(el => {
					if (el !== subMenus) {
						el.classList.remove('_active');
					}
				});
				subMenu.classList.toggle('_active');
				currentBtn.classList.toggle('_active');
			});
		});
		document.addEventListener('click', (e) => {
			if ( !e.target.closest('.header__list-item') ) {
				menuBtns.forEach(el => {
					el.classList.remove('_active');
				});
				subMenus.forEach(el => {
					el.classList.remove('_active');
				});
			}
		});

	} else {}

// Menu Burger
	document.querySelector('.menu__burger').addEventListener('click', function (e){
		e.preventDefault();
		
		if(this.classList.contains('_active')) {
		   this.classList.remove('_active');
		   document.body.classList.remove('_lock');
		   document.querySelector('.header__menu').classList.remove('_active');
		} else {
		   this.classList.add('_active');
		   document.body.classList.add('_lock');
		   document.querySelector('.header__menu').classList.add('_active');
		}
	});

// Spollers 
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных спойлеров
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных спойлеров
		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}

		// Получение спойлеров с медиа запросами
		const spollersMedia = Array.from(spollersArray).filter(function(item, index, self) {
			return item.dataset.spollers.split(",")[0];
		});

		// Инициализация спойлеров с медиа запросами
		if (spollersMedia.length > 0 ) {
			const breakpointsArray = [];
			spollersMedia.forEach( item => {
				const params      = item.dataset.spollers;
				const breakpoint  = {};
				const paramsArray = params.split(",");
				breakpoint.value  = paramsArray[0];
				breakpoint.type   = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item   = item;
				breakpointsArray.push(breakpoint);
			});

			// Получаем уникальные брейкпоинты
			let mediaQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mediaQueries = mediaQueries.filter(function (item, index, self) {
				return self.indexOf(item) === index;
			});

			// Работаем с каждым брейкопоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray 	  = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType 	  = paramsArray[2];
				const matchMedia 	  = window.matchMedia(paramsArray[0]);

				// Объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				// Событие 
				matchMedia.addListener(function () {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});
		}

		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}

		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length > 0) {
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}

		function setSpollerAction(e) {
			const el = e.target;
			if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
				const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_active');
					_slideToggle(spollerTitle.nextElementSibling, 500);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
			if (spollerActiveTitle) {
				spollerActiveTitle.classList.remove('_active');
				_slideUp(spollerActiveTitle.nextElementSibling, 500);
			}
		}
	}

	// =======================================================
	// SlideToggle
	let _slideUp = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = target.offsetHeight + 'px';
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = true;
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (target.hidden) {
				target.hidden = false;
			}
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}

// Popup
	const popupLinks = document.querySelectorAll('.popup-link');
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll('.lock-padding'); // Добавлять элементу, который багается при Lock'е

	let unlock = true;
	const timeout = 200; // Время выполнения transition, как и в CSS

	if (popupLinks.length > 0) {
		for (let index = 0; index < popupLinks.length; index++){
			const popupLink = popupLinks[index];
			popupLink.addEventListener('click', function (e){
				const popupName = popupLink.getAttribute('href').replace('#', '');
				const curentPopup = document.getElementById(popupName);
				popupOpen(curentPopup);
				e.preventDefault();
			});
		}
	}
	const popupCloseIcon = document.querySelectorAll('.popup__close');
	if (popupCloseIcon.length > 0){
		for (let index = 0; index < popupCloseIcon.length; index++){
			const el = popupCloseIcon[index];
			el.addEventListener('click', function (e) {
				popupClose(el.closest('.popup'));
				e.preventDefault();
			});
		}
	}
	function popupOpen(curentPopup) {
		if (curentPopup && unlock){
			const popupActive = document.querySelector('.popup.open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			curentPopup.classList.add('open');
			curentPopup.addEventListener('click', function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}
	function popupClose(popupActive, doUnlock = true) {
		if (unlock) {
			popupActive.classList.remove('open');
			if (doUnlock){
				bodyUnLock();
			}
		}
	}
	
	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
		if (lockPadding.length > 0){
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = lockPaddingValue;
			}
		}
		body.style.paddingRight = lockPaddingValue;
		body.classList.add('_lock');
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	function bodyUnLock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				for (let index = 0; index < lockPadding.length; index++) {
					const el = lockPadding[index];
					el.style.paddingRight = '0px';
				}
			}
			body.style.paddingRight = '0px';
			body.classList.remove('_lock');
		}, timeout);
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	document.addEventListener('keydown', function (e) {
		if (e.which === 27) {
			const popupActive = document.querySelector('.popup.open');
			popupClose(popupActive);
		}
	});

	(function () {
		if (!Element.prototype.closest) {
			Element.prototype.closest = function (css) {
				var node = this;
				while (node) {
					if (node.matches(css)) return node;
					else node = node.parentElement;
				}
				return null;
			};
		}
	})();
	(function () {
		if (!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector;
		}
	})();

// Button show/hide password
	function showPassword() {
		const passwdBtn = document.querySelector('.login__btn-passwd');
		const passwdInp = document.querySelector('.login__inp-passwd');

		passwdBtn.addEventListener('click', () => {
			passwdBtn.classList.toggle('_active');

			if (passwdInp.getAttribute('type') === 'password') {
				 passwdInp.setAttribute('type', 'text');
			} else {
				 passwdInp.setAttribute('type', 'password');
			}
		})
	}
	showPassword();

// Scroll Animation
	const animItems = document.querySelectorAll('._anim-items');

	if (animItems.length > 0 ){
		window.addEventListener('scroll', animOnScroll);
		function animOnScroll(params){
			for(let index = 0; index < animItems.length; index++) {
				const animItem = animItems[index];
				const animItemHeight = animItem.offsetHeight;
				const animItemOffset = offset(animItem).top;
				const animStart = 2;

				let animItemPoint = window.innerHeight - animItemHeight / animStart;
				if (animItemHeight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
					animItem.classList.add('_active');
				} else {
					if(!animItem.classList.contains('_anim-no-hide')){
						animItem.classList.remove('_active');	
					}
				}
			}
		}
		function offset (el) {
			const rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return {top: rect.top + scrollTop, left: rect.left + scrollLeft }
		}
		setTimeout(() => {
			animOnScroll();
		}, 300 );
	}

// Smooth digits
	window.addEventListener("load", windowLoad);

	function windowLoad() {
		// Инициализация цифр
		function digitsCountersInit(digitsCountersItems) {
			let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
			if (digitsCounters) {
				digitsCounters.forEach (digitsCounter => {
					digitsCountersAnimate(digitsCounter);
				});
			}
		}
		// Анимация цифр
		function digitsCountersAnimate(digitsCounter) {
			let startTimestamp  = null;
			const duration 	    = parseInt(digitsCounter.dataset.digitsCounter) ? parseInt(digitsCounter.dataset.digitsCounter) : 1000;
			const startValue    = parseInt(digitsCounter.innerHTML);
			const startPosition = 0;
			const step          = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
				if (progress < 1) {
					window.requestAnimationFrame(step);
				}
			};
			window.requestAnimationFrame(step);
		}
		// Пуск при загрузке страницы
		// digitsCountersInit();


		// Пуск при скролле
		let options = {
			threshold: 0.3
		}
		let observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const targetElement = entry.target;
					const digitsCountersItems = targetElement.querySelectorAll("[data-digits-counter]");
					if (digitsCountersItems.length) {
						digitsCountersInit(digitsCountersItems);
					}
					// Отключение после срабатывания
					observer.unobserve(targetElement);
				}
			});
		}, options );

		// Секция до которой будем доходить, чтобы начиналась анимация
		let sections = document.querySelectorAll('.info__item');
		if(sections.length) {
			sections.forEach(section => {
				observer.observe(section);
			});
		}
	}

});
