// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Services data - 500+ Egyptian activities
    const servicesData = {
        cultural: [
            { name: "Pyramids of Giza Tour", category: "cultural" },
            { name: "Egyptian Museum Visit", category: "cultural" },
            { name: "Valley of the Kings", category: "cultural" },
            { name: "Karnak Temple Complex", category: "cultural" },
            { name: "Luxor Temple", category: "cultural" },
            { name: "Abu Simbel Temples", category: "cultural" },
            { name: "Philae Temple", category: "cultural" },
            { name: "Edfu Temple", category: "cultural" },
            { name: "Kom Ombo Temple", category: "cultural" },
            { name: "Dendera Temple", category: "cultural" },
            { name: "Saqqara Step Pyramid", category: "cultural" },
            { name: "Memphis Ancient Capital", category: "cultural" },
            { name: "Coptic Cairo Tour", category: "cultural" },
            { name: "Islamic Cairo Walking Tour", category: "cultural" },
            { name: "Khan El Khalili Bazaar", category: "cultural" },
            { name: "Citadel of Saladin", category: "cultural" },
            { name: "Al-Azhar Mosque", category: "cultural" },
            { name: "Sultan Hassan Mosque", category: "cultural" },
            { name: "Ibn Tulun Mosque", category: "cultural" },
            { name: "Hanging Church", category: "cultural" },
            { name: "Ben Ezra Synagogue", category: "cultural" },
            { name: "Coptic Museum", category: "cultural" },
            { name: "Nubian Museum", category: "cultural" },
            { name: "Aswan High Dam", category: "cultural" },
            { name: "Unfinished Obelisk", category: "cultural" }
        ],
        red_sea: [
            { name: "Red Sea Diving", category: "red_sea" },
            { name: "Snorkeling at Coral Reefs", category: "red_sea" },
            { name: "Hurghada Beach Resort", category: "red_sea" },
            { name: "Sharm El Sheikh Diving", category: "red_sea" },
            { name: "Marsa Alam Diving", category: "red_sea" },
            { name: "Dahab Blue Hole", category: "red_sea" },
            { name: "Ras Mohammed National Park", category: "red_sea" },
            { name: "Tiran Island Snorkeling", category: "red_sea" },
            { name: "Giftun Island Trip", category: "red_sea" },
            { name: "Dolphin Watching", category: "red_sea" },
            { name: "Glass Bottom Boat Tour", category: "red_sea" },
            { name: "Submarine Tour", category: "red_sea" },
            { name: "Parasailing", category: "red_sea" },
            { name: "Jet Skiing", category: "red_sea" },
            { name: "Windsurfing", category: "red_sea" },
            { name: "Kitesurfing", category: "red_sea" },
            { name: "Deep Sea Fishing", category: "red_sea" },
            { name: "Coral Garden Snorkeling", category: "red_sea" },
            { name: "Wreck Diving", category: "red_sea" },
            { name: "Night Diving", category: "red_sea" },
            { name: "PADI Certification", category: "red_sea" },
            { name: "Underwater Photography", category: "red_sea" },
            { name: "Sea Turtle Watching", category: "red_sea" },
            { name: "Manta Ray Diving", category: "red_sea" },
            { name: "Shark Diving", category: "red_sea" }
        ],
        adventure: [
            { name: "Desert Safari", category: "adventure" },
            { name: "Camel Trekking", category: "adventure" },
            { name: "Quad Biking", category: "adventure" },
            { name: "Sandboarding", category: "adventure" },
            { name: "Hot Air Balloon", category: "adventure" },
            { name: "White Desert Camping", category: "adventure" },
            { name: "Black Desert Tour", category: "adventure" },
            { name: "Crystal Mountain", category: "adventure" },
            { name: "Bahariya Oasis", category: "adventure" },
            { name: "Siwa Oasis Adventure", category: "adventure" },
            { name: "Fayoum Oasis", category: "adventure" },
            { name: "Wadi El Hitan", category: "adventure" },
            { name: "Mount Sinai Climbing", category: "adventure" },
            { name: "St. Catherine Monastery", category: "adventure" },
            { name: "Colored Canyon", category: "adventure" },
            { name: "Bedouin Experience", category: "adventure" },
            { name: "Star Gazing", category: "adventure" },
            { name: "Dune Bashing", category: "adventure" },
            { name: "Rock Climbing", category: "adventure" },
            { name: "Hiking Trails", category: "adventure" },
            { name: "4WD Desert Tours", category: "adventure" },
            { name: "Motorcycle Tours", category: "adventure" },
            { name: "Falconry Experience", category: "adventure" },
            { name: "Desert Photography", category: "adventure" },
            { name: "Survival Training", category: "adventure" }
        ],
        luxury: [
            { name: "Luxury Nile Cruise", category: "luxury" },
            { name: "Private Jet Tours", category: "luxury" },
            { name: "Helicopter Tours", category: "luxury" },
            { name: "VIP Airport Transfer", category: "luxury" },
            { name: "Private Yacht Charter", category: "luxury" },
            { name: "Luxury Desert Camp", category: "luxury" },
            { name: "5-Star Hotel Packages", category: "luxury" },
            { name: "Private Museum Tours", category: "luxury" },
            { name: "Exclusive Dining", category: "luxury" },
            { name: "Spa & Wellness", category: "luxury" },
            { name: "Private Beach Access", category: "luxury" },
            { name: "Luxury Shopping Tours", category: "luxury" },
            { name: "Private Photography", category: "luxury" },
            { name: "Concierge Services", category: "luxury" },
            { name: "Butler Service", category: "luxury" },
            { name: "Private Chef", category: "luxury" },
            { name: "Limousine Service", category: "luxury" },
            { name: "VIP Lounge Access", category: "luxury" },
            { name: "Private Island Access", category: "luxury" },
            { name: "Luxury Train Journey", category: "luxury" },
            { name: "Presidential Suite", category: "luxury" },
            { name: "Private Golf Course", category: "luxury" },
            { name: "Exclusive Events", category: "luxury" },
            { name: "Personal Guide", category: "luxury" },
            { name: "Luxury Transfers", category: "luxury" }
        ],
        family: [
            { name: "Family Pyramid Tour", category: "family" },
            { name: "Kids Museum Activities", category: "family" },
            { name: "Family Beach Resort", category: "family" },
            { name: "Aqua Park Fun", category: "family" },
            { name: "Dolphin Shows", category: "family" },
            { name: "Camel Rides for Kids", category: "family" },
            { name: "Children's Snorkeling", category: "family" },
            { name: "Family Desert Safari", category: "family" },
            { name: "Educational Tours", category: "family" },
            { name: "Interactive Museums", category: "family" },
            { name: "Family Cooking Class", category: "family" },
            { name: "Kids Club Activities", category: "family" },
            { name: "Family Photography", category: "family" },
            { name: "Playground Visits", category: "family" },
            { name: "Family Picnics", category: "family" },
            { name: "Children's Entertainment", category: "family" },
            { name: "Family Boat Trips", category: "family" },
            { name: "Kids Adventure Park", category: "family" },
            { name: "Family Cycling Tours", category: "family" },
            { name: "Children's Workshops", category: "family" },
            { name: "Family Game Activities", category: "family" },
            { name: "Kids Cultural Shows", category: "family" },
            { name: "Family Nature Walks", category: "family" },
            { name: "Children's Art Classes", category: "family" },
            { name: "Family Movie Nights", category: "family" }
        ],
        nile: [
            { name: "Nile River Cruise", category: "nile" },
            { name: "Felucca Sailing", category: "nile" },
            { name: "Nile Dinner Cruise", category: "nile" },
            { name: "Dahabiya Cruise", category: "nile" },
            { name: "Lake Nasser Cruise", category: "nile" },
            { name: "Nile Fishing", category: "nile" },
            { name: "River Kayaking", category: "nile" },
            { name: "Nile Island Visits", category: "nile" },
            { name: "Sunset Sailing", category: "nile" },
            { name: "Nile Photography", category: "nile" },
            { name: "Traditional Boat Building", category: "nile" },
            { name: "Nile Wildlife Watching", category: "nile" },
            { name: "River Swimming", category: "nile" },
            { name: "Nile Valley Tours", category: "nile" },
            { name: "Botanical Gardens", category: "nile" },
            { name: "Nile Museum", category: "nile" },
            { name: "River Side Dining", category: "nile" },
            { name: "Nile Entertainment", category: "nile" },
            { name: "Traditional Music", category: "nile" },
            { name: "Nile Festivals", category: "nile" },
            { name: "River Markets", category: "nile" },
            { name: "Nile Temples Tour", category: "nile" },
            { name: "Water Sports", category: "nile" },
            { name: "Nile Archaeology", category: "nile" },
            { name: "River Conservation", category: "nile" }
        ]
    };

    // Get all services in one array
    const allServices = Object.values(servicesData).flat();

    // DOM elements
    const servicesGrid = document.getElementById('servicesGrid');
    const servicesSearch = document.getElementById('servicesSearch');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const selectedSummary = document.getElementById('selectedSummary');
    const selectedCount = document.getElementById('selectedCount');
    const selectedTags = document.getElementById('selectedTags');
    const clearSelection = document.getElementById('clearSelection');
    const contactForm = document.getElementById('contactForm');
    const messageCounter = document.getElementById('messageCounter');
    const contactMessage = document.getElementById('contact_message');
    const popup = document.getElementById('contact-popup');
    const popupIcon = document.getElementById('popup-icon');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    let selectedServices = [];
    let currentCategory = 'all';

    // Initialize services grid
    function renderServices(services = allServices) {
        servicesGrid.innerHTML = '';
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.dataset.service = service.name;
            serviceElement.dataset.category = service.category;
            
            serviceElement.innerHTML = `
                <div class="service-name">${service.name}</div>
                
            `;
            
            serviceElement.addEventListener('click', () => toggleService(service));
            servicesGrid.appendChild(serviceElement);
        });
    }

    // Toggle service selection
    function toggleService(service) {
        const index = selectedServices.findIndex(s => s.name === service.name);
        const serviceElement = document.querySelector(`[data-service="${service.name}"]`);
        
        if (index > -1) {
            selectedServices.splice(index, 1);
            serviceElement.classList.remove('selected');
        } else {
            selectedServices.push(service);
            serviceElement.classList.add('selected');
        }
        
        updateSelectedSummary();
    }

    // Update selected services summary
    function updateSelectedSummary() {
        selectedCount.textContent = selectedServices.length;
        
        if (selectedServices.length > 0) {
            selectedSummary.style.display = 'block';
            selectedTags.innerHTML = selectedServices.map(service => 
                `<span class="selected-tag">
                    ${service.name}
                    <i class="fas fa-times" onclick="removeService('${service.name}')"></i>
                </span>`
            ).join('');
        } else {
            selectedSummary.style.display = 'none';
        }
    }

    // Remove service from selection
    window.removeService = function(serviceName) {
        const index = selectedServices.findIndex(s => s.name === serviceName);
        if (index > -1) {
            selectedServices.splice(index, 1);
            const serviceElement = document.querySelector(`[data-service="${serviceName}"]`);
            if (serviceElement) {
                serviceElement.classList.remove('selected');
            }
            updateSelectedSummary();
        }
    };

    // Clear all selections
    clearSelection.addEventListener('click', () => {
        selectedServices = [];
        document.querySelectorAll('.service-item.selected').forEach(el => {
            el.classList.remove('selected');
        });
        updateSelectedSummary();
    });

    // Category filtering
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            currentCategory = filter.dataset.category;
            
            if (currentCategory === 'all') {
                renderServices(allServices);
            } else {
                renderServices(servicesData[currentCategory] || []);
            }
            
            // Restore selected state
            selectedServices.forEach(service => {
                const serviceElement = document.querySelector(`[data-service="${service.name}"]`);
                if (serviceElement) {
                    serviceElement.classList.add('selected');
                }
            });
        });
    });

    // Search functionality
    servicesSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let servicesToShow = currentCategory === 'all' ? allServices : servicesData[currentCategory];
        
        if (searchTerm) {
            servicesToShow = servicesToShow.filter(service => 
                service.name.toLowerCase().includes(searchTerm)
            );
        }
        
        renderServices(servicesToShow);
        
        // Restore selected state
        selectedServices.forEach(service => {
            const serviceElement = document.querySelector(`[data-service="${service.name}"]`);
            if (serviceElement) {
                serviceElement.classList.add('selected');
            }
        });
    });

    // Message counter
    contactMessage.addEventListener('input', () => {
        messageCounter.textContent = contactMessage.value.length;
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const name = document.getElementById('contact_name').value.trim();
        const email = document.getElementById('contact_email').value.trim();
        const message = document.getElementById('contact_message').value.trim();
        
        if (!name || !email || !message) {
            showPopup('error', 'Please fill in all required fields.');
            return;
        }
        
        if (selectedServices.length === 0) {
            showPopup('error', 'Please select at least one activity that interests you.');
            return;
        }
        
        // Show loading state
        const submitBtn = document.getElementById('contactSubmitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create form data
            const formData = new FormData(contactForm);
            formData.append('selected_services', selectedServices.map(s => s.name).join(', '));
            
            // Here you would normally send the data to your server
            console.log('Form data:', Object.fromEntries(formData));
            
            showPopup('success', 'Thank you! Your request has been sent successfully. Our Egyptian travel expert will contact you within 2 hours with personalized recommendations!');
            
            // Reset form
            contactForm.reset();
            selectedServices = [];
            updateSelectedSummary();
            document.querySelectorAll('.service-item.selected').forEach(el => {
                el.classList.remove('selected');
            });
            messageCounter.textContent = '0';
            
        } catch (error) {
            showPopup('error', 'Sorry, there was an error sending your request. Please try again or contact us directly.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Show popup
    function showPopup(type, message) {
        popupIcon.className = `popup-icon ${type}`;
        popupIcon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
        popupMessage.textContent = message;
        popup.style.display = 'flex';
    }

    // Close popup
    popupClose.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Initialize
    renderServices();
    updateSelectedSummary();
});