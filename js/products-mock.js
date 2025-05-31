// Mock de produtos baseado na estrutura do banco de dados
const productsMock = [
    {
        id: 1,
        name: "Smartphone Samsung Galaxy S24",
        description: "Smartphone com tela de 6.2 polegadas, 128GB de armazenamento, câmera tripla de 50MP e 5G.",
        price: 2899.99,
        stock: 15,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        category: "eletronicos",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
    },
    {
        id: 2,
        name: "Notebook Acer Aspire 5",
        description: "Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB, tela 15.6 polegadas Full HD.",
        price: 2499.99,
        stock: 8,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        category: "eletronicos",
        created_at: "2024-01-16T14:20:00Z",
        updated_at: "2024-01-16T14:20:00Z"
    },
    {
        id: 3,
        name: "Camiseta Nike Dri-FIT",
        description: "Camiseta esportiva masculina com tecnologia Dri-FIT, 100% poliéster, respirável e confortável.",
        price: 129.99,
        stock: 25,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        category: "moda",
        created_at: "2024-01-17T09:15:00Z",
        updated_at: "2024-01-17T09:15:00Z"
    },
    {
        id: 4,
        name: "Tênis Adidas Ultraboost 22",
        description: "Tênis de corrida com tecnologia Boost, cabedal Primeknit, solado Continental e máximo conforto.",
        price: 799.99,
        stock: 12,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        category: "moda",
        created_at: "2024-01-18T16:45:00Z",
        updated_at: "2024-01-18T16:45:00Z"
    },
    {
        id: 5,
        name: "Sofá 3 Lugares Retrátil",
        description: "Sofá com 3 lugares, retrátil e reclinável, tecido suede, cor cinza, estrutura de madeira maciça.",
        price: 1899.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        category: "casa",
        created_at: "2024-01-19T11:30:00Z",
        updated_at: "2024-01-19T11:30:00Z"
    },
    {
        id: 6,
        name: "Mesa de Centro Moderna",
        description: "Mesa de centro em vidro temperado com pés em aço inoxidável, design moderno e elegante.",
        price: 599.99,
        stock: 7,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        category: "casa",
        created_at: "2024-01-20T13:20:00Z",
        updated_at: "2024-01-20T13:20:00Z"
    },
    {
        id: 7,
        name: "Bicicleta Mountain Bike Caloi",
        description: "Bicicleta aro 29, 21 marchas, quadro de alumínio, freio a disco, suspensão dianteira.",
        price: 1299.99,
        stock: 10,
        image: "https://images.unsplash.com/photo-1544191696-15693ce37e30?w=400",
        category: "esportes",
        created_at: "2024-01-21T08:10:00Z",
        updated_at: "2024-01-21T08:10:00Z"
    },
    {
        id: 8,
        name: "Kit Halteres Ajustáveis",
        description: "Kit com 2 halteres ajustáveis de 5kg a 25kg cada, anilhas removíveis, ideal para treino em casa.",
        price: 449.99,
        stock: 18,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        category: "esportes",
        created_at: "2024-01-22T15:40:00Z",
        updated_at: "2024-01-22T15:40:00Z"
    },
    {
        id: 9,
        name: "Smart TV LG 55 4K",
        description: "Smart TV LED 55 polegadas, resolução 4K UHD, WebOS, HDR, ThinQ AI, Wi-Fi integrado.",
        price: 2199.99,
        stock: 6,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
        category: "eletronicos",
        created_at: "2024-01-23T12:25:00Z",
        updated_at: "2024-01-23T12:25:00Z"
    },
    {
        id: 10,
        name: "Jaqueta Jeans Feminina",
        description: "Jaqueta jeans feminina com lavagem stonewashed, corte slim fit, bolsos frontais e botões metálicos.",
        price: 189.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        category: "moda",
        created_at: "2024-01-24T17:55:00Z",
        updated_at: "2024-01-24T17:55:00Z"
    }
];

// Simulação de API local
class ProductsAPI {
    constructor() {
        this.products = [...productsMock];
        this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
    }

    // GET /products
    async getProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.products]);
            }, 100);
        });
    }

    // GET /products/:id
    async getProduct(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = this.products.find(p => p.id == id);
                if (product) {
                    resolve({ ...product });
                } else {
                    reject(new Error('Produto não encontrado'));
                }
            }, 100);
        });
    }

    // POST /products
    async createProduct(productData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct = {
                    ...productData,
                    id: this.nextId++,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                this.products.push(newProduct);
                resolve({ ...newProduct });
            }, 100);
        });
    }

    // PUT /products/:id
    async updateProduct(id, productData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.products.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.products[index] = {
                        ...this.products[index],
                        ...productData,
                        updated_at: new Date().toISOString()
                    };
                    resolve({ ...this.products[index] });
                } else {
                    reject(new Error('Produto não encontrado'));
                }
            }, 100);
        });
    }

    // DELETE /products/:id
    async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.products.findIndex(p => p.id == id);
                if (index !== -1) {
                    this.products.splice(index, 1);
                    resolve({ message: 'Produto deletado com sucesso' });
                } else {
                    reject(new Error('Produto não encontrado'));
                }
            }, 100);
        });
    }
}

// Instância global da API mock
const mockAPI = new ProductsAPI();

// Função para simular fetch com fallback para mock
async function mockFetch(url, options = {}) {
    const baseURL = 'http://localhost:3000';
    
    // Tentar fazer a requisição real primeiro
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            return response;
        }
        throw new Error('API não disponível');
    } catch (error) {
        console.log('API não disponível, usando mock local...');
        
        // Usar mock se a API real não estiver disponível
        const urlPath = url.replace(baseURL, '');
        const method = options.method || 'GET';
        
        let result;
        
        if (method === 'GET' && urlPath === '/products') {
            result = await mockAPI.getProducts();
        } else if (method === 'GET' && urlPath.match(/\/products\/\d+/)) {
            const id = urlPath.split('/')[2];
            result = await mockAPI.getProduct(id);
        } else if (method === 'POST' && urlPath === '/products') {
            const data = JSON.parse(options.body);
            result = await mockAPI.createProduct(data);
        } else if (method === 'PUT' && urlPath.match(/\/products\/\d+/)) {
            const id = urlPath.split('/')[2];
            const data = JSON.parse(options.body);
            result = await mockAPI.updateProduct(id, data);
        } else if (method === 'DELETE' && urlPath.match(/\/products\/\d+/)) {
            const id = urlPath.split('/')[2];
            result = await mockAPI.deleteProduct(id);
        }
        
        // Simular objeto Response
        return {
            ok: true,
            json: async () => result
        };
    }
} 