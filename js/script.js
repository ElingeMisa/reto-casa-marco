// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Collection Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionItems = document.querySelectorAll('.collection-item');
    const searchInput = document.getElementById('collectionSearch');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                collectionItems.forEach(item => {
                    if (filter === 'all') {
                        item.classList.remove('hidden');
                    } else {
                        if (item.getAttribute('data-category') === filter) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // Collection Search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            collectionItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const artist = item.querySelector('.artist').textContent.toLowerCase();

                if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }

    // Virtual Tour Modal
    const virtualTourButtons = document.querySelectorAll('.virtual-tour-btn');
    const modal = document.getElementById('tourModal');
    const closeModal = document.querySelector('.close-modal');
    const tourTitle = document.getElementById('tourTitle');

    if (virtualTourButtons.length > 0) {
        virtualTourButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tour = this.getAttribute('data-tour');
                openVirtualTour(tour);
            });
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    function openVirtualTour(tourType) {
        let title = '';
        switch(tourType) {
            case 'renaissance':
                title = 'Renaissance Masters Virtual Tour';
                break;
            case 'modern':
                title = 'Modern Impressions Virtual Tour';
                break;
            case 'ancient':
                title = 'Ancient Civilizations Virtual Tour';
                break;
        }

        tourTitle.textContent = title;
        modal.classList.add('active');
    }

    // Booking Form Price Calculator
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        const adultsInput = document.getElementById('adults');
        const childrenInput = document.getElementById('children');
        const studentsInput = document.getElementById('students');
        const seniorsInput = document.getElementById('seniors');
        const totalPriceDisplay = document.getElementById('totalPrice');

        const prices = {
            adults: 15,
            children: 0,
            students: 10,
            seniors: 12
        };

        function calculateTotal() {
            const adults = parseInt(adultsInput.value) || 0;
            const children = parseInt(childrenInput.value) || 0;
            const students = parseInt(studentsInput.value) || 0;
            const seniors = parseInt(seniorsInput.value) || 0;

            const total = (adults * prices.adults) +
                         (children * prices.children) +
                         (students * prices.students) +
                         (seniors * prices.seniors);

            totalPriceDisplay.textContent = '$' + total.toFixed(2);
        }

        // Add event listeners to all number inputs
        [adultsInput, childrenInput, studentsInput, seniorsInput].forEach(input => {
            if (input) {
                input.addEventListener('input', calculateTotal);
            }
        });

        // Handle form submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const visitDate = document.getElementById('visitDate').value;
            const visitTime = document.getElementById('visitTime').value;
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const total = totalPriceDisplay.textContent;

            // Show confirmation
            alert(`Thank you for your booking, ${name}!\n\nVisit Details:\nDate: ${visitDate}\nTime: ${visitTime}\nTotal: ${total}\n\nConfirmation email will be sent to: ${email}`);

            // Reset form
            bookingForm.reset();
            calculateTotal();
        });
    }

    // Virtual Tour Navigation
    const prevItemBtn = document.getElementById('prevItem');
    const nextItemBtn = document.getElementById('nextItem');
    const itemCounter = document.getElementById('itemCounter');
    let currentItem = 1;
    const totalItems = 8;

    if (prevItemBtn && nextItemBtn) {
        prevItemBtn.addEventListener('click', function() {
            if (currentItem > 1) {
                currentItem--;
                updateItemCounter();
            }
        });

        nextItemBtn.addEventListener('click', function() {
            if (currentItem < totalItems) {
                currentItem++;
                updateItemCounter();
            }
        });
    }

    function updateItemCounter() {
        if (itemCounter) {
            itemCounter.textContent = `${currentItem} / ${totalItems}`;
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe exhibition cards and collection items
    document.querySelectorAll('.exhibition-card, .collection-item, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Set minimum date for booking to today
    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date().toISOString().split('T')[0];
        visitDateInput.setAttribute('min', today);
    }
});
