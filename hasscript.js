import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7gqwik4wavvokkCMHR8RzonMfhgEfRYA",
    authDomain: "canteen-ee9be.firebaseapp.com",
    projectId: "canteen-ee9be",
    storageBucket: "canteen-ee9be.appspot.com",
    messagingSenderId: "216018272764",
    appId: "1:216018272764:web:fe4f9dcdfe7bb88070b279",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define the menu container to avoid the "menu is not defined" error
const menu = document.getElementById("menu-items");

document.addEventListener("DOMContentLoaded", function () {
    const Himalayan = document.getElementById("Himalayan");
    const Marina = document.getElementById("Marina");
    const Tanjore = document.getElementById("Tanjore");
    const Neelagiri = document.getElementById("Neelagiri");
    const Madurai = document.getElementById("Madurai");
    const Trichy = document.getElementById("Trichy");
    const Vivekanandha = document.getElementById("Vivekanandha");

    // Event listeners for each sub-canteen (sub-cards)
    Himalayan.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Himalayan'));
    Marina.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Marina'));
   
    Neelagiri.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Neelagiri'));
  
    Vivekanandha.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Vivekanandha'));
});

// Function to fetch menu items based on the canteen (main) and sub-canteen
function fetchMenuItems(canteenName, subCanteenName) {
    const menu = document.getElementById("menu-items");
    document.querySelector(".cards").style.display = "none"; // Hide the cards when displaying menu items

    const itemRef = ref(database, 'items'); // Reference to the "items" node in Firebase
    get(itemRef).then((snapshot) => {
        if (snapshot.exists()) {
            menu.innerHTML = ''; // Clear previous menu items
            snapshot.forEach((itemSnapshot) => {
                const itemdata = itemSnapshot.val();
                const itemId = itemSnapshot.key; // Get the unique item ID

                // Ensure the itemdata has the right structure
                if (itemdata && itemdata.items) {
                    // Only proceed if the canteen is "Hostel Canteen" and the subCanteen matches the clicked one
                    if (itemdata.canteen === canteenName && itemdata.subCanteen.toLowerCase().includes(subCanteenName.toLowerCase())) {

                        // Loop through the items and display each one
                        itemdata.items.forEach((item, index) => {
                            menu.innerHTML += `
                                <div class="sub-cards" id="item-${itemId}-${index}">
                                    <div class="sub-card1">
                                        <h1>${item.itemName}</h1>
                                        <h2>Price: ₹${item.itemPrice}</h2>
                                        <button class="delete-btn" data-item-id="${itemId}" data-item-index="${index}">Delete</button>
                                    </div>
                                </div>
                            `;
                        });
                    }
                }
            });

            // Add event listeners for delete buttons after they are created
            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', function () {
                    const itemId = this.getAttribute('data-item-id');
                    const itemIndex = this.getAttribute('data-item-index');

                    // Delete the item from Firebase
                    deleteItem(itemId, itemIndex);
                });
            });
        } else {
            console.log('No data found.');
            menu.innerHTML = "<p>No menu items available for this sub-canteen.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
        menu.innerHTML = "<p>Error fetching data. Please try again later.</p>"; // Display an error message
    });
}

// Function to delete an item from Firebase
function deleteItem(itemId, itemIndex) {
    const itemRef = ref(database, 'items/' + itemId + '/items/' + itemIndex);  // Reference to the specific item
    remove(itemRef).then(() => {
       

        // Refresh the menu to reflect the changes
        fetchMenuItems('hostelCanteen', 'Himalayan'); // Or any other canteen you want to refresh for
    }).catch((error) => {
        console.error("Error deleting item: ", error);
    });
}
