// Elementos do DOM
const loginForm = document.querySelector('#loginForm form');
const registerForm = document.querySelector('#registerForm form');

// Função para mostrar mensagens de feedback
const showFeedback = (message, type = 'success', formElement) => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    formElement.insertBefore(feedbackDiv, formElement.firstChild);
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Handler do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            showFeedback('Login realizado com sucesso!', 'success', loginForm);
            // Redirecionar após login bem-sucedido
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        } else {
            throw new Error('Credenciais inválidas');
        }
    } catch (error) {
        showFeedback('E-mail ou senha incorretos', 'error', loginForm);
    }
});

// Handler do formulário de cadastro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validação básica
    if (password !== confirmPassword) {
        showFeedback('As senhas não coincidem', 'error', registerForm);
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            showFeedback('Cadastro realizado com sucesso!', 'success', registerForm);
            // Limpar formulário
            registerForm.reset();
        } else {
            throw new Error('Erro no cadastro');
        }
    } catch (error) {
        showFeedback('Erro ao realizar cadastro. Tente novamente.', 'error', registerForm);
    }
});

// Handler para recuperação de senha
document.querySelector('.forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    
    if (!email) {
        showFeedback('Digite seu e-mail para recuperar a senha', 'warning', loginForm);
        return;
    }

    try {
        const response = await fetch('/api/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showFeedback('Instruções de recuperação enviadas para seu e-mail', 'success', loginForm);
        } else {
            throw new Error('Erro na recuperação de senha');
        }
    } catch (error) {
        showFeedback('Erro ao solicitar recuperação de senha', 'error', loginForm);
    }
}); 