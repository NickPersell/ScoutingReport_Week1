// Page Navigation
let currentPage = 'home';
const pages = document.querySelectorAll('.page');
const pageOrder = ['home', 'offense', 'defense', 'special-teams'];
const pageTitles = {
    'home': 'Main',
    'offense': 'Offense',
    'defense': 'Defense',
    'special-teams': 'Special Teams'
};

function navigateTo(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    updateNavigationButtons();
}

function updateNavigationButtons() {
    if (currentPage === 'home') return;

    const currentIndex = pageOrder.indexOf(currentPage);
    const prevButton = document.querySelector(`#${currentPage} .prev-button`);
    const nextButton = document.querySelector(`#${currentPage} .next-button`);

    const prevIndex = (currentIndex === 0) ? pageOrder.length - 1 : currentIndex - 1;
    const prevPage = pageOrder[prevIndex];
    prevButton.style.display = 'inline-block';
    prevButton.textContent = `< ${pageTitles[prevPage]}`;
    prevButton.onclick = () => navigateTo(prevPage);

    const nextIndex = (currentIndex === pageOrder.length - 1) ? 0 : currentIndex + 1;
    const nextPage = pageOrder[nextIndex];
    nextButton.style.display = 'inline-block';
    nextButton.textContent = `${pageTitles[nextPage]} >`;
    nextButton.onclick = () => navigateTo(nextPage);
}

// Swipe Detection
let touchstartX = 0;
let touchendX = 0;
let touchstartTime = 0;
let isSingleTouch = false;

document.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
        isSingleTouch = true;
        touchstartX = e.changedTouches[0].screenX;
        touchstartTime = Date.now();
    } else {
        isSingleTouch = false;
    }
});

document.addEventListener('touchend', e => {
    if (!isSingleTouch) return;

    touchendX = e.changedTouches[0].screenX;
    const touchendTime = Date.now();
    const touchDuration = touchendTime - touchstartTime;

    if (touchDuration < 100) return;

    let zoomLevel = 1.0;
    if (window.visualViewport) {
        zoomLevel = window.visualViewport.scale;
    } else {
        zoomLevel = window.innerWidth / document.documentElement.clientWidth;
    }

    if (Math.abs(zoomLevel - 1.0) > 0.01) return;

    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const currentIndex = pageOrder.indexOf(currentPage);
    
    if (touchendX < touchstartX - swipeThreshold) {
        const nextIndex = (currentIndex === pageOrder.length - 1) ? 0 : currentIndex + 1;
        navigateTo(pageOrder[nextIndex]);
    }
    if (touchendX > touchstartX + swipeThreshold) {
        const prevIndex = (currentIndex === 0) ? pageOrder.length - 1 : currentIndex - 1;
        navigateTo(pageOrder[prevIndex]);
    }
}

// Arrow Key Navigation and Scrolling
document.addEventListener('keydown', e => {
    const currentIndex = pageOrder.indexOf(currentPage);
    const currentPageElement = document.getElementById(currentPage);
    
    if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex === pageOrder.length - 1) ? 0 : currentIndex + 1;
        navigateTo(pageOrder[nextIndex]);
    }
    if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex === 0) ? pageOrder.length - 1 : currentIndex - 1;
        navigateTo(pageOrder[prevIndex]);
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        console.log(`Key pressed: ${e.key}`);
        e.preventDefault();
        
        const scrollContainer = currentPage === 'home'
            ? currentPageElement.querySelector('.main-image-container')
            : currentPageElement.querySelector('.content');
        
        if (scrollContainer) {
            console.log('Scroll container found:', scrollContainer);
            const scrollAmount = 100;
            const currentScroll = scrollContainer.scrollTop;
            
            if (e.key === 'ArrowUp') {
                scrollContainer.scrollTop = currentScroll - scrollAmount;
                console.log('Scrolling up to:', scrollContainer.scrollTop);
            } else if (e.key === 'ArrowDown') {
                scrollContainer.scrollTop = currentScroll + scrollAmount;
                console.log('Scrolling down to:', scrollContainer.scrollTop);
            }
        } else {
            console.log('Scroll container not found for page:', currentPage);
        }
    }
});

// Load Images Dynamically
function loadImages(container, prefix) {
    let pageNum = 1;
    const maxPages = 20;

    function tryLoadNextImage() {
        if (pageNum > maxPages) return;

        const img = new Image();
        img.src = `${prefix}-${pageNum}.png`;
        img.alt = `${prefix} Page ${pageNum}`;
        img.className = prefix === 'main' ? 'main-image' : 'content-image';

        img.onload = () => {
            container.appendChild(img);
            pageNum++;
            tryLoadNextImage();
        };

        img.onerror = () => {
            console.log(`No more pages for ${prefix} after page ${pageNum - 1}`);
        };
    }

    tryLoadNextImage();
}

// Counteract Zoom on the Banner
function adjustBannerScale() {
    const banner = document.querySelector(`#${currentPage} .banner-wrapper`);
    if (!banner) return;

    let zoomLevel = 1.0;
    if (window.visualViewport) {
        zoomLevel = window.visualViewport.scale;
    } else {
        zoomLevel = window.innerWidth / document.documentElement.clientWidth;
    }

    // Counteract the zoom by scaling the banner inversely
    const inverseScale = 1 / zoomLevel;
    banner.style.transform = `scale(${inverseScale})`;
    banner.style.transformOrigin = 'top left';

    // Adjust the banner's position to account for the zoom offset
    const offsetY = (zoomLevel - 1) * (banner.offsetHeight / zoomLevel);
    banner.style.top = `${-offsetY}px`;
}

// Listen for zoom changes
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adjustBannerScale);
    window.visualViewport.addEventListener('scroll', adjustBannerScale);
}

// Initial adjustment
window.addEventListener('load', adjustBannerScale);

// Load images and set initial navigation buttons on page load
window.onload = () => {
    loadImages(document.querySelector('#home .main-image-wrapper'), 'main');
    loadImages(document.querySelector('#offense .content-wrapper'), 'offense');
    loadImages(document.querySelector('#defense .content-wrapper'), 'defense');
    loadImages(document.querySelector('#special-teams .content-wrapper'), 'special-teams');
    updateNavigationButtons();
    adjustBannerScale();
};
