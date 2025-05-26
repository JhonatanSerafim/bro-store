// Estado da aplicação
let cartItems = [];

// Elementos do DOM
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartContainer = document.getElementById('emptyCart');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkoutButton');

// Formatar preço
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

// Formatar data
const formatDate = (dateString) => {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Carregar carrinho
const loadCart = async () => {
    try {
        const response = await fetch('/api/cart');
        cartItems = await response.json();
        renderCart();
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        showFeedback('Erro ao carregar carrinho', 'error');
    }
};

// Renderizar carrinho
const renderCart = () => {
    if (cartItems.length === 0) {
        cartItemsContainer.parentElement.style.display = 'none';
        emptyCartContainer.style.display = 'block';
        return;
    }

    cartItemsContainer.parentElement.style.display = 'block';
    emptyCartContainer.style.display = 'none';

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <div class="price">${formatPrice(item.price)}</div>
                <div class="added-at">
                    Adicionado em ${formatDate(item.added_at)}
                </div>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" 
                    onchange="updateQuantity(${item.id}, this.value)"
                    min="1" max="${item.stock}">
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="btn btn-secondary" onclick="removeItem(${item.id})">
                Remover
            </button>
        </div>
    `).join('');

    updateTotals();
};

// Atualizar totais
const updateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
    );

    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal); // Frete será calculado no checkout
};

// Atualizar quantidade
const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
        removeItem(itemId);
        return;
    }

    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stock) {
        showFeedback('Quantidade indisponível em estoque', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
            item.quantity = newQuantity;
            renderCart();
        } else {
            throw new Error('Erro ao atualizar quantidade');
        }
    } catch (error) {
        showFeedback('Erro ao atualizar quantidade', 'error');
    }
};

// Remover item
const removeItem = async (itemId) => {
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            cartItems = cartItems.filter(item => item.id !== itemId);
            renderCart();
            showFeedback('Item removido do carrinho', 'success');
        } else {
            throw new Error('Erro ao remover item');
        }
    } catch (error) {
        showFeedback('Erro ao remover item', 'error');
    }
};

// Ir para checkout
checkoutButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
        showFeedback('Adicione itens ao carrinho primeiro', 'warning');
        return;
    }
    window.location.href = 'checkout.html';
});

// Mostrar feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    document.querySelector('.cart-container').insertBefore(
        feedbackDiv,
        document.querySelector('.cart-items')
    );
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Inicialização
loadCart(); 