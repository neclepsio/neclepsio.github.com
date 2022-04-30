function navTopHeight() {
    var navRect = document.querySelector(".fixed-nav").getBoundingClientRect();
    if (navRect.top <= 0) {
        return navRect.bottom;
    }
    return 0;
}

function scrollToId (id) {
    var el = document.getElementById(id);
    var y = el.getBoundingClientRect().top + window.scrollY;
    
    y -= navTopHeight();
    
    window.scroll({
        top: y,
        behavior: "smooth",
    });
} 

document.getElementById("header-arrow").addEventListener("click", function(ev) {
    scrollToId(document.querySelector(".fn-item").dataset.targetId);
});

document.querySelectorAll("a.btn.site-menu, a.fn-item").forEach(function(el) { 
    el.addEventListener("click", function(ev) {
        scrollToId(el.dataset.targetId);
    });
});

function onScrolled() {
    var lastActive = null;
    var navTop = navTopHeight();
    document.querySelectorAll("a.fn-item").forEach(function(el, i, array) { 
        var article = document.querySelector("article[id='" + el.dataset.targetId + "']")
        var articleRect = article.getBoundingClientRect();
        var height = document.documentElement.clientHeight;
        var tol = height / 2;

        if (articleRect.top < navTop + tol && articleRect.bottom > 0) {
            lastActive = el;
        }
        if (i == array.length - 1 && articleRect.bottom < height) {
            lastActive = el;
        }

        el.classList.remove("active");
    });
    document.querySelector(".fixed-nav").classList.toggle("visible", lastActive != null);
    if (lastActive != null) {
        lastActive.classList.add("active");
    }
}

let ticking = false;
document.addEventListener('scroll', function(e) {
    if (ticking) {
        return;
    }

    ticking = true;
    window.requestAnimationFrame(function() {
        onScrolled();    
        ticking = false;
    });
});