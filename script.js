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
    const currentIndex = pageOrder.indexOf(currentPage);
    const prevButton = document.querySelector(`#${currentPage} .prev-button`);
    const nextButton = document.querySelector(`#${currentPage} .next-button`);

    // Previous button
    if (currentIndex > 0) {
        const prevPage = pageOrder[currentIndex - 1];
        prevButton.style.display = 'inline-block';
        prevButton.textContent = `< ${pageTitles[prevPage]}`;
        prevButton.onclick = () => navigateTo(prevPage);
    } else {
        prevButton.style.display = 'none';
    }

    // Next button (with looping to Home)
    if (currentIndex < pageOrder.length - 1) {
        const nextPage = pageOrder[currentIndex + 1];
        nextButton.style.display = 'inline-block';
        nextButton.textContent = `${pageTitles[nextPage]} >`;
        nextButton.onclick = () => navigateTo(nextPage);
    } else {
        // On the last page (Special Teams), loop back to Home
        const nextPage = pageOrder[0]; // Home page
        nextButton.style.display = 'inline-block';
        nextButton.textContent = `Home >`;
        nextButton.onclick = () => navigateTo(nextPage);
    }
}

// Swipe Detection
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const currentIndex = pageOrder.indexOf(currentPage);
    
    if (touchendX < touchstartX - swipeThreshold) {
        // Swipe left: go to next page, loop to Home if on last page
        if (currentIndex < pageOrder.length - 1) {
            navigateTo(pageOrder[currentIndex + 1]);
        } else {
            navigateTo(pageOrder[0]); // Loop to Home
        }
    }
    if (touchendX > touchstartX + swipeThreshold && currentIndex > 0) {
        navigateTo(pageOrder[currentIndex - 1]);
    }
}

// Arrow Key Navigation and Scrolling
document.addEventListener('keydown', e => {
    const currentIndex = pageOrder.indexOf(currentPage);
    const currentPageElement = document.getElementById(currentPage);
    
    // Left/Right for page navigation
    if (e.key === 'ArrowRight') {
        if (currentIndex < pageOrder.length - 1) {
            navigateTo(pageOrder[currentIndex + 1]);
        } else {
            navigateTo(pageOrder[0]); // Loop to Home
        }
    }
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        navigateTo(pageOrder[currentIndex - 1]);
    }

    // Up/Down for scrolling
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

// Load images and set initial navigation buttons on page load
window.onload = () => {
    loadImages(document.querySelector('#home .main-image-wrapper'), 'main');
    loadImages(document.querySelector('#offense .content-wrapper'), 'offense');
    loadImages(document.querySelector('#defense .content-wrapper'), 'defense');
    loadImages(document.querySelector('#special-teams .content-wrapper'), 'special-teams');
    updateNavigationButtons();
};