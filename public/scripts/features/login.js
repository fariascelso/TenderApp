document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Limpar mensagem de erro
        errorMessage.textContent = '';

        // Validação simples (exemplo)
        if (!username || !password) {
            errorMessage.textContent = 'Por favor, preencha todos os campos.';
            return;
        }

        // Exemplo de credenciais válidas (substitua por integração com backend)
        const validUsername = 'admin';
        const validPassword = '123456';

        if (username === validUsername && password === validPassword) {
            // Redirecionar para a página principal (ex.: details.html)
            window.location.href = 'details.html'; // Ajuste o caminho conforme necessário
        } else {
            errorMessage.textContent = 'Usuário ou senha incorretos.';
        }
    });
});