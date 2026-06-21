// Admin Dashboard JavaScript

class AdminDashboard {
    constructor() {
        this.requests = this.loadRequests();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'all';
        this.currentServiceFilter = 'all';
        this.currentSearch = '';
        this.charts = {};
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.updateDashboard();
        this.renderRequestsTable();
        this.renderCustomersTable();
        this.updateCharts();
        this.setupModal();
    }

    loadSampleData() {
        if (this.requests.length === 0) {
            this.requests = this.getSampleRequests();
            this.saveRequests();
        }
    }

    getSampleRequests() {
        const sampleNames = ['John Smith', 'Sarah Johnson', 'Mike Brown', 'Lisa Anderson', 'David Wilson', 'Emma Taylor', 'James Martin', 'Patricia Lee', 'Robert White', 'Maria Garcia'];
        const services = ['washing', 'dishwasher', 'fridge', 'oven', 'dryer', 'installation'];
        const brands = ['Bosch', 'Samsung', 'LG', 'Defy', 'Whirlpool', 'Hisense', 'SMEG', 'AEG'];
        const statuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        
        const requests = [];
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            requests.push({
                id: `REQ-${String(i + 1).padStart(4, '0')}`,
                name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
                email: `customer${i + 1}@example.com`,
                phone: `071${String(Math.floor(Math.random() * 9000000) + 1000000).padStart(7, '0')}`,
                service: services[Math.floor(Math.random() * services.length)],
                brand: brands[Math.floor(Math.random() * brands.length)],
                message: `My ${brands[Math.floor(Math.random() * brands.length)]} appliance is not working properly. It started making strange noises yesterday.`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                date: date.toISOString(),
                replyMethod: ['whatsapp', 'email', 'call'][Math.floor(Math.random() * 3)]
            });
        }
        
        return requests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    loadRequests() {
        const stored = localStorage.getItem('service_requests');
        return stored ? JSON.parse(stored) : [];
    }

    saveRequests() {
        localStorage.setItem('service_requests', JSON.stringify(this.requests));
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage(item.dataset.page);
            });
        });

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.currentPage = 1;
                this.renderRequestsTable();
            });
        }

        // Filters
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.renderRequestsTable();
            });
        }

        const serviceFilter = document.getElementById('service-filter');
        if (serviceFilter) {
            serviceFilter.addEventListener('change', (e) => {
                this.currentServiceFilter = e.target.value;
                this.currentPage = 1;
                this.renderRequestsTable();
            });
        }

        // Export
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }

        // Pagination
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        if (prevBtn) prevBtn.addEventListener('click', () => this.changePage(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.changePage(1));

        // Customer search
        const customerSearch = document.getElementById('customer-search');
        if (customerSearch) {
            customerSearch.addEventListener('input', (e) => {
                this.renderCustomersTable(e.target.value);
            });
        }

        // Settings
        const adminProfileForm = document.getElementById('admin-profile-form');
        if (adminProfileForm) {
            adminProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Profile updated successfully', 'success');
            });
        }

        // Data management
        const backupData = document.getElementById('backup-data');
        if (backupData) {
            backupData.addEventListener('click', () => this.backupData());
        }

        const clearData = document.getElementById('clear-data');
        if (clearData) {
            clearData.addEventListener('click', () => this.clearData());
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Analytics date range
        const applyFilter = document.getElementById('apply-filter');
        if (applyFilter) {
            applyFilter.addEventListener('click', () => this.updateCharts());
        }

        // View all button
        const viewAllBtn = document.querySelector('.btn-view-all');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.switchPage('requests'));
        }
    }

    switchPage(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
        
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');
        
        if (page === 'requests') {
            this.renderRequestsTable();
        } else if (page === 'customers') {
            this.renderCustomersTable();
        } else if (page === 'analytics') {
            this.updateCharts();
        } else if (page === 'dashboard') {
            this.updateDashboard();
        }
    }

    updateDashboard() {
        const total = this.requests.length;
        const pending = this.requests.filter(r => r.status === 'pending').length;
        const inProgress = this.requests.filter(r => r.status === 'in-progress').length;
        const completed = this.requests.filter(r => r.status === 'completed').length;
        const cancelled = this.requests.filter(r => r.status === 'cancelled').length;
        const uniqueCustomers = new Set(this.requests.map(r => r.email)).size;
        
        document.getElementById('total-requests').textContent = total;
        document.getElementById('pending-requests').textContent = pending;
        document.getElementById('in-progress-requests').textContent = inProgress;
        document.getElementById('completed-requests').textContent = completed;
        document.getElementById('cancelled-requests').textContent = cancelled;
        document.getElementById('total-customers').textContent = uniqueCustomers;
        document.getElementById('pending-count').textContent = pending;
        
        // Render recent requests
        const recent = this.requests.slice(0, 5);
        const tbody = document.getElementById('recent-requests-tbody');
        if (tbody) {
            if (recent.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No requests found</td></tr>';
            } else {
                tbody.innerHTML = recent.map(req => `
                    <tr>
                        <td>${req.id}</td>
                        <td>${req.name}</td>
                        <td>${this.getServiceName(req.service)}</td>
                        <td><span class="status-badge status-${req.status}">${this.getStatusName(req.status)}</span></td>
                        <td>${this.formatDate(req.date)}</td>
                        <td><button class="btn-icon view" onclick="dashboard.viewRequest('${req.id}')">👁️</button></td>
                    </tr>
                `).join('');
            }
        }
    }

    renderRequestsTable() {
        let filtered = this.requests;
        
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(r => r.status === this.currentFilter);
        }
        
        if (this.currentServiceFilter !== 'all') {
            filtered = filtered.filter(r => r.service === this.currentServiceFilter);
        }
        
        if (this.currentSearch) {
            const search = this.currentSearch.toLowerCase();
            filtered = filtered.filter(r => 
                r.name.toLowerCase().includes(search) ||
                r.email.toLowerCase().includes(search) ||
                r.phone.includes(search) ||
                r.id.toLowerCase().includes(search)
            );
        }
        
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(start, start + this.itemsPerPage);
        
        document.getElementById('page-info').textContent = `Page ${this.currentPage} of ${totalPages || 1}`;
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === totalPages;
        
        const tbody = document.getElementById('requests-tbody');
        if (paginated.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center">No requests found</td></tr>';
        } else {
            tbody.innerHTML = paginated.map(req => `
                <tr>
                    <td>${req.id}</td>
                    <td>${this.formatDate(req.date)}</td>
                    <td><strong>${req.name}</strong></td>
                    <td>${req.email}</td>
                    <td>${req.phone}</td>
                    <td>${this.getServiceName(req.service)}</td>
                    <td>${req.brand || 'N/A'}</td>
                    <td>${req.message.substring(0, 50)}${req.message.length > 50 ? '...' : ''}</td>
                    <td>
                        <select class="status-badge status-${req.status}" onchange="dashboard.updateStatus('${req.id}', this.value)" style="width: 110px;">
                            <option value="pending" ${req.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${req.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${req.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${req.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                    <td class="action-buttons">
                        <button class="btn-icon view" onclick="dashboard.viewRequest('${req.id}')" title="View">👁️</button>
                        <button class="btn-icon delete" onclick="dashboard.deleteRequest('${req.id}')" title="Delete">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    renderCustomersTable(search = '') {
        const customersMap = new Map();
        
        this.requests.forEach(req => {
            if (!customersMap.has(req.email)) {
                customersMap.set(req.email, {
                    name: req.name,
                    email: req.email,
                    phone: req.phone,
                    requests: [],
                    lastRequest: req.date
                });
            }
            const customer = customersMap.get(req.email);
            customer.requests.push(req);
            if (new Date(req.date) > new Date(customer.lastRequest)) {
                customer.lastRequest = req.date;
            }
        });
        
        let customers = Array.from(customersMap.values());
        
        if (search) {
            const searchLower = search.toLowerCase();
            customers = customers.filter(c => 
                c.name.toLowerCase().includes(searchLower) ||
                c.email.toLowerCase().includes(searchLower) ||
                c.phone.includes(search)
            );
        }
        
        const tbody = document.getElementById('customers-tbody');
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No customers found</td></tr>';
        } else {
            tbody.innerHTML = customers.map(customer => `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.requests.length}</td>
                    <td>${this.formatDate(customer.lastRequest)}</td>
                    <td><button class="btn-icon view" onclick="dashboard.viewCustomerRequests('${customer.email}')">👁️ View</button></td>
                </tr>
            `).join('');
        }
    }

    viewRequest(id) {
        const request = this.requests.find(r => r.id === id);
        if (!request) return;
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">Request ID:</div>
                <div class="detail-value">${request.id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${this.formatDate(request.date, true)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Customer Name:</div>
                <div class="detail-value">${request.name}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${request.email}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">${request.phone}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Service Type:</div>
                <div class="detail-value">${this.getServiceName(request.service)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Brand:</div>
                <div class="detail-value">${request.brand || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value"><span class="status-badge status-${request.status}">${this.getStatusName(request.status)}</span></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Message:</div>
                <div class="detail-value">${request.message}</div>
            </div>
        `;
        
        document.getElementById('view-modal').style.display = 'block';
    }

    updateStatus(id, newStatus) {
        const request = this.requests.find(r => r.id === id);
        if (request) {
            request.status = newStatus;
            this.saveRequests();
            this.renderRequestsTable();
            this.updateDashboard();
            this.renderCustomersTable();
            this.updateCharts();
            this.showNotification('Status updated successfully', 'success');
        }
    }

    deleteRequest(id) {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requests = this.requests.filter(r => r.id !== id);
            this.saveRequests();
            this.renderRequestsTable();
            this.updateDashboard();
            this.renderCustomersTable();
            this.updateCharts();
            this.showNotification('Request deleted successfully', 'success');
        }
    }

    viewCustomerRequests(email) {
        this.currentFilter = 'all';
        this.currentServiceFilter = 'all';
        this.currentSearch = email;
        this.switchPage('requests');
        this.renderRequestsTable();
    }

    updateStatusChart() {
        const statuses = {
            pending: this.requests.filter(r => r.status === 'pending').length,
            'in-progress': this.requests.filter(r => r.status === 'in-progress').length,
            completed: this.requests.filter(r => r.status === 'completed').length,
            cancelled: this.requests.filter(r => r.status === 'cancelled').length
        };
        
        if (this.charts.status) this.charts.status.destroy();
        
        const ctx = document.getElementById('status-chart').getContext('2d');
        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [statuses.pending, statuses['in-progress'], statuses.completed, statuses.cancelled],
                    backgroundColor: ['#ffc107', '#17a2b8', '#28a745', '#dc3545']
                }]
            }
        });
    }

    updateServiceChart() {
        const services = {};
        this.requests.forEach(req => {
            services[req.service] = (services[req.service] || 0) + 1;
        });
        
        if (this.charts.service) this.charts.service.destroy();
        
        const ctx = document.getElementById('service-chart').getContext('2d');
        this.charts.service = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(services).map(s => this.getServiceName(s)),
                datasets: [{
                    label: 'Number of Requests',
                    data: Object.values(services),
                    backgroundColor: '#1C1669'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    updateTrendsChart() {
        const monthlyData = {};
        this.requests.forEach(req => {
            const date = new Date(req.date);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[month] = (monthlyData[month] || 0) + 1;
        });
        
        const sortedMonths = Object.keys(monthlyData).sort();
        
        if (this.charts.trends) this.charts.trends.destroy();
        
        const ctx = document.getElementById('trends-chart').getContext('2d');
        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: 'Service Requests',
                    data: sortedMonths.map(m => monthlyData[m]),
                    borderColor: '#1C1669',
                    backgroundColor: 'rgba(28, 22, 105, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            }
        });
    }

    updateBrandsChart() {
        const brands = {};
        this.requests.forEach(req => {
            if (req.brand) {
                brands[req.brand] = (brands[req.brand] || 0) + 1;
            }
        });
        
        const sortedBrands = Object.entries(brands).sort((a, b) => b[1] - a[1]).slice(0, 5);
        
        if (this.charts.brands) this.charts.brands.destroy();
        
        const ctx = document.getElementById('brands-chart').getContext('2d');
        this.charts.brands = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: sortedBrands.map(b => b[0]),
                datasets: [{
                    data: sortedBrands.map(b => b[1]),
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
                }]
            }
        });
    }

    updateCharts() {
        this.updateStatusChart();
        this.updateServiceChart();
        this.updateTrendsChart();
        this.updateBrandsChart();
    }

    exportToCSV() {
        let filtered = this.requests;
        
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(r => r.status === this.currentFilter);
        }
        
        const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Service', 'Brand', 'Message', 'Status'];
        const rows = filtered.map(req => [
            req.id,
            this.formatDate(req.date),
            req.name,
            req.email,
            req.phone,
            this.getServiceName(req.service),
            req.brand || 'N/A',
            `"${req.message.replace(/"/g, '""')}"`,
            this.getStatusName(req.status)
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `service_requests_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Export completed successfully', 'success');
    }

    changePage(delta) {
        this.currentPage += delta;
        this.renderRequestsTable();
    }

    backupData() {
        const data = JSON.stringify(this.requests);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Data backed up successfully', 'success');
    }

    clearData() {
        if (confirm('WARNING: This will permanently delete ALL service requests. This action cannot be undone. Are you absolutely sure?')) {
            this.requests = [];
            this.saveRequests();
            this.updateDashboard();
            this.renderRequestsTable();
            this.renderCustomersTable();
            this.updateCharts();
            this.showNotification('All data has been cleared', 'warning');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    }

    setupModal() {
        const modal = document.getElementById('view-modal');
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : '#ffc107'};
            color: white;
            border-radius: 8px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getServiceName(service) {
        const names = {
            'washing': 'Washing Machine',
            'dishwasher': 'Dishwasher',
            'fridge': 'Fridge/Freezer',
            'oven': 'Oven/Cooker',
            'dryer': 'Tumble Dryer',
            'installation': 'Installation',
            'other': 'Other'
        };
        return names[service] || service;
    }

    getStatusName(status) {
        const names = {
            'pending': 'Pending',
            'in-progress': 'In Progress',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return names[status] || status;
    }

    formatDate(date, includeTime = false) {
        const d = new Date(date);
        if (includeTime) {
            return d.toLocaleString();
        }
        return d.toLocaleDateString();
    }
}

// Initialize dashboard
const dashboard = new AdminDashboard();

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);