document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('password-strength');
    const passwordRequirements = document.getElementById('password-requirements');
    
    // URL de la API de MockAPI
    const apiUrl = 'https://67fe6eb758f18d7209ee325e.mockapi.io/userProfiles';
    
    // Requisitos de contraseña
    const passwordRequirementsList = [
        { regex: /.{8,}/, text: "Al menos 8 caracteres" },
        { regex: /[A-Z]/, text: "Al menos una letra mayúscula" },
        { regex: /[a-z]/, text: "Al menos una letra minúscula" },
        { regex: /[0-9]/, text: "Al menos un número" },
        { regex: /[^A-Za-z0-9]/, text: "Al menos un carácter especial" }
    ];
    
    // Función para validar la contraseña
    function validatePassword(password) {
        let strength = 0;
        let failedRequirements = [];
        
        // Verificar cada requisito
        passwordRequirementsList.forEach(requirement => {
            const isValid = requirement.regex.test(password);
            if (isValid) {
                strength++;
            } else {
                failedRequirements.push(requirement.text);
            }
        });
        
        return {
            strength: strength,
            failedRequirements: failedRequirements,
            isValid: strength === passwordRequirementsList.length
        };
    }
    
    // Actualizar la visualización de la fortaleza de la contraseña
    function updatePasswordStrength() {
        const password = passwordInput.value;
        const validation = validatePassword(password);
        
        // Actualizar la barra de fortaleza
        passwordStrength.className = 'password-strength-bar';
        
        if (password === '') {
            passwordStrength.style.width = '0%';
            passwordStrength.dataset.strength = '';
        } else {
            const strengthPercentage = (validation.strength / passwordRequirementsList.length) * 100;
            passwordStrength.style.width = strengthPercentage + '%';
            
            if (strengthPercentage <= 20) {
                passwordStrength.dataset.strength = 'muy-debil';
            } else if (strengthPercentage <= 40) {
                passwordStrength.dataset.strength = 'debil';
            } else if (strengthPercentage <= 60) {
                passwordStrength.dataset.strength = 'media';
            } else if (strengthPercentage <= 80) {
                passwordStrength.dataset.strength = 'fuerte';
            } else {
                passwordStrength.dataset.strength = 'muy-fuerte';
            }
        }
        
        // Actualizar los requisitos
        passwordRequirements.innerHTML = '';
        validation.failedRequirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            li.className = 'requirement-failed';
            passwordRequirements.appendChild(li);
        });
        
        // Mostrar requisitos cumplidos también
        passwordRequirementsList.forEach(req => {
            if (!validation.failedRequirements.includes(req.text)) {
                const li = document.createElement('li');
                li.textContent = req.text + ' ✓';
                li.className = 'requirement-passed';
                passwordRequirements.appendChild(li);
            }
        });
    }
    
    // Evento para actualizar la fortaleza de la contraseña en tiempo real
    passwordInput.addEventListener('input', updatePasswordStrength);
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validación básica
        if (!email || !password || !confirmPassword) {
            showError('Por favor, completa todos los campos');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Por favor, ingresa un email válido');
            return;
        }
        
        // Validar contraseña
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            showError('La contraseña no cumple con los requisitos de seguridad');
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
        errorMessage.style.opacity = '1';
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
            errorMessage.style.opacity = '0';
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 300);
        }, 3000);
    }
    
    // Inicializar la visualización de requisitos
    updatePasswordStrength();
});