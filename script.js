function saveNewProduct() {
    let productId = document.getElementById('productId').value || generateProductId();
    let productName = document.getElementById('productName').value;
    let productPrice = document.getElementById('productPrice').value;
    let productDescription = document.getElementById('productDescription').value;
    let imageInput = document.getElementById('imageInput').files[0];

    if (productName && productPrice && productDescription) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let newProduct = {
                ProductId: productId,
                ProductName: productName,
                Price: Number(productPrice),
                Description: productDescription,
                Image: e.target.result || document.getElementById('existingImage').src
            };

            let products = getProducts();
            let existingIndex = products.findIndex(p => p.ProductId === productId);

            if (existingIndex !== -1) {
                products[existingIndex] = newProduct;
            } else {
                products.push(newProduct);
                alert('Product Added Successfully');
            }

            saveProducts(products);
            alert('Done Successfully');
            window.location.href = 'index.html';
        };

        if (imageInput) {
            reader.readAsDataURL(imageInput);
        } else {
            reader.onload();
        }
    } else {
        alert('Please fill all fields and select an image');
    }
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
            <div class="card">
                <img src="${product.Image}" class="card-img-top" alt="${product.ProductName}" style="height: 200px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.ProductName}</h5>
                    <p class="card-text">Price: ${product.Price}</p>
                    <p class="card-text">${product.Description}</p>
                    <button class="btn btn-warning" onclick="editProduct('${product.ProductId}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
}
