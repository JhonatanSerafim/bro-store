// Elementos do DOM
const productsList = document.getElementById('productsList');
const deleteModal = document.getElementById('deleteModal');
const closeModal = document.querySelector('.close');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

let currentProductId = null;

// Função para carregar os produtos
async function loadProducts() {
    try {
        const response = await mockFetch('http://localhost:3000/products');
        const products = await response.json();
        
        productsList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <p class="product-stock">Estoque: ${product.stock} unidades</p>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="openDeleteModal(${product.id})">
                        <i class="fas fa-trash"></i> Deletar
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productsList.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

// Função para abrir o modal de exclusão
function openDeleteModal(productId) {
    currentProductId = productId;
    deleteModal.style.display = 'block';
}

// Função para fechar o modal
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    currentProductId = null;
}

// Função para deletar o produto
async function deleteProduct() {
    if (!currentProductId) return;

    try {
        const response = await mockFetch(`http://localhost:3000/products/${currentProductId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            closeDeleteModal();
            loadProducts(); // Recarrega a lista de produtos
        } else {
            alert('Erro ao deletar o produto. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar o produto. Tente novamente.');
    }
}

// Função para editar o produto
function editProduct(productId) {
    window.location.href = `edit-product.html?id=${productId}`;
}

// Event Listeners
closeModal.addEventListener('click', closeDeleteModal);
cancelDelete.addEventListener('click', closeDeleteModal);
confirmDelete.addEventListener('click', deleteProduct);

// Fechar o modal quando clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

// Carregar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', loadProducts); 