// Sample image data
        const images = [
            {
                src: 'Images/1.jpeg',
                title: 'Mountain Landscape',
                description: 'Beautiful mountain scenery with morning mist',
                category: 'nature'
            },
            {
                src: 'Images/4.jpeg',
                title: 'Modern Architecture',
                description: 'Contemporary building design with glass facade',
                category: 'architecture'
            },
            {
                src: 'Images/7.jpeg',
                title: 'Portrait Photography',
                description: 'Professional portrait with natural lighting',
                category: 'people'
            },
            {
                src: 'Images/2.jpeg',
                title: 'Forest Path',
                description: 'Peaceful walking trail through dense forest',
                category: 'nature'
            },
            {
                src: 'Images/5.jpeg',
                title: 'City Skyline',
                description: 'Urban landscape at golden hour',
                category: 'architecture'
            },
            {
                src: 'Images/9.jpeg',
                title: 'Street Photography',
                description: 'Candid moment captured in urban setting',
                category: 'people'
            },
            {
                src: 'Images/3.jpeg',
                title: 'Ocean Waves',
                description: 'Dramatic seascape with crashing waves',
                category: 'nature'
            }
        ];

        let currentImageIndex = 0;
        let filteredImages = [...images];
        let isFullCover = true;

        // DOM Elements
        const gallery = document.getElementById('gallery');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxInfo = document.getElementById('lightbox-info');
        const viewToggle = document.getElementById('view-toggle');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Add these variables after the existing variables
        let hideControlsTimeout;

        // Initialize gallery
        function initGallery() {
            renderGallery(images);
            setupEventListeners();
        }

        // Render gallery items
        function renderGallery(imagesToRender) {
            gallery.innerHTML = '';
            imagesToRender.forEach((image, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.style.animationDelay = `${index * 0.1}s`;
                galleryItem.innerHTML = `
                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                    <div class="overlay">
                        <h3>${image.title}</h3>
                        <p>${image.description}</p>
                    </div>
                `;
                galleryItem.addEventListener('click', () => openLightbox(index));
                gallery.appendChild(galleryItem);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.dataset.filter;
                    filterImages(filter);
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });

            // Lightbox controls
            lightboxClose.addEventListener('click', closeLightbox);
            lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
            lightboxNext.addEventListener('click', () => navigateLightbox(1));
            
            // View toggle
            viewToggle.addEventListener('click', toggleViewMode);

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('active')) {
                    switch(e.key) {
                        case 'Escape':
                            closeLightbox();
                            break;
                        case 'ArrowLeft':
                            navigateLightbox(-1);
                            break;
                        case 'ArrowRight':
                            navigateLightbox(1);
                            break;
                        case 'f':
                        case 'F':
                            toggleFullscreen();
                            break;
                        case ' ':
                            e.preventDefault();
                            toggleViewMode();
                            break;
                    }
                }
            });

            // Close lightbox when clicking outside image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // Add this new function after setupEventListeners function
        function setupLightboxControls() {
            // Show controls initially
            showLightboxControls();
            
            // Hide controls after 3 seconds
            resetHideTimer();
            
            // Show controls on mouse move or touch
            lightbox.addEventListener('mousemove', () => {
                showLightboxControls();
                resetHideTimer();
            });
            
            lightbox.addEventListener('touchstart', () => {
                showLightboxControls();
                resetHideTimer();
            });
            
            // Show controls when hovering over nav buttons
            lightboxPrev.addEventListener('mouseenter', showLightboxControls);
            lightboxNext.addEventListener('mouseenter', showLightboxControls);
            lightboxClose.addEventListener('mouseenter', showLightboxControls);
            viewToggle.addEventListener('mouseenter', showLightboxControls);
        }

        // Add after the existing setupLightboxControls function
        function setupTouchGestures() {
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;

            lightbox.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            lightbox.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                handleSwipe();
            });

            function handleSwipe() {
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const minSwipeDistance = 50;

                // Horizontal swipe is more significant than vertical
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        // Swipe right - previous image
                        navigateLightbox(-1);
                    } else {
                        // Swipe left - next image
                        navigateLightbox(1);
                    }
                }
            }
        }

        function showLightboxControls() {
            lightboxPrev.classList.remove('hidden');
            lightboxNext.classList.remove('hidden');
            lightboxClose.classList.remove('hidden');
            lightboxInfo.classList.remove('hidden');
            viewToggle.classList.remove('hidden');
        }

        function hideLightboxControls() {
            lightboxPrev.classList.add('hidden');
            lightboxNext.classList.add('hidden');
            lightboxInfo.classList.add('hidden');
            viewToggle.classList.add('hidden');
            // Keep close button visible for safety
        }

        function resetHideTimer() {
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = setTimeout(hideLightboxControls, 3000);
        }

        // Add view mode toggle function
        function toggleViewMode() {
            isFullCover = !isFullCover;
            if (isFullCover) {
                lightbox.classList.remove('fit-mode');
                lightbox.classList.add('cover-mode');
                viewToggle.textContent = 'Fill Screen';
            } else {
                lightbox.classList.remove('cover-mode');
                lightbox.classList.add('fit-mode');
                viewToggle.textContent = 'Fit Screen';
            }
        }

        // Add fullscreen toggle function
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                lightbox.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        }

        // Filter images by category
        function filterImages(category) {
            if (category === 'all') {
                filteredImages = [...images];
            } else {
                filteredImages = images.filter(image => image.category === category);
            }
            renderGallery(filteredImages);
        }

        // Update the openLightbox function to include touch gestures
        function openLightbox(index) {
            currentImageIndex = index;
            updateLightboxImage();
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Setup auto-hide controls
            setupLightboxControls();
            
            // Setup touch gestures
            setupTouchGestures();
        }

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Clear hide timer
            clearTimeout(hideControlsTimeout);
            
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }

        // Navigate lightbox with smooth transition
        function navigateLightbox(direction) {
            currentImageIndex += direction;
            
            if (currentImageIndex < 0) {
                currentImageIndex = filteredImages.length - 1;
            } else if (currentImageIndex >= filteredImages.length) {
                currentImageIndex = 0;
            }
            
            updateLightboxImage();
        }

        // Add smooth transition effect for image changes
        function updateLightboxImage() {
            const image = filteredImages[currentImageIndex];
            
            // Add fade effect
            lightboxImg.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImg.src = image.src;
                lightboxImg.alt = image.title;
                lightboxTitle.textContent = image.title;
                lightboxDescription.textContent = image.description;
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        // Initialize the gallery when page loads
        document.addEventListener('DOMContentLoaded', initGallery);