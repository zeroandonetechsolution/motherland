// Multi-step Form Logic
let currentStep = 1;

function nextStep(step) {
    // Basic validation check before moving
    if (step === 2) {
        if (!document.getElementById('childName').value || !document.getElementById('dob').value || !document.getElementById('grade').value) {
            alert('Please fill all child details');
            return;
        }
    }
    if (step === 3) {
        if (!document.getElementById('parentName').value || !document.getElementById('parentPhone').value) {
            alert('Please fill parent contact details');
            return;
        }
        updateSummary();
    }

    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    
    document.getElementById(`step${currentStep}-indicator`).classList.add('done');
    document.getElementById(`step${step}-indicator`).classList.add('active');
    
    currentStep = step;
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    
    document.getElementById(`step${currentStep}-indicator`).classList.remove('active');
    document.getElementById(`step${step}-indicator`).classList.remove('done');
    
    currentStep = step;
}

function updateSummary() {
    const summary = `
        <p><strong>Child:</strong> ${document.getElementById('childName').value}</p>
        <p><strong>Grade:</strong> ${document.getElementById('grade').value}</p>
        <p><strong>Parent:</strong> ${document.getElementById('parentName').value}</p>
        <p><strong>Phone:</strong> ${document.getElementById('parentPhone').value}</p>
    `;
    document.getElementById('summaryArea').innerHTML = summary;
}

// Handle Form Submission (Redirect to Mock Payment)
if (document.getElementById('admissionForm')) {
    document.getElementById('admissionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Save temporary booking data
        const booking = {
            id: 'MAT' + Date.now(),
            childName: document.getElementById('childName').value,
            dob: document.getElementById('dob').value,
            grade: document.getElementById('grade').value,
            parentName: document.getElementById('parentName').value,
            parentPhone: document.getElementById('parentPhone').value,
            status: 'Pending Payment',
            date: new Date().toLocaleDateString()
        };
        
        localStorage.setItem('temp_booking', JSON.stringify(booking));
        
        // Redirect to mock payment page
        window.location.href = 'payment.html';
    });
}

// Scroll Reveal Animation Logic
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Booking Management (Admin Side)
function getBookings() {
    return JSON.parse(localStorage.getItem('motherland_bookings')) || [];
}

function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('motherland_bookings', JSON.stringify(bookings));
}

// Mock Dashboard Loading
if (document.getElementById('bookingsTableBody')) {
    const bookings = getBookings();
    const tableBody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No enrollments yet.</td></tr>';
    } else {
        tableBody.innerHTML = bookings.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.childName}</td>
                <td>${b.grade}</td>
                <td>${b.parentName}</td>
                <td>${b.date}</td>
                <td><span class="status-tag status-paid">${b.status}</span></td>
            </tr>
        `).reverse().join('');
        
        // Update stats
        document.getElementById('totalEnrollments').innerText = bookings.length;
        document.getElementById('totalRevenue').innerText = '₹' + (bookings.length * 1500).toLocaleString();
    }
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        });
    });
}

