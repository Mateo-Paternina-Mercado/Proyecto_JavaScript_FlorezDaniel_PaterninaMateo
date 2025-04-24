document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm")
    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirmPassword")
    const passwordStrength = document.getElementById("password-strength")
    const passwordRequirements = document.getElementById("password-requirements")
    const errorMessage = document.getElementById("error-message")
  
    // Requisitos de contraseña
    const requirements = [
      { regex: /.{8,}/, text: "Al menos 8 caracteres" },
      { regex: /[0-9]/, text: "Al menos un número" },
      { regex: /[a-z]/, text: "Al menos una letra minúscula" },
      { regex: /[A-Z]/, text: "Al menos una letra mayúscula" },
      { regex: /[^A-Za-z0-9]/, text: "Al menos un carácter especial" },
    ]
  
    // Crear elementos para los requisitos
    requirements.forEach((req) => {
      const li = document.createElement("li")
      li.textContent = req.text
      passwordRequirements.appendChild(li)
    })
  
    // Validar contraseña en tiempo real
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      let strength = 0
      let validRequirements = 0
  
      // Verificar cada requisito
      requirements.forEach((req, index) => {
        const li = passwordRequirements.children[index]
        const isValid = req.regex.test(password)
  
        if (isValid) {
          li.classList.add("valid")
          validRequirements++
        } else {
          li.classList.remove("valid")
        }
      })
  
      // Calcular fuerza de la contraseña
      if (validRequirements >= 5) {
        strength = "strong"
      } else if (validRequirements >= 3) {
        strength = "medium"
      } else if (validRequirements >= 1) {
        strength = "weak"
      } else {
        strength = ""
      }
  
      // Actualizar indicador visual
      passwordStrength.setAttribute("data-strength", strength)
    })
  
    // Validar formulario al enviar
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const email = document.getElementById("email").value
      const password = passwordInput.value
      const confirmPassword = confirmPasswordInput.value
  
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        errorMessage.textContent = "Las contraseñas no coinciden"
        return
      }
  
      // Validar requisitos de contraseña
      let validRequirements = 0
      requirements.forEach((req) => {
        if (req.regex.test(password)) {
          validRequirements++
        }
      })
  
      if (validRequirements < 5) {
        errorMessage.textContent = "La contraseña no cumple con todos los requisitos"
        return
      }
  
      try {
        // Verificar si el usuario ya existe
        const checkResponse = await fetch("https://67fe6eb758f18d7209ee325e.mockapi.io/userProfiles")
        const users = await checkResponse.json()
  
        const userExists = users.some((user) => user.email === email)
  
        if (userExists) {
          errorMessage.textContent = "Este correo electrónico ya está registrado"
          return
        }
  
        // Crear nuevo usuario
        const response = await fetch("https://67fe6eb758f18d7209ee325e.mockapi.io/userProfiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password, // En una aplicación real, esto debería estar encriptado
          }),
        })
  
        if (response.ok) {
          // Redirigir al login
          window.location.href = "index.html"
        } else {
          errorMessage.textContent = "Error al registrar el usuario. Inténtalo de nuevo."
        }
      } catch (error) {
        console.error("Error:", error)
        errorMessage.textContent = "Error de conexión. Inténtalo de nuevo más tarde."
      }
    })
  })
  