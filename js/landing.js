// Elementos do DOM
const featuredProducts = document.getElementById('featuredProducts');
const cartCount = document.getElementById('cartCount');
const newsletterForm = document.getElementById('newsletterForm');

// Carregar produtos em destaque
const loadFeaturedProducts = async () => {
    try {
        const response = await fetch('/api/products/featured');
        const products = await response.json();

        featuredProducts.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price">${formatPrice(product.price)}</div>
                <div class="stock-status ${getStockStatusClass(product.stock)}">
                    ${getStockStatusText(product.stock)}
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        // Produtos de exemplo para desenvolvimento
        const mockProducts = [
            {
                id: 1,
                name: 'Produto 1',
                description: 'Descrição detalhada do produto 1',
                price: 99.99,
                stock: 10,
                image: 'https://via.placeholder.com/200'
            },
            {
                id: 2,
                name: 'Produto 2',
                description: 'Descrição detalhada do produto 2',
                price: 149.99,
                stock: 5,
                image: 'https://via.placeholder.com/200'
            },
            {
                id: 3,
                name: 'Produto 3',
                description: 'Descrição detalhada do produto 3',
                price: 199.99,
                stock: 0,
                image: 'https://via.placeholder.com/200'
            }
        ];

        featuredProducts.innerHTML = mockProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price">${formatPrice(product.price)}</div>
                <div class="stock-status ${getStockStatusClass(product.stock)}">
                    ${getStockStatusText(product.stock)}
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        `).join('');
    }
};

// Formatar preço
const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

// Obter classe do status do estoque
const getStockStatusClass = (stock) => {
    if (stock === 0) return 'stock-low';
    if (stock <= 3) return 'stock-low';
    if (stock <= 8) return 'stock-medium';
    return 'stock-high';
};

// Obter texto do status do estoque
const getStockStatusText = (stock) => {
    if (stock === 0) return 'Fora de estoque';
    if (stock <= 3) return `Últimas ${stock} unidades`;
    if (stock <= 8) return 'Estoque médio';
    return 'Em estoque';
};

// Adicionar ao carrinho
const addToCart = async (productId) => {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            showFeedback('Produto adicionado ao carrinho!');
            updateCartCount();
        } else {
            throw new Error('Erro ao adicionar ao carrinho');
        }
    } catch (error) {
        showFeedback('Erro ao adicionar produto ao carrinho', 'error');
    }
};

// Atualizar contador do carrinho
const updateCartCount = async () => {
    try {
        const response = await fetch('/api/cart/count');
        const data = await response.json();
        cartCount.textContent = data.count;
    } catch (error) {
        console.error('Erro ao atualizar contador do carrinho:', error);
    }
};

// Cadastrar newsletter
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input[type="email"]').value;

    try {
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showFeedback('E-mail cadastrado com sucesso!');
            newsletterForm.reset();
        } else {
            throw new Error('Erro ao cadastrar e-mail');
        }
    } catch (error) {
        showFeedback('Erro ao cadastrar e-mail', 'error');
    }
});

// Mostrar feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    
    document.querySelector('.featured-products').insertBefore(
        feedbackDiv,
        document.querySelector('.products-grid')
    );
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Inicialização
loadFeaturedProducts();
updateCartCount(); 