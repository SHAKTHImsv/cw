import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', function () {
  const mustard = document.getElementById('Mustard');
  const cucumber = document.getElementById('Cucumber');
  const canteen = document.getElementById('Canteen');
  const cinnamon = document.getElementById('Cinnamon');
  const menuItems = document.getElementById('menu-items');

  // Function to fetch menu items for the selected cafe
  function fetchMenuItems(canteenName, subCanteenName) {
    document.querySelector(".cards").style.display = "none";

    const itemsRef = ref(database, 'items');  // Reference to items in the database

    // Fetch all items from the database
    get(itemsRef).then((snapshot) => {
      if (snapshot.exists()) {
        menuItems.innerHTML = ''; // Clear existing items

        snapshot.forEach((itemSnapshot) => {
          const itemData = itemSnapshot.val();

          // Log the item data to debug
          console.log(itemData);

          // Ensure the itemData structure is correct
          if (itemData && itemData.items) {
            // Check if the canteen and subCanteen match the selected cafe
            if (itemData.canteen === canteenName && itemData.subCanteen === subCanteenName) {
              // Loop through the items array and display them
              itemData.items.forEach((item, index) => {
                menuItems.innerHTML += `
                  <div class="sub-cards">
                    <div class="sub-card1">
                      <h1>${item.itemName}</h1>
                      <h2>Price: ${item.itemPrice}</h2>
                    </div>
                  </div>
                `;
              });
            }
          } else {
            console.error('Items array is missing or undefined for item id: ' + itemSnapshot.key);
          }
        });

      } else {
        menuItems.innerHTML = "No items available in the selected canteen.";
      }
    }).catch((error) => {
      console.error("Error fetching data from Firebase: ", error);
      menuItems.innerHTML = "Error fetching menu items. Please try again.";
    });
  }

  // Event listeners for each cafe
  mustard.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Mustard Cafe'));
  cucumber.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cucumber Cafe'));
  canteen.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Saffron Cafe'));
  cinnamon.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cinnamon Cafe'));
});
