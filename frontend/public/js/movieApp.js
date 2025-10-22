// Updated authManager with backend connection
const authManager = {
    init() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    },

    async handleLogin() {
        const formData = new FormData(document.getElementById('loginForm'));
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Show loading
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('loadingSpinner').classList.add('flex');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(data.message || 'Login successful! 🎉', 'success');
                this.toggleLoginModal();
                this.updateUIForUser(data.user);
            } else {
                this.showToast(data.message || 'Login failed. Try: demo@example.com / password123', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Cannot connect to server. Make sure backend is running on port 5000.', 'error');
        } finally {
            document.getElementById('loadingSpinner').classList.add('hidden');
            document.getElementById('loadingSpinner').classList.remove('flex');
        }
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`;
        
        toast.classList.remove('translate-x-full');
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 4000);
    },

    toggleLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
    },

    updateUIForUser(user) {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>${user.username}`;
        loginBtn.classList.add('bg-gradient-to-r', 'from-green-600', 'to-teal-600');
        loginBtn.classList.remove('from-purple-600', 'to-pink-600');
    }
};