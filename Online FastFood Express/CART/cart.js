function loadCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItems = document.getElementById("cartItems");
    let cartTotal = document.getElementById("cartTotal");

    let total = 0;

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<h3>Your Cart is Empty!</h3>";
        cartTotal.textContent = "0";
        return;
    }

    cart.forEach(function(item, index) {

        let price = Number(item.price) || 0;
        let quantity = Number(item.quantity) || 1;
        let itemTotal = price * quantity;

        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: ₹${price}</p>

                <div class="quantity-box">
                    <button type="button"
                    onclick="changeQuantity(${index}, -1)">−</button>

                    <span>${quantity}</span>

                    <button type="button"
                    onclick="changeQuantity(${index}, 1)">+</button>
                </div>

                <p>Subtotal: ₹${itemTotal}</p>

                <button type="button"
                class="remove-button"
                onclick="removeFood(${index})">
                    Remove
                </button>
            </div>
        `;
    });

    cartTotal.textContent = total;
}

function changeQuantity(index, change) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) return;

    let quantity = Number(cart[index].quantity) || 1;

    quantity += change;

    if (quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = quantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

function removeFood(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

let orderNowButton = document.getElementById("orderNowButton");

if (orderNowButton) {

    orderNowButton.addEventListener("click", function() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your Cart is Empty!");
            return;
        }

        let total = 0;

        cart.forEach(function(item) {

            let price = Number(item.price) || 0;
            let quantity = Number(item.quantity) || 1;

            total += price * quantity;

        });

        let checkoutTotal = document.getElementById("checkoutTotal");
        let checkoutSection = document.getElementById("checkoutSection");

        if (!checkoutTotal || !checkoutSection) {
            console.error("Delivery Details HTML not found!");
            return;
        }

        checkoutTotal.textContent = total;

        checkoutSection.style.display = "block";

        orderNowButton.style.display = "none";

        checkoutSection.scrollIntoView({
            behavior: "smooth"
        });

    });
}

let deliveryForm = document.getElementById("deliveryForm");

if (deliveryForm) {

    deliveryForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your Cart is Empty!");
            return;
        }

        document.getElementById("checkoutSection").style.display = "none";

        document.getElementById("paymentSection").style.display = "block";

        document.getElementById("paymentSection").scrollIntoView({
            behavior: "smooth"
        });

    });
}

let paymentOptions = document.querySelectorAll(
    'input[name="paymentMethod"]'
);

let upiApps = document.getElementById("upiApps");

let cardDetails = document.getElementById("cardDetails");

paymentOptions.forEach(function(option) {

    option.addEventListener("change", function() {

        if (upiApps) {
            upiApps.style.display =
                this.value === "UPI" ? "block" : "none";
        }

        if (cardDetails) {
            cardDetails.style.display =
                this.value === "Debit/Credit Card" ? "block" : "none";
        }

        if (this.value !== "UPI") {

            document.querySelectorAll(
                'input[name="upiApp"]'
            ).forEach(function(app) {
                app.checked = false;
            });

        }

    });

});

let paymentForm = document.getElementById("paymentForm");

if (paymentForm) {

    paymentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your Cart is Empty!");
            return;
        }

        let selectedPayment = document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

        if (!selectedPayment) {
            alert("Please select a payment method!");
            return;
        }

        // CHECK UPI APP
        if (selectedPayment.value === "UPI") {

            let selectedApp = document.querySelector(
                'input[name="upiApp"]:checked'
            );

            if (!selectedApp) {
                alert("Please select a UPI App!");
                return;
            }
        }
        let allOrders = JSON.parse(
            localStorage.getItem("allOrders")
        ) || [];

        let trackingID;

        do {

            let randomID = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

            trackingID = "OFE-" + randomID;

        } while (
            allOrders.some(function(order) {
                return order.trackingID === trackingID;
            })
        );
        let total = 0;

        cart.forEach(function(item) {

            total +=
                Number(item.price) *
                (Number(item.quantity) || 1);

        });

        let orderDetails = {

            trackingID: trackingID,

            items: cart,

            total: total,

            paymentMethod: selectedPayment.value,

            status: "Order Placed",

            orderDate: new Date().toLocaleString()

        };
        allOrders.push(orderDetails);

        localStorage.setItem(
            "allOrders",
            JSON.stringify(allOrders)
        );
        localStorage.setItem(
            "latestOrder",
            JSON.stringify(orderDetails)
        );
        localStorage.removeItem("cart");
        alert(
            "🎉 Order Placed Successfully!\n\n" +
            "Your Tracking ID: " + trackingID +
            "\n\nPlease save your Tracking ID to track your order."
        );

        loadCart();

    });

}
loadCart();