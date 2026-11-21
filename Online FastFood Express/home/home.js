function searchFood() {

    const searchInput = document.getElementById("searchInput");
    const searchMessage = document.getElementById("searchMessage");

    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue === "") {

        searchMessage.textContent = "Please enter a food name.";

        return;
    }

    const foods = [
        "burger",
        "pizza",
        "fries",
        "roll",
        "beverages",
        "dessert"
    ];

    const found = foods.some(food =>
        food.includes(searchValue)
    );

    if (found) {

        searchMessage.textContent =
            "Food found! Opening menu...";

        setTimeout(() => {
            window.location.href = "../menu/menu.html";
        }, 700);

    } else {

        searchMessage.textContent =
            "Sorry, no food item found.";

    }
}

function addToCart(foodName, price) {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingItem = cart.find(
        item => item.name === foodName
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: foodName,
            price: price,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(foodName + " added to cart!");

}

function claimOffer() {

    alert(
        "₹50 OFF offer selected! Please login and continue your order."
    );

    window.location.href = "../menu/menu.html";
}
