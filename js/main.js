// Main JavaScript for customer-facing pages

document.addEventListener('DOMContentLoaded', function() {
    
    // Helper function to detect service type from message
    function detectServiceType(message) {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('wash') || lowerMsg.includes('washing')) return 'washing';
        if (lowerMsg.includes('dish')) return 'dishwasher';
        if (lowerMsg.includes('fridge') || lowerMsg.includes('freezer')) return 'fridge';
        if (lowerMsg.includes('oven') || lowerMsg.includes('cooker') || lowerMsg.includes('stove')) return 'oven';
        if (lowerMsg.includes('dryer') || lowerMsg.includes('tumble')) return 'dryer';
        return 'other';
    }
    
    // Service request form submission (index.html)
    const serviceForm = document.getElementById('service_form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const method = document.getElementById('method');
            const message = document.getElementById('message');
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, true);
                isValid = false;
            } else {
                showError(name, false);
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                showError(email, true);
                isValid = false;
            } else {
                showError(email, false);
            }
            
            // Validate phone (10 digits)
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone.value.replace(/\D/g, ''))) {
                showError(phone, true);
                isValid = false;
            } else {
                showError(phone, false);
            }
            
            // Validate method
            if (!method.value) {
                showError(method, true);
                isValid = false;
            } else {
                showError(method, false);
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(message, true);
                isValid = false;
            } else {
                showError(message, false);
            }
            
            if (isValid) {
                // Create request object
                const request = {
                    id: `REQ-${Date.now()}`,
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    replyMethod: method.value,
                    message: message.value,
                    service: detectServiceType(message.value),
                    status: 'pending',
                    date: new Date().toISOString()
                };
                
                // Save to localStorage
                let requests = JSON.parse(localStorage.getItem('service_requests') || '[]');
                requests.unshift(request);
                localStorage.setItem('service_requests', JSON.stringify(requests));
                
                showFormMessage('Thank you! Your request has been submitted. We will contact you shortly.', 'success');
                serviceForm.reset();
                
                setTimeout(() => {
                    const msgDiv = document.getElementById('form_message');
                    if (msgDiv) msgDiv.innerHTML = '';
                }, 5000);
            }
        });
    }
    
    // Contact form submission (contact.html)
    const contactForm = document.getElementById('contact_form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('contact_name');
            const email = document.getElementById('contact_email');
            const phone = document.getElementById('contact_phone');
            const service = document.getElementById('contact_service');
            const message = document.getElementById('contact_message');
            const terms = document.getElementById('contact_terms');
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, true);
                isValid = false;
            } else {
                showError(name, false);
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                showError(email, true);
                isValid = false;
            } else {
                showError(email, false);
            }
            
            // Validate phone
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone.value.replace(/\D/g, ''))) {
                showError(phone, true);
                isValid = false;
            } else {
                showError(phone, false);
            }
            
            // Validate service
            if (!service.value) {
                showError(service, true);
                isValid = false;
            } else {
                showError(service, false);
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(message, true);
                isValid = false;
            } else {
                showError(message, false);
            }
            
            // Validate terms
            if (!terms.checked) {
                showError(terms, true);
                isValid = false;
            } else {
                showError(terms, false);
            }
            
            if (isValid) {
                const brand = document.getElementById('contact_brand');
                const suburb = document.getElementById('contact_suburb');
                const urgency = document.getElementById('contact_urgency');
                
                const request = {
                    id: `REQ-${Date.now()}`,
                    name: name.value,
                    email: email.value,
                    phone: phone.value,
                    suburb: suburb ? suburb.value : '',
                    service: service.value,
                    brand: brand ? brand.value : '',
                    message: message.value,
                    urgency: urgency ? urgency.value : 'normal',
                    status: 'pending',
                    date: new Date().toISOString()
                };
                
                let requests = JSON.parse(localStorage.getItem('service_requests') || '[]');
                requests.unshift(request);
                localStorage.setItem('service_requests', JSON.stringify(requests));
                
                showContactFormMessage('Thank you! Your message has been sent. We will respond within 1 hour.', 'success');
                contactForm.reset();
                
                setTimeout(() => {
                    const msgDiv = document.getElementById('contact_form_message');
                    if (msgDiv) msgDiv.innerHTML = '';
                }, 5000);
            }
        });
    }
    
    // Helper functions
    function showError(input, show) {
        const formGroup = input.closest('.form_group');
        if (formGroup) {
            const errorSpan = formGroup.querySelector('.error_text');
            if (errorSpan) {
                if (show) {
                    errorSpan.style.display = 'block';
                    input.style.borderColor = '#dc3545';
                } else {
                    errorSpan.style.display = 'none';
                    input.style.borderColor = '#ddd';
                }
            }
        }
    }
    
    function showFormMessage(message, type) {
        const msgDiv = document.getElementById('form_message');
        if (msgDiv) {
            msgDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }
    }
    
    function showContactFormMessage(message, type) {
        const msgDiv = document.getElementById('contact_form_message');
        if (msgDiv) {
            msgDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.hasAttribute('required')) {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    showError(this, true);
                } else {
                    showError(this, false);
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    showError(this, false);
                }
            });
        }
    });
    
    // Phone number formatting (only digits, max 10)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    });
});