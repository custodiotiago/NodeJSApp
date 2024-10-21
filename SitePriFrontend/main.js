document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const postAulaForm = document.getElementById('postAulaForm');
    const postScriptForm = document.getElementById('postScriptForm');
    const postsContainer = document.getElementById('postsContainer');
    const postForm = document.getElementById('postForm');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeUsername = document.getElementById('welcomeUsername');
    const baseUrl = 'https://nodejsbackend.azurewebsites.net'; // URL do backend

    function checkLoginStatus() {
        const username = localStorage.getItem('username');
        console.log('Status do login - usuário:', username); // Log do usuário autenticado

        if (username) {
            loginButton.style.display = 'none';
            usernameInput.style.display = 'none';
            passwordInput.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            welcomeMessage.style.display = 'inline';
            welcomeUsername.textContent = username;
            postForm.style.display = 'block'; // Mostrar o formulário de postagem
            loadPosts(); // Carregar posts com base na página
        } else {
            loginButton.style.display = 'inline-block';    
            usernameInput.style.display = 'inline-block';
            passwordInput.style.display = 'inline-block';        
            logoutButton.style.display = 'none';
            welcomeMessage.style.display = 'none';
            postForm.style.display = 'none'; // Ocultar o formulário de postagem            
            loadPosts(); // Carregar posts com base na página
        }
    }

    function loadPosts() {
        const url = `${baseUrl}/postagens`;
        console.log('Endpoint de carregamento de posts:', url); // Log do endpoint

        fetch(url)
            .then(response => {
                console.log('Resposta da rede ao carregar posts:', response); // Log da resposta da rede
                if (!response.ok) {
                    throw new Error('Erro na resposta da rede: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Posts recebidos:', data); // Log dos dados de posts recebidos
                const path = window.location.pathname;
                let filteredPosts;

                if (path.includes('aulas.html')) {
                    filteredPosts = data.filter(post => post.tipoPostagem === 1);
                } else if (path.includes('scripts.html')) {
                    filteredPosts = data.filter(post => post.tipoPostagem === 2);
                } else {
                    filteredPosts = [];
                }

                // Inverter a ordem dos posts para que os mais novos fiquem no topo
                filteredPosts.reverse();

                postsContainer.innerHTML = filteredPosts.map(post => `
                    <div class="post mb-3" id="post-${post._id}">
                        <div style="position: relative;">
                            <h4>${post.title}</h4>
                            <p>${post.description}</p>
                            <p><small>Postado por ${post.createdBy}, ${new Date(post.date).toLocaleDateString()} às ${post.time}</small></p>
                            ${localStorage.getItem('username') ? `
                                <button class="deleteButton" data-id="${post._id}" style="position: absolute; top: 5px; right: 5px; width: 15px; height: 15px; background: url('delete-icon.png') no-repeat center center; background-size: contain; border: none; cursor: pointer;"></button>
                            ` : ''}
                        </div>
                    </div>
                `).join('');

                // Adicionar evento de clique aos botões de excluir, se exibidos
                if (localStorage.getItem('username')) {
                    document.querySelectorAll('.deleteButton').forEach(button => {
                        button.addEventListener('click', function() {
                            const postId = this.getAttribute('data-id');
                            deletePost(postId);
                        });
                    });
                }
            })
            .catch(error => console.error('Erro ao carregar postagens:', error));
    }

    function postData(url, data) {
        console.log('Enviando dados para:', url); // Log do URL de envio
        console.log('Dados enviados:', data); // Log dos dados enviados

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Resposta da rede ao postar dados:', response); // Log da resposta da rede
            if (!response.ok) {
                throw new Error('Erro na resposta da rede: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            loadPosts(); // Recarregar posts após envio
        })
        .catch(error => console.error('Erro ao postar dados:', error));
    }

    function deletePost(postId) {
        const endpoint = `${baseUrl}/postagens/${postId}`;
        console.log('Endpoint de exclusão de post:', endpoint); // Log do endpoint de exclusão

        fetch(endpoint, {
            method: 'DELETE',
        })
        .then(response => {
            console.log('Resposta da rede ao excluir post:', response); // Log da resposta da rede
            if (!response.ok) {
                throw new Error('Erro na resposta da rede: ' + response.statusText);
            }
            loadPosts(); // Recarregar posts após exclusão
        })
        .catch(error => console.error('Erro ao excluir postagem:', error));
    }

    function authenticateUser(username, password) {
        const url = `${baseUrl}/users`;
        console.log('Chamando endpoint de autenticação:', url); // Log da URL chamada

        return fetch(url)
            .then(response => {
                console.log('Resposta do servidor:', response); // Log da resposta do servidor
                if (!response.ok) {
                    throw new Error('Erro na resposta da rede: ' + response.statusText);
                }
                return response.json();
            })
            .then(users => {
                console.log('Usuários recebidos:', users); // Log dos dados de usuários recebidos
                const user = users.find(user => user.username === username && user.password === password);
                console.log('Usuário encontrado:', user); // Log do usuário encontrado
                return user !== undefined;
            })
            .catch(error => {
                console.error('Erro ao autenticar usuário:', error);
                return false;
            });
    }

    if (loginButton && logoutButton) {
        loginButton.addEventListener('click', async function() {
            const username = usernameInput.value;
            const password = passwordInput.value;

            console.log('Tentando autenticar usuário:', username); // Log do nome de usuário

            if (username && password) {
                const isAuthenticated = await authenticateUser(username, password);
                if (isAuthenticated) {
                    localStorage.setItem('username', username);
                    checkLoginStatus();
                } else {
                    alert('Usuário ou senha não encontrados.');
                }
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });

        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('username');
            checkLoginStatus();
        });
    }

    function getPostData() {
        const title = document.getElementById('titulo').value;
        const description = document.getElementById('conteudo').value;
        const username = localStorage.getItem('username');
        let tipoPostagem;

        if (postAulaForm && document.location.pathname.includes('aulas.html')) {
            tipoPostagem = 1;
        } else if (postScriptForm && document.location.pathname.includes('scripts.html')) {
            tipoPostagem = 2;
        } else {
            tipoPostagem = null; // Não definido
        }

        return {
            title: title,
            description: description,
            createdBy: username,
            date: new Date().toISOString().split('T')[0], // Data no formato YYYY-MM-DD
            time: new Date().toLocaleTimeString(), // Hora no formato de string
            tipoPostagem: tipoPostagem
        };
    }

    if (postAulaForm || postScriptForm) {
        const postButton = document.getElementById('postButton');
        if (postButton) {
            postButton.addEventListener('click', function() {
                const postDataObject = getPostData();

                if (postDataObject.title && postDataObject.description && postDataObject.tipoPostagem !== null) {
                    postData(`${baseUrl}/postagens`, postDataObject);
                } else {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                }
            });
        }
    }

    loadPosts();   
    checkLoginStatus();
});