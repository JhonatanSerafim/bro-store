// Estado da aplicação
let cart = [];
let products = [];

// Elementos do DOM
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartButton = document.getElementById('cartButton');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkout');

// Funções auxiliares
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

// Carregar produtos
const loadProducts = async () => {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Produtos de exemplo para desenvolvimento
        products = [
            { id: 1, name: 'Produto 1', description: 'Descrição do produto 1', price: 99.99, stock: 10 },
            { id: 2, name: 'Produto 2', description: 'Descrição do produto 2', price: 149.99, stock: 5 },
            { id: 3, name: 'Produto 3', description: 'Descrição do produto 3', price: 199.99, stock: 8 }
        ];
        renderProducts();
    }
};

// Renderizar produtos
const renderProducts = () => {
    productsGrid.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product.stock);
        return `
            <div class="product-card">
                <img src="https://via.placeholder.com/200" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${formatPrice(product.price)}</div>
                <div class="stock-status ${stockStatus.class}">
                    Estoque: ${product.stock} unidades
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        `;
    }).join('');
};

// Função para determinar o status do estoque
const getStockStatus = (stock) => {
    if (stock > 8) {
        return { class: 'stock-high', text: 'Em estoque' };
    } else if (stock > 3) {
        return { class: 'stock-medium', text: 'Estoque médio' };
    } else if (stock > 0) {
        return { class: 'stock-low', text: 'Estoque baixo' };
    } else {
        return { class: 'stock-low', text: 'Fora de estoque' };
    }
};

// Mostrar mensagem de feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    const modalContent = document.querySelector('.modal-content');
    modalContent.insertBefore(feedbackDiv, modalContent.firstChild);
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Adicionar ao carrinho
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock === 0) {
        showFeedback('Produto fora de estoque', 'error');
        return;
    }

    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        if (cartItem.quantity >= product.stock) {
            showFeedback('Quantidade máxima disponível atingida', 'warning');
            return;
        }
        cartItem.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1,
            price: product.price,
            name: product.name
        });
    }

    showFeedback('Produto adicionado ao carrinho', 'success');
    updateCartCount();
    renderCart();
};

// Atualizar contador do carrinho
const updateCartCount = () => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
};

// Renderizar carrinho
const renderCart = () => {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="https://via.placeholder.com/80" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Quantidade: ${item.quantity}</p>
                <p>Preço: ${formatPrice(item.price)}</p>
            </div>
            <button class="btn btn-secondary" onclick="removeFromCart(${item.productId})">
                Remover
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
};

// Remover do carrinho
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.productId !== productId);
    updateCartCount();
    renderCart();
};

// Event Listeners
cartButton.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

checkoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            })
        });

        if (response.ok) {
            showFeedback('Pedido realizado com sucesso!', 'success');
            cart = [];
            updateCartCount();
            renderCart();
            setTimeout(() => {
                cartModal.classList.remove('active');
            }, 2000);
        } else {
            throw new Error('Erro ao processar o pedido');
        }
    } catch (error) {
        console.error('Erro no checkout:', error);
        showFeedback('Erro ao processar o pedido. Tente novamente.', 'error');
    }
});

// Inicialização
loadProducts(); 