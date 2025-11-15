// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Find the buttons on the main page
  const bookPassBtn = document.getElementById("one-day-pass-btn");
  const takeTourBtn = document.getElementById("take-tour-btn"); // Assuming this ID exists from your guest_portal.html

  // State for the modal
  let bookingType = "one_day_pass";
  let generatedOTP = "";
  
  // --- Create the Modal Structure ---
  // We create the modal HTML in JavaScript so we don't clutter the main page.
  const modalContainer = document.createElement("div");
  modalContainer.id = "booking-modal-container";
  modalContainer.className = "fixed inset-0 z-50 flex items-center justify-center p-4 hidden"; // Start hidden
  document.body.appendChild(modalContainer);

  // Function to show the modal
  function showModal(type) {
    bookingType = type;
    updateModalContent("details"); // Show the first step
    modalContainer.classList.remove("hidden");
  }

  // Function to hide the modal
  function hideModal() {
    modalContainer.classList.add("hidden");
  }

  // --- Modal Content for each step ---
  // This function replaces the *entire* content of the modal
  // for each step, just like your React app.
  function updateModalContent(step, data = {}) {
    let content = "";
    const title = bookingType === "one_day_pass" ? "One Day Pass" : "Gym Tour";
    const amount = bookingType === "one_day_pass" ? 500 : 200;

    // Base template
    content = `
      <div class="absolute inset-0 bg-black/60" id="modal-overlay"></div>
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto z-10">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 class="text-lg font-semibold text-neutral-900">Book ${title}</h2>
          <button id="modal-close-btn" class="text-neutral-500 hover:text-neutral-800">&times;</button>
        </div>
        <!-- Step-specific content will go here -->
        <div class="p-6">
    `;

    // --- Step 1: Details Form ---
    if (step === "details") {
      content += `
        <form id="details-form" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-neutral-700">Full Name</label>
            <input type="text" name="name" id="name" class="form-input w-full rounded-md border-neutral-300 shadow-sm" required>
          </div>
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-neutral-700">Phone Number</label>
            <input type="tel" name="phone" id="phone" class="form-input w-full rounded-md border-neutral-300 shadow-sm" required>
          </div>
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-neutral-700">Email</label>
            <input type="email" name="email" id="email" class="form-input w-full rounded-md border-neutral-300 shadow-sm" required>
          </div>
          <div class="p-4 bg-primary-50 border border-primary-200 rounded-lg flex justify-between items-center">
            <span class="font-medium text-primary-800">Total Amount:</span>
            <span class="text-2xl font-bold text-primary-600">₹${amount}</span>
          </div>
          <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg shadow-md">
            Send OTP
          </button>
        </form>
      `;
    }

    // --- Step 2: OTP ---
    if (step === "otp") {
      generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
      // We show the OTP in the console for this demo, just like your alert
      console.log("Your OTP is: " + generatedOTP); 
      
      content += `
        <div class="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
            <p class="text-sm text-yellow-800">An OTP has been sent to your mobile (and logged to the console).</p>
        </div>
        <form id="otp-form" class="space-y-4 mt-4">
          <div class="space-y-2">
            <label for="otp" class="block text-sm font-medium text-neutral-700">Enter 6-Digit OTP</label>
            <input type="text" name="otp" id="otp" class="form-input w-full rounded-md border-neutral-300 shadow-sm text-center text-2xl tracking-widest" maxlength="6" required>
          </div>
          <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg shadow-md">
            Verify OTP
          </button>
          <button type="button" id="back-to-details" class="w-full text-sm text-neutral-600 hover:text-neutral-900">Back</button>
        </form>
      `;
    }
    
    // --- Step 3: Payment (Confirmation) ---
    if (step === "payment") {
      content += `
        <div class="space-y-4">
            <h3 class="text-lg font-medium text-neutral-900">Confirm Booking</h3>
            <p class="text-sm text-neutral-600">Your details are verified. Confirm your booking to generate your pass.</p>
            <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
                <div class="flex justify-between"><span class="text-neutral-500">Name:</span> <span class="font-medium">${data.name}</span></div>
                <div class="flex justify-between"><span class="text-neutral-500">Phone:</span> <span class="font-medium">${data.phone}</span></div>
                <div class="flex justify-between"><span class="text-neutral-500">Type:</span> <span class="font-medium">${title}</span></div>
                <div class="flex justify-between pt-2 border-t"><span class="text-neutral-500">Total:</span> <span class="font-bold text-lg text-primary-600">₹${amount}</span></div>
            </div>
            <button id="confirm-booking-btn" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg shadow-md">
                Confirm Booking
            </button>
            <div id="payment-loader" class="hidden text-center">
                <p class="text-neutral-600">Processing payment...</p>
            </div>
        </div>
      `;
    }

    // --- Step 4: Ticket ---
    if (step === "ticket") {
      content += `
        <div class="space-y-4 text-center">
            <h3 class="text-xl font-medium text-neutral-900">Booking Confirmed!</h3>
            <p class="text-sm text-neutral-600">Show this QR code at the reception.</p>
            
            <!-- This is where the QR code will be rendered -->
            <div id="qr-code-canvas" class="p-4 border-2 border-primary-500 rounded-lg inline-block"></div>
            
            <div class="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2 text-left">
                <div class="flex justify-between"><span class="text-neutral-500">Booking ID:</span> <span class="font-medium">${data.bookingId}</span></div>
                <div class="flex justify-between"><span class="text-neutral-500">Name:</span> <span class="font-medium">${data.name}</span></div>
                <div class="flex justify-between"><span class="text-neutral-500">Date:</span> <span class="font-medium">${data.date}</span></div>
                <div class="flex justify-between pt-2 border-t"><span class="text-neutral-500">Amount:</span> <span class="font-bold text-lg text-primary-600">₹${data.amount}</span></div>
            </div>
            <button id="modal-done-btn" class="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-medium py-3 rounded-lg shadow-md">
                Done
            </button>
        </div>
      `;
    }

    // Close the base template
    content += `
        </div> <!-- End p-6 -->
      </div> <!-- End bg-white -->
    `;

    modalContainer.innerHTML = content;

    // --- Add Event Listeners for the new content ---
    
    // Always add listeners for close buttons
    document.getElementById("modal-overlay")?.addEventListener("click", hideModal);
    document.getElementById("modal-close-btn")?.addEventListener("click", hideModal);
    
    // --- Step 1 Listeners ---
    const detailsForm = document.getElementById("details-form");
    if (detailsForm) {
      detailsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(detailsForm);
        const data = Object.fromEntries(formData.entries());
        // Store data and move to OTP step
        updateModalContent("otp", data);
      });
    }

    // --- Step 2 Listeners ---
    const otpForm = document.getElementById("otp-form");
    if (otpForm) {
      document.getElementById("back-to-details")?.addEventListener("click", () => updateModalContent("details"));
      otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredOTP = document.getElementById("otp").value;
        if (enteredOTP === generatedOTP) {
          // Get the data we stored from the previous step
          const name = document.getElementById("name")?.value || data.name;
          const phone = document.getElementById("phone")?.value || data.phone;
          const email = document.getElementById("email")?.value || data.email;
          updateModalContent("payment", { name, phone, email });
        } else {
          alert("Incorrect OTP. Please try again.");
        }
      });
    }

    // --- Step 3 Listeners ---
    const confirmBtn = document.getElementById("confirm-booking-btn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        // Show loader, hide button
        confirmBtn.classList.add("hidden");
        document.getElementById("payment-loader").classList.remove("hidden");

        // --- THIS IS THE API CALL ---
        try {
          const response = await fetch("/api/book_pass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              phone: data.phone,
              email: data.email,
              bookingType: bookingType,
            }),
          });
          
          const result = await response.json();

          if (result.success) {
            // Move to ticket step
            updateModalContent("ticket", { ...data, ...result });
          } else {
            throw new Error(result.error);
          }
        } catch (err) {
          alert("Booking failed: " + err.message);
          updateModalContent("payment", data); // Go back to payment step
        }
      });
    }
    
    // --- Step 4 Listeners ---
    const qrCanvas = document.getElementById("qr-code-canvas");
    if (qrCanvas) {
      // Generate the QR Code using the library
      QRCode.toString(data.qrData, { type: 'svg' }, (err, svgString) => {
        if (err) throw err;
        qrCanvas.innerHTML = svgString;
        qrCanvas.firstChild.style.width = "200px";
        qrCanvas.firstChild.style.height = "200px";
      });
    }
    document.getElementById("modal-done-btn")?.addEventListener("click", hideModal);
    
  } // --- End of updateModalContent function ---

  // --- Initial Page Event Listeners ---
  if (bookPassBtn) {
    bookPassBtn.addEventListener("click", () => showModal("one_day_pass"));
  }
  if (takeTourBtn) {
    takeTourBtn.addEventListener("click", () => showModal("gym_tour"));
  }
});
```

---

### File 3 (Update): `templates/guest_portal.html`

**Action:** Open your `templates/guest_portal.html` file. Scroll to the **very bottom** of the file, right before the closing `{% endblock %}` tag, and **add these two lines**:

```html
<!-- ... (rest of your footer) ... -->
    </footer>

</div>

<!-- 
  ADD THESE TWO LINES at the bottom of your file 
  (inside the 'content' block)
-->
<script src="{{ url_for('static', filename='js/qrcode.min.js') }}"></script>
<script src="{{ url_for('static', filename='js/guest_portal.js') }}"></script>

{% endblock %}