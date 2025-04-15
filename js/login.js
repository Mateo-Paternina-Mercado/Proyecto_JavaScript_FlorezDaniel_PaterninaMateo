document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    
    // URL de la API de MockAPI
    const apiUrl = 'https://67fe6eb758f18d7209ee325e.mockapi.io/userProfiles';
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        try {
            // Obtener todos los usuarios para verificar credenciales
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Error al conectar con el servidor');
            }
            
            const users = await response.json();
            
            // Buscar usuario con email y contraseña coincidentes
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Login exitoso
                // Guardar información de sesión
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    email: user.email
                }));
                
                // Redirigir a la página principal o dashboard
                window.location.href = './views/dashboard.html';
            } else {
                showError('Email o contraseña incorrectos');
            }
            
        } catch (error) {
            showError('Error de conexión: ' + error.message);
            console.error('Error:', error);
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }
});