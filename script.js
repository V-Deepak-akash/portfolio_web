'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

async function measurePing() {
  const pingText = document.getElementById("ping-text");
  const indicator = document.getElementById("ping-indicator");

  try {
    const start = performance.now();
    await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
    const end = performance.now();
    const ping = Math.round(end - start);

    // Set the display text based on the ping value
    pingText.textContent = ping > 999 ? "999+ ms" : `${ping} ms`;

    // Set the color based on the ping value
    if (ping < 100) {
      indicator.classList.add("ping-green");
      indicator.classList.remove("ping-yellow", "ping-red");
    } else if (ping < 200) {
      indicator.classList.add("ping-yellow");
      indicator.classList.remove("ping-green", "ping-red");
    } else {
      indicator.classList.add("ping-red");
      indicator.classList.remove("ping-green", "ping-yellow");
    }
  } catch (error) {
    pingText.textContent = "999+ ms";
    indicator.classList.add("ping-red");
    indicator.classList.remove("ping-green", "ping-yellow");
  }
}

// Set an interval to update the ping every few seconds
setInterval(measurePing, 1000); // Adjust the interval as needed


// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// JavaScript to toggle downloaded state
// JavaScript to toggle downloaded state and trigger file download
$("#btn-download").click(function () {
  $(this).toggleClass("downloaded");

  // Create a temporary link to download the file
  const fileUrl = 'resume.pdf'; // Change this to the path of your file
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileUrl.split('/').pop(); // Extracts the filename from the URL
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // Clean up
});

// Show toast notification
function showToast(title, message, toastType = "info", duration = 5000) {
  const toast = document.getElementById("toast");

  // Set icon based on toast type (Material Icons)
  const icons = {
    success: '<span class="material-symbols-outlined">task_alt</span>',
    danger: '<span class="material-symbols-outlined">error</span>',
    warning: '<span class="material-symbols-outlined">warning</span>',
    info: '<span class="material-symbols-outlined" style="color: #ffdb70;">info</span>',
  };

  // Set the icon and message for the toast
  toast.querySelector(".toast-message").textContent = message;
  toast.querySelector(".toast-icon").innerHTML = icons[toastType] || icons.info;  // Default to 'info' if no type is provided
  toast.className = `toast toast-${toastType}`;

  // Show toast and start progress bar animation
  toast.style.display = "block";
  toast.querySelector(".toast-progress").style.animationDuration = `${duration / 1000}s`;

  // Hide toast after the given duration
  setTimeout(() => {
    closeToast();
  }, duration);
}

// Close toast notification
function closeToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("closing");  // Add closing animation
  setTimeout(() => {
    toast.style.display = "none";  // Hide after animation
    toast.classList.remove("closing");  // Remove closing animation class
  }, 500);  // Delay to match closing animation
}

function showstillindevelop() {
  showToast('Coming soon....', 'Still in development', 'info', 5000)
}


const API_BASE = 'http://127.0.0.1:5000';

let selectedStars = 0;

document.querySelectorAll("#stars12 span").forEach((star) => {
  star.addEventListener("mouseover", () => {
    const starValue = parseInt(star.getAttribute("data-star"));
    document.querySelectorAll("#stars12 span").forEach((s, idx) => {
      s.classList.toggle("hover", idx < starValue);
    });
  });
  star.addEventListener("mouseleave", () => {
    document.querySelectorAll("#stars12 span").forEach((s) => s.classList.remove("hover"));
  });
  star.addEventListener("click", () => {
    selectedStars = parseInt(star.getAttribute("data-star"));
    document.querySelectorAll("#stars12 span").forEach((s, idx) => {
      s.classList.toggle("active", idx < selectedStars);
    });
  });
});


// Toggle like/dislike
async function toggleLike(reviewId, isLike) {
  const action = isLike ? `${API_BASE}/like` : `${API_BASE}/dislike`;
  const response = await fetch(action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review_id: reviewId }),
  });

  const data = await response.json();
  showToastcomments("Action Complete", data.message, "success", 5000);

  // Reload the reviews dynamically (no page reload)
  loadReviews();
}

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-review-btn");
  const modifyButton = document.getElementById("modify-review-btn");

  // Make sure we are not allowing the form to be submitted by accident
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();  // Explicitly prevent form submit on button click
    submitReview(event);  // Call submitReview after preventing default
  });

  modifyButton.addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submit on button click
    modifyReview(event);  // Call modifyReview after preventing default
  });

  loadReviews();  // Initial review load
  loadViews();    // Initial view count load
});

// Submit a new review (AJAX request)
async function submitReview(event) {
  event.preventDefault();  // Prevent page reload

  const review = document.getElementById("review").value;
  if (!review || selectedStars === 0) {
    showToastcomments("Error", "Please enter a review and select stars.", "danger", 5000);
    return;
  }

  // Send AJAX request to submit the review
  const response = await fetch(`${API_BASE}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review, stars: selectedStars }),
  });

  const data = await response.json();

  // Display success or error based on the response
  if (data.message.includes("already reviewed")) {
    showToastcomments("Notice", data.message, "warning", 5000);
  } else if (data.username) {
    showToastcomments("Success", `Your name is: ${data.username}`, "success", 5000);

    // After successful submission, hide the submit button and show the modify button
    document.querySelector('.submitreviewbtn12').style.display = 'none';  // Hide submit button
    document.querySelector('.modifyreviewbtn12').style.display = 'inline-block';  // Show modify button
  }

  loadReviews();  // Dynamically load reviews (no page reload)
  loadViews();    // Update the views count dynamically
}



async function modifyReview(event) {
  event.preventDefault();  // Prevent page reload

  const review = document.getElementById("review").value;
  if (!review || selectedStars === 0) {
    showToastcomments("Error", "Please update your review and select stars.", "danger", 5000);
    return;
  }

  // Send AJAX request to modify the review
  const response = await fetch(`${API_BASE}/modify`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review, stars: selectedStars }),
  });

  const data = await response.json();

  // Display success or error based on the response
  showToastcomments("Success", data.message, "success", 5000);

  loadReviews();  // Dynamically load reviews (no page reload)
}



// Load reviews asynchronously using AJAX
async function loadReviews() {
  try {
    const response = await fetch(`${API_BASE}/reviews`); // Fetch reviews from the API

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading reviews');
    }

    const reviews = await response.json();
    const reviewsContainer = document.getElementById("reviews");
    const modifyReviewBtn = document.getElementById("modify-review-btn");

    // Check if the current user has already submitted a review
    const userReview = reviews.find((review) => review.is_current_user);

    // Show or hide the "Modify Review" button based on user review existence
    if (userReview) {
      modifyReviewBtn.style.display = "block";
    } else {
      modifyReviewBtn.style.display = "none";
    }

    // Render reviews
    reviewsContainer.innerHTML = reviews
      .map(
        (review) => `
          <div class="review-item ${review.is_current_user ? "highlight" : ""}">
            <h4>@ ${review.username}</h4>
            <p>${review.review}</p>
            <div>⭐ ${review.stars}</div>
            <small>${formatToLocalTime(review.created_at)} ${review.created_at !== review.updated_at ? "(Modified)" : ""
          }</small>
            <div class="actions">
              <span class="heart ${review.liked_by_user ? "active" : ""}" 
                onclick="toggleLike(${review.id}, true)">
                ❤️ ${review.likes}
              </span>
              <span class="broken-heart ${review.disliked_by_user ? "active" : ""}" 
                onclick="toggleLike(${review.id}, false)">
                💔 ${review.dislikes}
              </span>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

// Format UTC time to local time
function formatToLocalTime(utcTime) {
  const localTime = new Date(utcTime);
  return localTime.toLocaleString();
}

async function loadViews() {
  try {
    const response = await fetch(`${API_BASE}/views`);
    const data = await response.json();
    document.getElementById("views-count12").textContent = `Total Views: ${data.views}`;
  } catch (error) {
    console.error("Failed to load views count:", error);
  }
}

// Show toast notification on comments
function showToastcomments(title, message, toastType = "info", duration = 5000) {
  const toast = document.getElementById("toast-comments");

  // Set icon based on toast type (Material Icons)
  const icons = {
    success: '<span class="material-symbols-outlined" style="color: green;">task_alt</span>',
    danger: '<span class="material-symbols-outlined" style="color: red;">error</span>',
    warning: '<span class="material-symbols-outlined" style="color: yellow;">warning</span>',
    info: '<span class="material-symbols-outlined" style="color: #ffdb70;">info</span>',
  };

  // Set the icon and message for the toast
  toast.querySelector(".toast-message-comments").textContent = message;
  toast.querySelector(".toast-icon-comments").innerHTML = icons[toastType] || icons.info;  // Default to 'info' if no type is provided
  toast.className = `toast-comments toast-${toastType}`;

  // Show toast and start progress bar animation
  toast.style.display = "block";
  toast.querySelector(".toast-progress-comments").style.animationDuration = `${duration / 1000}s`;

  // Hide toast after the given duration
  setTimeout(() => {
    closeToast();
  }, duration);
}

// Close toast notification
function closeToast() {
  const toast = document.getElementById("toast-comments");
  toast.classList.add("closing");  // Add closing animation
  setTimeout(() => {
    toast.style.display = "none";  // Hide after animation
    toast.classList.remove("closing");  // Remove closing animation class
  }, 500);  // Delay to match closing animation
}

// Function to toggle visibility of the privacy message
const privacyToggle = document.getElementById('privacy-toggle');
const privacyMessage = document.getElementById('privacy-message');

// Toggle message on button click
privacyToggle.addEventListener('click', (e) => {
  e.stopPropagation();  // Prevent the event from bubbling up to the document
  if (privacyMessage.style.display === 'none' || privacyMessage.style.display === '') {
    privacyMessage.style.display = 'block';
    privacyToggle.classList.add('highlight'); // Highlight the button when message is shown
  } else {
    privacyMessage.style.display = 'none';
    privacyToggle.classList.remove('highlight'); // Remove highlight when message is hidden
  }
});

// Close the message if the user clicks anywhere outside the button or the message
document.addEventListener('click', (e) => {
  if (!privacyToggle.contains(e.target) && !privacyMessage.contains(e.target)) {
    privacyMessage.style.display = 'none';
    privacyToggle.classList.remove('highlight');
  }
});


// Custom select variables
const select12 = document.querySelector("[data-select12]");
const selectItems12 = document.querySelectorAll("[data-select12-item]");
const selectValue12 = document.querySelector("[data-selecct-value12]");
const filterBtn12 = document.querySelectorAll("[data-filter-btn]");

// Function to toggle the "active" class on an element
function elementToggleFunc12(element) {
  element.classList.toggle('active12');
}

select12.addEventListener("click", function () {
  elementToggleFunc12(this);
});

// Add event in all select items
for (let i = 0; i < selectItems12.length; i++) {
  selectItems12[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue12.innerText = this.innerText;
    elementToggleFunc12(select12);
    filterFunc12(selectedValue);
  });
}

// Filter variables
const filterItems12 = document.querySelectorAll("[data-filter-item12]");

const filterFunc12 = function (selectedValue) {
  for (let i = 0; i < filterItems12.length; i++) {
    if (selectedValue === "all") {
      filterItems12[i].classList.add("active12");
    } else if (selectedValue === filterItems12[i].dataset.category) {
      filterItems12[i].classList.add("active12");
    } else {
      filterItems12[i].classList.remove("active12");
    }
  }
}

// Add event in all filter button items for large screen
let lastClickedBtn12 = filterBtn12[0];

for (let i = 0; i < filterBtn12.length; i++) {
  filterBtn12[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue12.innerText = this.innerText;
    filterFunc12(selectedValue);

    lastClickedBtn12.classList.remove("active12");
    this.classList.add("active12");
    lastClickedBtn12 = this;
  });
}


function openModal12(projectId) {
  const modal = document.getElementById('modal12');
  const modalBody = document.getElementById('modal-body12');

  modalBody.scrollTop = 0; // Ensure the modal body is scrolled to the top

  if (projectId === 'voice-assistant') {
    modalBody.innerHTML = `
        <h3>Advanced Voice Assistant</h3>
        <p>
            This voice assistant is not just another generic implementation but a cutting-edge, multi-functional digital assistant that integrates advanced Natural Language Processing (NLP), REST APIs, web scraping, and a host of Python libraries to offer a comprehensive and truly interactive user experience. 
        </p>
        <h4>Unique Features:</h4>
        <ul>
            <li><strong>Time-Based Greetings:</strong> Personalized greetings based on the time, including suggestions like "Sir, it's midnight, you should get some rest."</li>
            <li><strong>Web Navigation:</strong> Open any website, perform web searches, and retrieve results instantly.</li>
            <li><strong>Application Management:</strong> Launch pre-installed applications effortlessly with voice commands.</li>
            <li><strong>Music and Media Control:</strong> Play songs, control playback (pause, play, next, previous), and adjust volume or mute/unmute.</li>
            <li><strong>Mail Handling:</strong> Send emails, schedule them, and even read new messages directly via voice commands.</li>
            <li><strong>Knowledge Base:</strong> Perform Wikipedia searches, look up word meanings, or decode Morse code effortlessly.</li>
            <li><strong>Real-Time Updates:</strong> Get weather forecasts for any location, live cryptocurrency prices, stock market updates, Twitter trends, and trending movie suggestions.</li>
            <li><strong>Productivity Enhancements:</strong> Water reminders, break notifications, a fully functional to-do list, and stopwatch features.</li>
            <li><strong>Interactive Tools:</strong> Flames game, age detection, moon phase tracking, and rock-paper-scissors for fun interactions.</li>
            <li><strong>Informative Services:</strong> Read trending news, retrieve air quality indexes, and provide detailed sunrise/sunset timings for any location.</li>
            <li><strong>Creative Integrations:</strong> Background remover for images, screen recording, and PDF-to-audio conversion.</li>
            <li><strong>System Insights:</strong> Detailed system analysis including RAM, storage, processor health, and more.</li>
            <li><strong>Enhanced Commands:</strong> The assistant evolves by learning new commands dynamically, storing them in a categorized database for future use.</li>
        </ul>
        <h4>Technologies and Skills Showcased:</h4>
        <ul>
            <li><strong>Natural Language Processing (NLP):</strong> Understanding and interpreting user commands for a seamless interaction.</li>
            <li><strong>REST APIs:</strong> Fetching real-time data like weather, cryptocurrency prices, stock updates, and news.</li>
            <li><strong>Beautiful Soup:</strong> Web scraping for specific information such as domain details and Twitter trends.</li>
            <li><strong>Database Integration:</strong> Storing user commands dynamically for continuous improvement.</li>
            <li><strong>Voice and Audio Processing:</strong> Song detection, text-to-speech, and voice recording capabilities.</li>
            <li><strong>Python Libraries:</strong> Utilized libraries like Pandas, Matplotlib, Tkinter, and others to implement and display features effectively.</li>
        </ul>
        <h4>Impact:</h4>
        <p>
            This project is a testament to my ability to combine various technologies into a single, cohesive solution. Unlike generic voice assistant projects, this assistant is tailored for practical, real-world applications, demonstrating not only technical expertise but also a strong focus on user needs and functionality.
        </p>
        <p>
            The "Advanced Voice Assistant" stands as a comprehensive showcase of my skill set, from programming and NLP to API integration and database management, making it a highlight in any portfolio.
        </p>
      `;
  }

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 50); // Add smooth display transition
  document.body.style.overflow = 'hidden'; // Disable background scrolling
}

function closeModal12(event = null) {
  const modal = document.getElementById('modal12');
  if (event && event.target !== modal) return;

  modal.classList.remove('active'); // Remove active state for smooth fade-out
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
  }, 400); // Matches the transition duration
}


//quote

const quoteToggle = document.getElementById('fav-quote');
const quoteMessage = document.getElementById('quote-message');

// Toggle message visibility
quoteToggle.addEventListener('click', (e) => {
  e.stopPropagation();

  if (quoteMessage.style.opacity === '0' || !quoteMessage.style.opacity) {
    quoteMessage.style.display = 'block';
    setTimeout(() => (quoteMessage.style.opacity = '1'), 10); // Fade-in
    quoteToggle.textContent = 'Hide Quote';
    quoteToggle.classList.add('highlight');
  } else {
    quoteMessage.style.opacity = '0'; // Fade-out
    setTimeout(() => (quoteMessage.style.display = 'none'), 300); // Wait for fade-out
    quoteToggle.textContent = 'Show Quote';
    quoteToggle.classList.remove('highlight');
  }
});

// Close the message on outside click
document.addEventListener('click', (e) => {
  if (!quoteToggle.contains(e.target) && !quoteMessage.contains(e.target)) {
    quoteMessage.style.opacity = '0';
    setTimeout(() => (quoteMessage.style.display = 'none'), 300);
    quoteToggle.textContent = 'Show Quote';
    quoteToggle.classList.remove('highlight');
  }
});