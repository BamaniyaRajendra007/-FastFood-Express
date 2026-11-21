function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingFood = cart.find(item => item.name === name);

    if (existingFood) {
        existingFood.quantity = (existingFood.quantity || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart successfully!");
}