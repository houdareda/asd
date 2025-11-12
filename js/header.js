// Mobile Menu Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown elements in mobile menu
    const mobileDropdowns = document.querySelectorAll('.nav_links .dropdown');
    
    mobileDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown_menu');
        
        if (dropdownLink && dropdownMenu) {
            // Add click event listener to dropdown link
            dropdownLink.addEventListener('click', function(e) {
                // Only prevent default on mobile (screen width < 992px)
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    
                    // Add visual feedback
                    dropdownLink.style.backgroundColor = '#f8f9fa';
                    dropdownLink.style.color = '#007bff';
                    setTimeout(() => {
                        dropdownLink.style.backgroundColor = '';
                        dropdownLink.style.color = '';
                    }, 150);
                    
                    // Close other dropdowns
                    mobileDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherDropdownMenu = otherDropdown.querySelector('.dropdown_menu');
                            if (otherDropdownMenu) {
                                otherDropdownMenu.classList.remove('show');
                            }
                        }
                    });

// Header Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let scrollThreshold = 500; // Minimum scroll distance to trigger hide/show
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Add active class when scrolled down from top
                if (currentScrollTop > 50) {
                    header.classList.add('header-active');
                } else {
                    header.classList.remove('header-active');
                    header.classList.remove('header-hidden');
                    isScrolling = false;
                    return;
                }

                // Check scroll direction and distance
                const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
                
                if (scrollDifference > scrollThreshold) {
                    if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
                        // Scrolling down - hide header
                        header.classList.add('header-hidden');
                    } else if (currentScrollTop < lastScrollTop) {
                        // Scrolling up - show header
                        header.classList.remove('header-hidden');
                    }
                    
                    lastScrollTop = currentScrollTop;
                }
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });

    // Handle window resize to reset header state
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            header.classList.remove('header-hidden');
        }
    });
});

                    // Toggle current dropdown
                    dropdownMenu.classList.toggle('show');
                }
            });
            
            // Add click feedback for dropdown menu items on mobile
            const dropdownItems = dropdownMenu.querySelectorAll('li a');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        // Add visual feedback
                        this.style.backgroundColor = '#f8f9fa';
                        this.style.color = '#007bff';
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.style.color = '#007bff';
                        }
                        
                        setTimeout(() => {
                            this.style.backgroundColor = '';
                            this.style.color = '';
                            if (icon) {
                                icon.style.color = '';
                            }
                        }, 200);
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            const isDropdownClick = e.target.closest('.dropdown');
            if (!isDropdownClick) {
                mobileDropdowns.forEach(dropdown => {
                    const menu = dropdown.querySelector('.dropdown_menu');
                    if (menu) {
                        menu.classList.remove('show');
                    }
                });
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            // Remove show class from all mobile dropdowns when switching to desktop
            mobileDropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown_menu');
                if (menu) {
                    menu.classList.remove('show');
                }
            });
        }
    });
});

// Mobile Menu Toggle (for hamburger menu)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile_menu_btn');
    const navLinks = document.querySelector('.nav_links');
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle menu icon between bars and X
            if (menuIcon) {
                if (navLinks.classList.contains('active')) {
                    // Menu is open - show X icon
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    // Menu is closed - show bars icon
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
            
            // Close all dropdowns when closing mobile menu
            if (!navLinks.classList.contains('active')) {
                const dropdownMenus = document.querySelectorAll('.nav_links .dropdown_menu');
                dropdownMenus.forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                
                // Reset icon to bars
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
        
        // Close mobile menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                // Reset icon to bars
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }
});

// Currency Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const currencyDropdown = document.querySelector('.currency.dropdown a');
    const currencyModalOverlay = document.getElementById('currencyModalOverlay');
    const currencyModal = document.getElementById('currencyModal');
    const currencyModalClose = document.getElementById('currencyModalClose');
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    // Function to open modal (only on mobile)
    function openCurrencyModal() {
        if (window.innerWidth <= 1050) {
            currencyModalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    // Function to close modal
    function closeCurrencyModal() {
        currencyModalOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Open modal when clicking currency dropdown on mobile
    if (currencyDropdown) {
        currencyDropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 1050) {
                e.preventDefault();
                openCurrencyModal();
            }
        });
    }
    
    // Close modal when clicking close button
    if (currencyModalClose) {
        currencyModalClose.addEventListener('click', closeCurrencyModal);
    }
    
    // Close modal when clicking overlay
    if (currencyModalOverlay) {
        currencyModalOverlay.addEventListener('click', function(e) {
            if (e.target === currencyModalOverlay) {
                closeCurrencyModal();
            }
        });
    }
    
    // Handle currency selection
    currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            const currency = this.getAttribute('data-currency');
            const symbol = this.getAttribute('data-symbol');
            
            // Update the currency display in the header
            if (currencyDropdown) {
                const currencySpan = currencyDropdown.querySelector('span');
                if (currencySpan) {
                    currencySpan.textContent = symbol;
                }
            }
            
            // Close modal
            closeCurrencyModal();
            
            // Here you can add logic to update prices throughout the site
            console.log('Selected currency:', currency, symbol);
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currencyModalOverlay.classList.contains('show')) {
            closeCurrencyModal();
        }
    });
    
    // Handle window resize - close modal if switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1050 && currencyModalOverlay.classList.contains('show')) {
            closeCurrencyModal();
        }
    });

    // Search functionality
    const searchTrigger = document.getElementById('searchTrigger');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchSubmitBtn = document.getElementById('searchSubmitBtn');
    const searchSuggestions = document.getElementById('searchSuggestions');

    const mobileSearchModal = document.getElementById('mobileSearchModal');
    const mobileSearchClose = document.getElementById('mobileSearchClose');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchSubmit = document.getElementById('mobileSearchSubmit');

    let searchTimeout;
    let currentSuggestionIndex = -1;

    // Sample search data - replace with your actual data source
    const searchData = [
        'Cairo Day Tours',
        'Pyramids of Giza',
        'Luxor Temple',
        'Aswan High Dam',
        'Red Sea Diving',
        'Desert Safari',
        'Nile Cruise',
        'Alexandria Tour',
        'Hurghada Snorkeling',
        'Sharm El Sheikh',
        'Valley of the Kings',
        'Karnak Temple',
        'Abu Simbel',
        'Egyptian Museum',
        'Khan El Khalili',
        'Philae Temple',
        'Edfu Temple',
        'Kom Ombo Temple',
        'Dendera Temple',
        'White Desert'
    ];

    // Unified search functionality - responsive behavior
    if (searchTrigger) {
        searchTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if we're on mobile (screen width <= 1050px)
            if (window.innerWidth <= 1050) {
                // On mobile, open the mobile search modal
                openMobileSearch();
            } else {
                // On desktop, toggle the search dropdown
                toggleSearchDropdown();
            }
        });
    }

    function toggleSearchDropdown() {
        const isOpen = searchDropdown.classList.contains('show');
        
        if (isOpen) {
            closeSearchDropdown();
        } else {
            openSearchDropdown();
        }
    }

    function openSearchDropdown() {
        searchDropdown.classList.add('show');
        if (searchInput) {
            searchInput.focus();
        }
    }

    function closeSearchDropdown() {
        searchDropdown.classList.remove('show');
        resetSearch();
    }

    function resetSearch() {
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchSuggestions) {
            searchSuggestions.innerHTML = '';
        }
        currentSuggestionIndex = -1;
        updateClearButton();
    }

    // Search input handling
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            updateClearButton();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    showSuggestions(query);
                } else {
                    clearSuggestions();
                }
            }, 300);
        });

        searchInput.addEventListener('keydown', function(e) {
            handleSearchKeydown(e);
        });
    }

    // Clear button functionality
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            resetSearch();
            searchInput.focus();
        });
    }

    function updateClearButton() {
        if (clearSearchBtn && searchInput) {
            if (searchInput.value.trim().length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
        }
    }

    // Search suggestions
    function showSuggestions(query) {
        const filteredData = searchData.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filteredData.length > 0) {
            const suggestionsHTML = filteredData.map((item, index) => {
                const highlightedItem = highlightMatch(item, query);
                return `<div class="search-suggestion" data-index="${index}" data-value="${item}">${highlightedItem}</div>`;
            }).join('');

            searchSuggestions.innerHTML = suggestionsHTML;

            // Add click listeners to suggestions
            const suggestionElements = searchSuggestions.querySelectorAll('.search-suggestion');
            suggestionElements.forEach(suggestion => {
                suggestion.addEventListener('click', function() {
                    selectSuggestion(this.getAttribute('data-value'));
                });
            });
        } else {
            searchSuggestions.innerHTML = '<div class="no-suggestions">No results found</div>';
        }
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    function clearSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.innerHTML = '';
        }
        currentSuggestionIndex = -1;
    }

    function selectSuggestion(value) {
        if (searchInput) {
            searchInput.value = value;
        }
        performSearch(value);
    }

    // Keyboard navigation
    function handleSearchKeydown(e) {
        const suggestions = searchSuggestions.querySelectorAll('.search-suggestion');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentSuggestionIndex < suggestions.length - 1) {
                    currentSuggestionIndex++;
                    updateSuggestionHighlight(suggestions);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentSuggestionIndex > 0) {
                    currentSuggestionIndex--;
                    updateSuggestionHighlight(suggestions);
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentSuggestionIndex >= 0 && suggestions[currentSuggestionIndex]) {
                    selectSuggestion(suggestions[currentSuggestionIndex].getAttribute('data-value'));
                } else {
                    performSearch(searchInput.value);
                }
                break;
                
            case 'Escape':
                closeSearchDropdown();
                break;
        }
    }

    function updateSuggestionHighlight(suggestions) {
        suggestions.forEach((suggestion, index) => {
            if (index === currentSuggestionIndex) {
                suggestion.classList.add('highlighted');
            } else {
                suggestion.classList.remove('highlighted');
            }
        });
    }

    // Search submission
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput && searchInput.value.trim()) {
                performSearch(searchInput.value.trim());
            }
        });
    }

    // Mobile search functionality is now handled by the main search button

    if (mobileSearchClose) {
        mobileSearchClose.addEventListener('click', function() {
            closeMobileSearch();
        });
    }

    if (mobileSearchModal) {
        mobileSearchModal.addEventListener('click', function(e) {
            if (e.target === mobileSearchModal) {
                closeMobileSearch();
            }
        });
    }

    if (mobileSearchSubmit) {
        mobileSearchSubmit.addEventListener('click', function(e) {
            e.preventDefault();
            if (mobileSearchInput && mobileSearchInput.value.trim()) {
                performSearch(mobileSearchInput.value.trim());
                closeMobileSearch();
            }
        });
    }

    function openMobileSearch() {
        if (mobileSearchModal) {
            mobileSearchModal.classList.add('show');
            if (mobileSearchInput) {
                mobileSearchInput.focus();
            }
        }
    }

    function closeMobileSearch() {
        if (mobileSearchModal) {
            // Add closing animation class
            mobileSearchModal.classList.add('closing');
            
            // Remove show class after animation completes
            setTimeout(() => {
                mobileSearchModal.classList.remove('show');
                mobileSearchModal.classList.remove('closing');
            }, 300); // Match the animation duration
            
            if (mobileSearchInput) {
                mobileSearchInput.value = '';
            }
        }
    }

    // Popular search tags
    const popularSearchTags = document.querySelectorAll('.popular-search-tag');
    popularSearchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.textContent.trim();
            performSearch(searchTerm);
        });
    });

    // Perform search function
    function performSearch(query) {
        console.log('Searching for:', query);
        
        // Close search interfaces
        closeSearchDropdown();
        closeMobileSearch();
        
        // Here you would implement your actual search logic
        // For example, redirect to search results page or filter content
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        
        // For demo purposes, just show an alert
        alert(`Searching for: ${query}`);
    }

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (searchDropdown && searchDropdown.classList.contains('show')) {
            if (!searchDropdown.contains(e.target) && !searchTrigger.contains(e.target)) {
                closeSearchDropdown();
            }
        }
    });

    // Close search on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchDropdown && searchDropdown.classList.contains('show')) {
                closeSearchDropdown();
            }
            if (mobileSearchModal && mobileSearchModal.classList.contains('show')) {
                closeMobileSearch();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1050) {
            closeMobileSearch();
        } else {
            closeSearchDropdown();
        }
    });
});

// Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart elements
    const cartTrigger = document.getElementById('cartTrigger');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartItems = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    
    // Mobile cart elements
    const mobileCartModal = document.getElementById('mobileCartModal');
    const mobileCartClose = document.getElementById('mobileCartClose');
    const mobileCartItems = document.getElementById('mobileCartItems');
    const mobileEmptyCartMessage = document.getElementById('mobileEmptyCartMessage');
    const mobileCartTotal = document.getElementById('mobileCartTotal');

    // Sample cart data (you can replace this with real data from your backend)
    let cartData = [
        {
            id: 1,
            title: "Hurghada: Giftun Island Tour with Snorkeling & Buffet Lunch",
            date: "Thu, Nov 6, 2025",
            time: "8:30 AM",
            location: "hurghada",
            adults: 1,
            language: "english",
            price: 17.50,
            image: "https://egyptra.pro/uploads/products/product_m24411--urghada-iftun-sland-our-with--829_684997cb3b9eb.webp"
        },
        {
            id: 2,
            title: "Hurghada: Quad, Jeep, Camel and Buggy Safari with BBQ Dinner",
            date: "Mon, Dec 1, 2025",
            time: "6:00 AM",
            location: "hurghada",
            adults: 1,
            language: "english",
            price: 20.00,
            image: "https://egyptra.pro/uploads/products/product_m24541--urghada-uad-eep-amel-and-uggy-168_68ef42dfe1ce5.webp"
        }
    ];

    // Initialize cart
    function initCart() {
        updateCartDisplay();
        updateCartCount();
    }

    // Update cart display
    function updateCartDisplay() {
        if (cartData.length === 0) {
            // Show empty cart message
            if (cartItems) cartItems.style.display = 'none';
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (mobileCartItems) mobileCartItems.style.display = 'none';
            if (mobileEmptyCartMessage) mobileEmptyCartMessage.style.display = 'block';
            
            // Update totals
            if (cartTotal) cartTotal.textContent = '€0.00';
            if (mobileCartTotal) mobileCartTotal.textContent = '€0.00';
        } else {
            // Show cart items
            if (cartItems) cartItems.style.display = 'block';
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (mobileCartItems) mobileCartItems.style.display = 'block';
            if (mobileEmptyCartMessage) mobileEmptyCartMessage.style.display = 'none';
            
            // Render cart items
            renderCartItems();
            updateCartTotal();
        }
    }

    // Render cart items
    function renderCartItems() {
        const desktopHTML = cartData.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-info">${item.date} • ${item.time}</div>
                    <div class="cart-item-info">${item.adults} Adult • ${item.language}</div>
                    <div class="cart-item-price-section">
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const mobileHTML = cartData.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-info">${item.date} • ${item.time}</div>
                    <div class="cart-item-info">${item.adults} Adult • ${item.language}</div>
                    <div class="cart-item-price-section">
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        if (cartItems) cartItems.innerHTML = desktopHTML;
        if (mobileCartItems) mobileCartItems.innerHTML = mobileHTML;
    }

    // Update cart total
    function updateCartTotal() {
        const total = cartData.reduce((sum, item) => sum + item.price, 0);
        if (cartTotal) cartTotal.textContent = `€${total.toFixed(2)}`;
        if (mobileCartTotal) mobileCartTotal.textContent = `€${total.toFixed(2)}`;
    }

    // Update cart count
    function updateCartCount() {
        const count = cartData.length;
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Show cart dropdown
    function showCartDropdown() {
        if (cartDropdown) {
            cartDropdown.classList.add('show');
        }
    }

    // Hide cart dropdown
    function hideCartDropdown() {
        if (cartDropdown) {
            cartDropdown.classList.remove('show');
        }
    }

    // Open mobile cart
    function openMobileCart() {
        if (mobileCartModal) {
            mobileCartModal.classList.add('show');
        }
    }

    // Close mobile cart
    function closeMobileCart() {
        if (mobileCartModal) {
            mobileCartModal.classList.add('closing');
            setTimeout(() => {
                mobileCartModal.classList.remove('show');
                mobileCartModal.classList.remove('closing');
            }, 300);
        }
    }

    // Event listeners for desktop cart
    if (cartTrigger) {
        cartTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // On mobile, open mobile cart modal
            if (window.innerWidth <= 1050) {
                openMobileCart();
            } else {
                // On desktop, toggle dropdown
                if (cartDropdown && cartDropdown.classList.contains('show')) {
                    hideCartDropdown();
                } else {
                    showCartDropdown();
                }
            }
        });
    }

    // Close cart dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (cartDropdown && cartDropdown.classList.contains('show')) {
            if (!cartTrigger.contains(e.target) && !cartDropdown.contains(e.target)) {
                hideCartDropdown();
            }
        }
    });

    // Mobile cart close button
    if (mobileCartClose) {
        mobileCartClose.addEventListener('click', closeMobileCart);
    }

    // Close mobile cart when clicking on backdrop
    if (mobileCartModal) {
        mobileCartModal.addEventListener('click', function(e) {
            if (e.target === mobileCartModal) {
                closeMobileCart();
            }
        });
    }

    // Close cart on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (cartDropdown && cartDropdown.classList.contains('show')) {
                hideCartDropdown();
            }
            if (mobileCartModal && mobileCartModal.classList.contains('show')) {
                closeMobileCart();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1050) {
            closeMobileCart();
        } else {
            hideCartDropdown();
        }
    });

    // Function to add item to cart (you can call this from other parts of your app)
    window.addToCart = function(item) {
        cartData.push(item);
        updateCartDisplay();
        updateCartCount();
    };

    // Function to remove item from cart
    window.removeFromCart = function(itemId) {
        cartData = cartData.filter(item => item.id !== itemId);
        updateCartDisplay();
        updateCartCount();
    };

    // Function to clear cart
    window.clearCart = function() {
        cartData = [];
        updateCartDisplay();
        updateCartCount();
    };

    // Initialize cart on page load
    initCart();
});

// Header Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Minimum scroll distance to trigger hide/show
    let activationPoint = 100; // Point where header behavior starts
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // If we're in the first 500px, keep header normal
                if (currentScrollTop <= activationPoint) {
                    header.classList.remove('header-active');
                    header.classList.remove('header-hidden');
                    lastScrollTop = currentScrollTop;
                    isScrolling = false;
                    return;
                }

                // After 500px, start the show/hide behavior
                const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);
                
                if (scrollDifference > scrollThreshold) {
                    if (currentScrollTop > lastScrollTop) {
                        // Scrolling down - hide header
                        header.classList.add('header-hidden');
                        header.classList.remove('header-active');
                    } else {
                        // Scrolling up - show header with active class
                        header.classList.remove('header-hidden');
                        header.classList.add('header-active');
                    }
                    
                    lastScrollTop = currentScrollTop;
                }
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });

    // Handle window resize to reset header state
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            header.classList.remove('header-hidden');
            // Keep active class if we're past activation point
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop <= activationPoint) {
                header.classList.remove('header-active');
            }
        }
    });
});
