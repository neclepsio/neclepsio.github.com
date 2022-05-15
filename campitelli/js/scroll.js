function navTopHeight() {
    var nav = document.querySelector(".fixed-nav");
    if (!nav) {
        return 0;
    }
    var navRect = nav.getBoundingClientRect();
    return (navRect.top <= 0) ? navRect.bottom : 0;
}

function scrollToId(id) {
    var delta = document.getElementById(id).getBoundingClientRect().top - navTopHeight();
    
    window.scrollBy({
        top: delta,
        behavior: "smooth",
    });
} 

/*
// I wrote this because I wanted to change the easing function to be istantaneous
// in the "center" of the animation, so that big leaps looked, maybe, better.
// Unfortunately, this is sluggish, because built-in smooth scroll keeps scrolling
// even if a full redraw is not yet completed, while requestAnimationFrame seems
// to be called after redraw. This causes unbearable delays.
function scrollToId (id) {
    const duration = 500;
    const ease = (t) => (t < .5) ? (2*t*t) : (-1+(4-2*t)*t);

    var deltaY = document.getElementById(id).getBoundingClientRect().top - navTopHeight();
    var startY = window.scrollY;
    var startTime = -1;

    var step = function(t) {
        if (startTime < 0) { startTime = t; }
        var deltaTime = (t - startTime) / duration;
        console.log(t, deltaTime);
        if (deltaTime > 1) {
            window.scroll({ top: startY+deltaY });
            return;
        }
        var y = startY + ease(deltaTime) * deltaY;
        window.scroll({ top:  Math.floor(y) });
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
} 
*/

var ha = document.getElementById("header-arrow");
if (ha) {
    ha.addEventListener("click", function() {
        document.querySelector(".fn-item").click();
    });
}

document.querySelectorAll("a.btn.site-menu, a.fn-item").forEach(function(el) { 
    el.addEventListener("click", function() {
        var targetId = el.dataset.targetId;
        document.querySelectorAll("a.fn-item").forEach(function(el2) { 
            el2.classList.toggle("active", el2.dataset.targetId == targetId);
        });
        document.querySelector(".fixed-nav").classList.add("visible");
        scrollToId(targetId);
    });
});

function onScrolled() {
    var nav = document.querySelector(".fixed-nav");
    if (!nav) {
        return;
    }
    var lastActive = null;
    var navTop = navTopHeight();
    var height = document.documentElement.clientHeight;
    var center = (navTop + height) / 2;

    document.querySelectorAll("a.fn-item").forEach(function(el, i, array) { 
        var article = document.querySelector("article[id='" + el.dataset.targetId + "']");
        var articleRect = article.getBoundingClientRect();

        if ((articleRect.top < center && articleRect.bottom > 0) || 
            (i == array.length - 1 && articleRect.bottom < height)) {
            lastActive = el;
        }

        el.classList.remove("active");
    });
    
    if (lastActive == null) {
        nav.classList.remove("visible");
    } else {
        nav.classList.add("visible");
        lastActive.classList.add("active");
    }
}

let scrollTimeoutId = -1;
let lastScrolled = 0;
document.addEventListener('scroll', function() {
    if (scrollTimeoutId >= 0) {
        clearTimeout(scrollTimeoutId);
        scrollTimeoutId = -1;
    }
    
    var f = function() {
        lastScrolled = Date.now();
        onScrolled();
    };

    if (Date.now() - lastScrolled > 100) {
        f();
    } else {
        scrollTimeoutId = setTimeout(f, 100);
    }
});