// Elementos do DOM
const profileForm = document.getElementById('profileForm');
const addressForm = document.getElementById('addressForm');
const addressesList = document.getElementById('addressesList');
const addressModal = document.getElementById('addressModal');
const addAddressBtn = document.getElementById('addAddressBtn');
const cancelAddressBtn = document.getElementById('cancelAddress');

// Estado da aplicação
let currentUser = null;
let addresses = [];
let editingAddressId = null;

// Carregar dados do usuário
const loadUserData = async () => {
    try {
        const response = await fetch('/api/user/profile');
        currentUser = await response.json();
        
        // Preencher formulário
        document.getElementById('name').value = currentUser.name;
        document.getElementById('email').value = currentUser.email;
        
        // Carregar endereços
        loadAddresses();
    } catch (error) {
        showFeedback('Erro ao carregar dados do usuário', 'error');
    }
};

// Carregar endereços
const loadAddresses = async () => {
    try {
        const response = await fetch('/api/user/addresses');
        addresses = await response.json();
        renderAddresses();
    } catch (error) {
        showFeedback('Erro ao carregar endereços', 'error');
    }
};

// Renderizar endereços
const renderAddresses = () => {
    addressesList.innerHTML = addresses.map(address => `
        <div class="address-card">
            <h3>Endereço</h3>
            <p>${address.street}</p>
            <p>${address.city} - ${address.state}</p>
            <p>CEP: ${address.zip_code}</p>
            <div class="address-actions">
                <button class="btn btn-secondary" onclick="editAddress(${address.id})">
                    Editar
                </button>
                <button class="btn btn-secondary" onclick="deleteAddress(${address.id})">
                    Excluir
                </button>
            </div>
        </div>
    `).join('');
};

// Função para mostrar mensagens de feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    document.querySelector('.profile-container').insertBefore(
        feedbackDiv,
        document.querySelector('.profile-section')
    );
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Atualizar perfil
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            showFeedback('Perfil atualizado com sucesso!');
        } else {
            throw new Error('Erro ao atualizar perfil');
        }
    } catch (error) {
        showFeedback('Erro ao atualizar perfil', 'error');
    }
});

// Abrir modal de endereço
addAddressBtn.addEventListener('click', () => {
    editingAddressId = null;
    addressForm.reset();
    addressModal.classList.add('active');
});

// Fechar modal de endereço
cancelAddressBtn.addEventListener('click', () => {
    addressModal.classList.remove('active');
});

// Salvar endereço
addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const addressData = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip_code: document.getElementById('zipCode').value
    };

    try {
        const url = editingAddressId 
            ? `/api/user/addresses/${editingAddressId}`
            : '/api/user/addresses';
        
        const method = editingAddressId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            showFeedback(
                editingAddressId 
                    ? 'Endereço atualizado com sucesso!'
                    : 'Endereço adicionado com sucesso!'
            );
            addressModal.classList.remove('active');
            loadAddresses();
        } else {
            throw new Error('Erro ao salvar endereço');
        }
    } catch (error) {
        showFeedback('Erro ao salvar endereço', 'error');
    }
});

// Editar endereço
const editAddress = (addressId) => {
    const address = addresses.find(a => a.id === addressId);
    if (!address) return;

    editingAddressId = addressId;
    
    document.getElementById('street').value = address.street;
    document.getElementById('city').value = address.city;
    document.getElementById('state').value = address.state;
    document.getElementById('zipCode').value = address.zip_code;
    
    addressModal.classList.add('active');
};

// Excluir endereço
const deleteAddress = async (addressId) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

    try {
        const response = await fetch(`/api/user/addresses/${addressId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showFeedback('Endereço excluído com sucesso!');
            loadAddresses();
        } else {
            throw new Error('Erro ao excluir endereço');
        }
    } catch (error) {
        showFeedback('Erro ao excluir endereço', 'error');
    }
};

// Logout
document.getElementById('logoutButton').addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.href = '/index.html';
        } else {
            throw new Error('Erro ao fazer logout');
        }
    } catch (error) {
        showFeedback('Erro ao fazer logout', 'error');
    }
});

// Inicialização
loadUserData(); 