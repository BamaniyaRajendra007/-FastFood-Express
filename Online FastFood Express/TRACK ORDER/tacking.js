let currentOrder = null;

let trackingForm = document.getElementById("trackingForm");

if (trackingForm) {

    trackingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let orderId = document.getElementById("orderId")
            .value.trim().toUpperCase();

        let allOrders = JSON.parse(
            localStorage.getItem("allOrders")
        ) || [];

        let order = allOrders.find(function(item) {

            return (
                item.trackingID?.toUpperCase() === orderId ||
                item.orderId?.toUpperCase() === orderId
            );

        });

        let trackingResult = document.getElementById("trackingResult");
        let reviewSection = document.getElementById("reviewSection");

        currentOrder = order || null;

        if (reviewSection) {
            reviewSection.style.display = "none";
        }

        if (!order) {

            trackingResult.innerHTML = `
                <div class="tracking-error">
                    <h3>❌ Order Not Found!</h3>
                    <p>Please enter a valid Tracking ID or Order ID.</p>
                </div>
            `;

            return;
        }
        let statuses = [
            "Order Placed",
            "Order Confirmed",
            "Food Preparing",
            "Ready for Pickup",
            "Out for Delivery",
            "Delivered"
        ];

        let currentStatus = statuses.indexOf(order.status);

        if (currentStatus === -1) {
            currentStatus = 0;
        }
        let timelineHTML = "";

        statuses.forEach(function(status, index) {

            let className = "";

            if (index < currentStatus) {
                className = "completed";
            } else if (index === currentStatus) {
                className = "active";
            }

            timelineHTML += `
                <div class="status-item ${className}">

                    <div class="status-circle">
                        ${index < currentStatus ? "✓" : index + 1}
                    </div>

                    <div class="status-text">
                        <h3>${status}</h3>
                    </div>

                </div>
            `;

        });
        trackingResult.innerHTML = `

            <div class="tracking-card">

                <h2>📦 Order Details</h2>

                <p><strong>Order ID:</strong> ${order.orderId}</p>

                <p><strong>Tracking ID:</strong> ${order.trackingID}</p>

                <p><strong>Order Date:</strong> ${order.orderDate}</p>

                <p><strong>Total Amount:</strong> ₹${order.total}</p>

                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

                <hr>

                <h2>🚚 Order Tracking</h2>

                <div class="status-timeline">
                    ${timelineHTML}
                </div>

                <p class="current-status">
                    Current Status: <strong>${order.status}</strong>
                </p>

            </div>

        `;
        if (order.status === "Delivered") {

            showReviewSection(order);

        }

    });

}

function showReviewSection(order) {

    let reviewSection = document.getElementById("reviewSection");

    let reviewMessage = document.getElementById("reviewMessage");

    if (!reviewSection) return;

    reviewSection.style.display = "block";

    let orderReviews = JSON.parse(
        localStorage.getItem("orderReviews")
    ) || [];

    let existingReview = orderReviews.find(function(item) {

        return item.orderId === order.orderId;

    });

    if (existingReview) {

        document.getElementById("reviewForm").style.display = "none";

        reviewMessage.innerHTML = `
            ⭐ You have already submitted your review!
            <br>
            Your Rating: ${"★".repeat(existingReview.rating)}
            <br>
            Your Review: ${existingReview.review}
        `;

    } else {

        document.getElementById("reviewForm").style.display = "flex";

        reviewMessage.innerHTML = "";

    }

}
let reviewForm = document.getElementById("reviewForm");

if (reviewForm) {

    reviewForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!currentOrder || currentOrder.status !== "Delivered") {

            alert("Review is available only after delivery!");

            return;

        }
        let selectedRating = document.querySelector(
            'input[name="rating"]:checked'
        );

        if (!selectedRating) {

            alert("Please select your star rating!");

            return;

        }
        let customerReview = document.getElementById("customerReview")
            .value.trim();

        if (customerReview === "") {

            alert("Please write your review!");

            return;

        }
        let orderReviews = JSON.parse(
            localStorage.getItem("orderReviews")
        ) || [];

        let alreadyReviewed = orderReviews.some(function(item) {

            return item.orderId === currentOrder.orderId;

        });

        if (alreadyReviewed) {

            alert("You have already submitted your review!");

            return;

        }
        let reviewData = {

            orderId: currentOrder.orderId,

            trackingID: currentOrder.trackingID,

            rating: Number(selectedRating.value),

            review: customerReview,

            reviewDate: new Date().toLocaleString()

        };


        orderReviews.push(reviewData);

        localStorage.setItem(
            "orderReviews",
            JSON.stringify(orderReviews)
        );
        reviewForm.style.display = "none";

        document.getElementById("reviewMessage").innerHTML = `
            <h3>🎉 Thank You for Your Review!</h3>
            <p>Your Rating: ${"★".repeat(reviewData.rating)}</p>
            <p>Your Review: ${reviewData.review}</p>
        `;

    });

}
