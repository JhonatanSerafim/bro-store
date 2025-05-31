// Elementos do DOM
const featuredProducts = document.getElementById('featuredProducts');
const cartCount = document.getElementById('cartCount');
const newsletterForm = document.getElementById('newsletterForm');

// Carregar produtos em destaque (apenas 4 produtos)
const loadFeaturedProducts = async () => {
    try {
        const response = await mockFetch('http://localhost:3000/products');
        const allProducts = await response.json();
        
        // Pegar apenas os primeiros 4 produtos
        const products = allProducts.slice(0, 4);

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
            },
            {
                id: 4,
                name: 'Produto 4',
                description: 'Descrição detalhada do produto 4',
                price: 299.99,
                stock: 8,
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

// Adicionar ao carrinho (simulação)
const addToCart = async (productId) => {
    try {
        // Simulação de adicionar ao carrinho
        showFeedback('Produto adicionado ao carrinho!');
        
        // Incrementar contador do carrinho
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        
        // Salvar no localStorage para persistir
        localStorage.setItem('cartCount', currentCount + 1);
    } catch (error) {
        showFeedback('Erro ao adicionar produto ao carrinho', 'error');
    }
};

// Atualizar contador do carrinho
const updateCartCount = () => {
    try {
        const savedCount = localStorage.getItem('cartCount') || '0';
        cartCount.textContent = savedCount;
    } catch (error) {
        console.error('Erro ao atualizar contador do carrinho:', error);
        cartCount.textContent = '0';
    }
};

// Cadastrar newsletter
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input[type="email"]').value;

    try {
        // Simulação de cadastro na newsletter
        showFeedback('E-mail cadastrado com sucesso!');
        newsletterForm.reset();
    } catch (error) {
        showFeedback('Erro ao cadastrar e-mail', 'error');
    }
});

// Mostrar feedback
const showFeedback = (message, type = 'success') => {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `message message-${type}`;
    feedbackDiv.textContent = message;
    feedbackDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        font-weight: bold;
        text-align: center;
        ${type === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
    `;
    
    document.querySelector('.featured-products .container').insertBefore(
        feedbackDiv,
        document.querySelector('.products-grid')
    );
    
    setTimeout(() => {
        feedbackDiv.remove();
    }, 3000);
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    updateCartCount();
}); 