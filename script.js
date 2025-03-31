const PRODUCTS_KEY = 'products';

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    displayProducts();
}

// Generate a unique Product ID
function generateProductId() {
    return crypto.randomUUID();
}

// Navigate back to product List
function goBackToProducts() {
    window.location.href = 'index.html';
}

// Navigate to Add Product Page
function navtoAddProduct() {
    window.location.href = 'add_product.html';
}

function saveNewProduct() {
    // Clear previous error messages
    document.getElementById('nameError').textContent = "";
    document.getElementById('priceError').textContent = "";
    document.getElementById('descriptionError').textContent = "";
    document.getElementById('imageError').textContent = "";

    let productId = document.getElementById('productId').value;
    let productName = document.getElementById('productName').value.trim();
    let productPrice = document.getElementById('productPrice').value.trim();
    let productDescription = document.getElementById('productDescription').value.trim();
    let imageInput = document.getElementById('imageInput').files[0];
    let existingImage = document.getElementById('existingImage').src;

    let hasError = false;

    if (!productName) {
        document.getElementById('nameError').textContent = "Product name is required.";
        hasError = true;
    }

    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
        document.getElementById('priceError').textContent = "Enter a valid positive price.";
        hasError = true;
    }

    if (!productDescription) {
        document.getElementById('descriptionError').textContent = "Description cannot be empty.";
        hasError = true;
    }

    if (!imageInput && !existingImage) {
        document.getElementById('imageError').textContent = "Please upload an image.";
        hasError = true;
    }

    if (hasError) return; // Stop execution if validation fails

    let reader = new FileReader();
    reader.onload = function (e) {
        let products = getProducts();
        let existingIndex = products.findIndex(p => p.ProductId === productId);

        if (existingIndex !== -1) {
            // Update existing product
            products[existingIndex].ProductName = productName;
            products[existingIndex].Price = Number(productPrice);
            products[existingIndex].Description = productDescription;
            products[existingIndex].Image = imageInput ? e.target.result : existingImage;
            clearFields();
            alert("Product updated successfully!");
        } else {
            // Add new product
            let newProduct = {
                ProductId: productId || generateProductId(),
                ProductName: productName,
                Price: Number(productPrice),
                Description: productDescription,
                Image: imageInput ? e.target.result : existingImage
            };
            products.push(newProduct);
            clearFields();
            alert("Product added successfully!");
        }

        saveProducts(products);
        localStorage.removeItem('editProductId');

    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    } else {
        reader.onload();
    }
}

// ✅ Function to clear fields after saving
function clearFields() {
    document.getElementById('productId').value = "";
    document.getElementById('productName').value = "";
    document.getElementById('productPrice').value = "";
    document.getElementById('productDescription').value = "";
    document.getElementById('imageInput').value = "";
    document.getElementById('existingImage').src = "";
    document.getElementById('existingImage').style.display = "none";
    document.getElementById('saveButton').innerText = "Save Product";

    // Focus back on the first input field
    document.getElementById('productName').focus();
}


// Display Products
function displayProducts() {
    let products = getProducts();
    let productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
        div.innerHTML = `
            <div class="card" >
                <img src="${product.Image}" class="card-img-top" alt="${product.ProductName}" style="height: 180px; object-fit: cover;">
                <div class="card-body text-center" style="height: 180px">
                    <p class="card card-title">${product.ProductName}</p>
                    <p class="">Price: ${product.Price}</p>
                    <p class="">${product.Description}</p>
                    <div class="d-flex flex-row gap-4">
                    <button class="btn btn-warning w-50" onclick="editProduct('${product.ProductId}')">Edit</button>
                    <button class="btn btn-danger w-50" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                    </div>
                    
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
}

// Edit Product
function editProduct(productId) {
    localStorage.setItem('editProductId', productId);
    window.location.href = 'add_product.html';
}

// Populate Fields in Add Product Page when Editing
function fillFields() {
    let productId = localStorage.getItem('editProductId');
    if (productId) {
        let products = getProducts();
        let product = products.find(p => p.ProductId === productId);
        if (product) {
            document.getElementById('productId').value = product.ProductId;
            document.getElementById('productName').value = product.ProductName;
            document.getElementById('productPrice').value = product.Price;
            document.getElementById('productDescription').value = product.Description;
            document.getElementById('existingImage').src = product.Image;
            document.getElementById('saveButton').innerText = "Save Changes";
            let imageElement = document.getElementById('existingImage');
            imageElement.src = product.Image;
            imageElement.style.display = "block";
        }
        localStorage.removeItem('editProductId');
    }
}

// Delete Product
function deleteProduct(productId) {
    let confirmDelete = confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
        let products = getProducts().filter(p => p.ProductId !== productId);
        saveProducts(products);
    }
}

// Filter & Sort Products
function filterAndDisplay() {
    let query = document.getElementById('filterInput').value.toLowerCase();
    let sortCriteria = document.getElementById('sortSelect').value;
    let products = getProducts();

    // Filter products based on Name or Description
    let filteredProducts = products.filter(product =>
        product.ProductName.toLowerCase().includes(query) ||
        product.Description.toLowerCase().includes(query)
    );

    // Sorting logic
    filteredProducts.sort((a, b) => {
        if (sortCriteria === 'Price') {
            return a.Price - b.Price;
        } else if (sortCriteria === 'ProductName') {
            return a.ProductName.localeCompare(b.ProductName);
        }
        return 0;
    });

    // Display filtered and sorted products
    let productList = document.getElementById('productList');
    productList.innerHTML = '';

    let row = document.createElement('div');
    row.className = 'row';

    filteredProducts.forEach(product => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
        div.innerHTML = `
            <div class="card" >
                <img src="${product.Image}" class="card-img-top" alt="${product.ProductName}" style="height: 180px; object-fit: cover;">
                <div class="card-body text-center" style="height: 180px">
                    <p class="card">${product.ProductName}</p>
                    <p class="price">Price: ${product.Price}</p>
                    <p class="desc">${product.Description}</p>
                    <div class="d-flex flex-row gap-4">
                    <button class="btn btn-warning w-50" onclick="editProduct('${product.ProductId}')">Edit</button>
                    <button class="btn btn-danger w-50" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                    </div> 
                </div>
            </div>
        `;
        row.appendChild(div);
    });

    productList.appendChild(row);
}
