window.addEventListener('DOMContentLoaded', function() {

    // Tabs

    let tab = document.getElementsByClassName('info-header-tab'),
        tabContent = document.getElementsByClassName('info-tabcontent');

    function hideTabContent(a) {
        for(let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1)

    function showTabContent(b) {
        if(tabContent[b].classList.contains('hide')) {
            hideTabContent(0);
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    document.addEventListener('click', function(event) {
        let target = event.target;
        if(target.className == 'info-header-tab') {
            for(let i = 0; i < tab.length; i++) {
                if(target == tab[i]) {
                    showTabContent(i);
                    break;
                }
            }
        };
    })

    // Timer

    let deadline = '2020-05-01';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/1000/60/60) %24 ),
            days = Math.floor( (t/1000/60/60/24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    };

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            seconds = timer.querySelector('.seconds'),
            minutes = timer.querySelector('.minutes'),
            hours = timer.querySelector('.hours'),
            days = timer.querySelector('.days');

        function updateClock() {
            let t = getTimeRemaining(endtime);
            seconds.innerHTML = t.seconds;
            minutes.innerHTML = t.minutes;
            hours.innerHTML = t.hours;
            days.innerHTML = t.days;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        };

        updateClock();
        let timeInterval = setInterval(updateClock, 1000);
    };

    setClock('timer', deadline);

    // Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        this.classList.add('more-splash');
        overlay.style.display = "block";
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = "none";
        document.body.style.overflow = '';
        statusMessage.style.display = "none";
    });
    
    // Form

    let message = new Object();
    message.loading = "Загрузка";
    message.success = "Спасибо, мы перезвоним";
    message.failure = "Ошибка";

    let form = document.getElementsByClassName('main-form')[0],
        input = form.getElementsByTagName('input'),
        statusMessage = document.querySelector('.status');  

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);
        
        // AJAX

        let request = new XMLHttpRequest();
        request.open("POST", 'server.php');
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        let formData = new FormData(form);
        request.send(formData);
        request.onreadystatechange = function() {
            statusMessage.style.display = "flex";
            if(request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if(request.readyState === 4) {
                if(request.status == 200 && request.status < 300) {
                    statusMessage.innerHTML = message.success;
                } else {
                    statusMessage.innerHTML = message.failure; 
                }
            }
        }
        for(let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });

    // Slider

    let slideIndex = 1,
        slides = document.getElementsByClassName('slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.getElementsByClassName('dot');

    showSlides(slideIndex);

    function showSlides(n) {
        if(n > slides.length) {
            slideIndex = 1;
        };
        if(n < 1) {
            slideIndex = slides.length;
        };
        for(let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        };
        for(let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('dot-active');
        };

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlide (n) {
        showSlides(slideIndex += n)
    }
    
    function currentSlide (n) {
        showSlides(slideIndex = n)
    }

    prev.addEventListener('click', function() {
        plusSlide(-1);
    });
    next.addEventListener('click', function() {
        plusSlide(1);
    });

    dotsWrap.addEventListener('click', function(event) {
        for(let i = 0; i < dots.length + 1; i++) {
            if(event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });

    // Calc

    let persons = document.getElementsByClassName('counter-block-input')[0],
        days = document.getElementsByClassName('counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        persSum = 0,
        daysSum = 0,
        total = 0;
        a = 0;

    persons.addEventListener('change', function() {
        persSum = +this.value;
        total = persSum * daysSum * 150;
        if(days.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
         } else {
            a = total;
            totalValue.innerHTML = a + 'р';
         }
    });

    days.addEventListener('change', function() {
        daysSum = +this.value;
        total = persSum * daysSum * 150;
        if(days.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
         } else {
            a = total;
            totalValue.innerHTML = a + 'р';
         }
    });

    place.addEventListener('change', function() {
        if(days.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value + 'р';
         }
    });

    // Form callback

    let callback = document.getElementsByClassName('callback')[0],
        inputCB = callback.getElementsByTagName('input'),
        statusMessageCB = callback.querySelector('.statusCB');  

    callback.addEventListener('submit', function(event) {
        event.preventDefault();
        callback.appendChild(statusMessageCB);
        
        // AJAX
        let requestCB = new XMLHttpRequest();
        requestCB.open("POST", 'server.php');
        requestCB.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        let cbData = new FormData(callback);
        requestCB.send(cbData);
        requestCB.onreadystatechange = function() {
            statusMessageCB.style.display = "flex";
            if(requestCB.readyState < 4) {
                statusMessageCB.innerHTML = message.loading;
            } else if(requestCB.readyState === 4) {
                if(requestCB.status == 200 && requestCB.status < 300) {
                    statusMessageCB.innerHTML = message.success;
                } else {
                    statusMessageCB.innerHTML = message.failure; 
                }
            }
        }
        for(let i = 0; i < inputCB.length; i++) {
            inputCB[i].value = '';
        }
    });
});