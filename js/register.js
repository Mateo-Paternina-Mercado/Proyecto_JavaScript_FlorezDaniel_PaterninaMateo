document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');
    
    // URL de la API de MockAPI
    const apiUrl = 'https://67fe6eb758f18d7209ee325e.mockapi.io/userProfiles';
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validación básica
        if (!email || !password || !confirmPassword) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        try {
            // Verificar si el email ya está registrado
            const checkResponse = await fetch(apiUrl);
            
            if (!checkResponse.ok) {
                throw new Error('Error al conectar con el servidor');
            }
            
            const users = await checkResponse.json();
            
            if (users.some(user => user.email === email)) {
                showError('Este email ya está registrado');
                return;
            }
            
            // Crear nuevo usuario
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }
            
            const newUser = await response.json();
            
            // Registro exitoso
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = '../index.html';
            
        } catch (error) {
            showError('Error: ' + error.message);
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