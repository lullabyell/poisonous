console.log('Script loaded successfully');
document.addEventListener("DOMContentLoaded", function () {
    const accessibilityButton = document.getElementById('toggle-accessibility');
    console.log('Accessibility button:', accessibilityButton);
    const textSizeSelector = document.getElementById("text-size-selector");

    const bodyParser = require('body-parser');

    // Add this line before the app.post route
    app.use(bodyParser.json());


    accessibilityButton.addEventListener('click', function () {
        console.log('Accessibility button clicked');
        document.body.classList.toggle('accessibility-mode');
        applySelectedTextSize(); // Apply the selected text size when toggling accessibility mode
      });

      textSizeSelector.addEventListener("change", function () {
        applySelectedTextSize();
      });
    
      // Log initial state for debugging
      console.log("Initial Text Size:", textSizeSelector.value);
    
      // Log changes in the dropdown for debugging
      textSizeSelector.addEventListener("input", function () {
        console.log("Changed Text Size:", textSizeSelector.value);
      });

    const mainContent = document.querySelector(".main-content");
    const navLinks = document.querySelectorAll("#navbar a");
    const form = document.getElementById('poisonousPlantForm'); // Define form globally

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
          // Prevent the default behavior of the link (e.g., navigating to a new page)
          event.preventDefault();
    
          // Get the href attribute of the clicked link
          const targetPage = link.getAttribute("href");
    
          // Load the content of the target page using an AJAX request
          loadPage(targetPage);
    
          // Update the active class for the navigation links
          navLinks.forEach((navLink) => navLink.classList.remove("active"));
          link.classList.add("active");
        });
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        if (validateForm()) {
          // If the form is valid, send data to the server
          sendDataToServer();
        }
      });
    
      // Server setup with Express and CORS
      const express = require('express');
      const cors = require('cors');
      const bodyParser = require('body-parser');

      const app = express();
    
      // Enable CORS for all routes
      app.use(cors());
      app.use(bodyParser.json());

      app.post('/submit-form', (req, res) => {
        console.log(req.body);
        res.send('Form submitted successfully');
    });
    
      app.listen(8080, () => {
        console.log('Server is running on http://localhost:8080');
      });
    
      // Rest of your client-side code...
    
      function applySelectedTextSize() {
        const body = document.body;
        const selectedSize = textSizeSelector.value;
    
        body.classList.remove("text-size-small", "text-size-normal", "text-size-large");
    
        if (selectedSize !== "") {
          body.classList.add(`text-size-${selectedSize}`);
        }
      }

      function loadPage(pageUrl) {
        // Perform an AJAX request to get the content of the target page
        fetch(pageUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
            }
            return response.text();
          })
          .then(content => {
            // Replace the content of the main section with the fetched content
            mainContent.innerHTML = content;
    
            // Update the URL in the browser without reloading the page
            history.pushState(null, null, pageUrl);
          })
          .catch(error => {
            console.error("Failed to load the page", error);
          });
      }

    app.post('/submit-form', (req, res) => {
        console.log(req.body); // Log the request body to the console
        // ... (your form submission logic)
        res.send('Form submitted successfully');
    });
    
    // Initial page load
    loadPage(location.pathname);

    // Add a click event listener to each navigation link
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            // Prevent the default behavior of the link (e.g., navigating to a new page)
            event.preventDefault();

            // Get the href attribute of the clicked link
            const targetPage = link.getAttribute("href");

            // Load the content of the target page using an AJAX request
            loadPage(targetPage);

            // Update the active class for the navigation links
            navLinks.forEach((navLink) => navLink.classList.remove("active"));
            link.classList.add("active");
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        if (validateForm()) {
            // If the form is valid, send data to the server
            sendDataToServer();
        }
    });
    
    function sendDataToServer() {
      const formData = new FormData(form);

    fetch('http://localhost:8080/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success (e.g., show a success message to the user)
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show an error message to the user)
    });
  }
    

    // Function to load the content of a page
    function loadPage(pageUrl) {
        // Perform an AJAX request to get the content of the target page
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(content => {
                // Replace the content of the main section with the fetched content
                mainContent.innerHTML = content;

                // Update the URL in the browser without reloading the page
                history.pushState(null, null, pageUrl);
            })
            .catch(error => {
                console.error("Failed to load the page", error);
            });
    }

    function toggleDatasheet() {
        var datasheet = document.querySelector('.plant-datasheet');
        datasheet.classList.toggle('visible');
    }

    // Handle the back and forward browser buttons
    window.addEventListener("popstate", function (event) {
        // Check if there's a state associated with the history change
        if (event.state) {
            // Load the content of the associated page
            loadPage(location.pathname);

            // Update the active class for the navigation links
            const activeLink = document.querySelector(`#navbar a[href="${location.pathname}"]`);
            navLinks.forEach((navLink) => navLink.classList.remove("active"));
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });

    // Function to validate the form
    function validateForm() {
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var location = document.getElementById('location').value;
        var date = document.getElementById('date').value;
        var description = document.getElementById('description').value;
        var touchedYes = document.getElementById('touched-yes').checked;
        var touchedNo = document.getElementById('touched-no').checked;

        // Validate "Was the Plant Touched?" is compulsory
        if (!touchedYes && !touchedNo) {
            document.getElementById('error-message').innerText = 'Please select whether the plant was touched.';
            return false;
        }

        // Validate date is not in the future
        var currentDate = new Date();
        var selectedDate = new Date(date);
        if (selectedDate > currentDate) {
            document.getElementById('error-message').innerText = 'Date cannot be in the future.';
            return false;
        }

        if (!form.checkValidity()) {
            return false;
        }

        // Reset error message if everything is valid
        document.getElementById('error-message').innerText = '';

        return true; // Change to true if you want the form to be submitted
    }
});
