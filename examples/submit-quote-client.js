/**
 * Client example demonstrating how to use the enhanced quote submission API
 * 
 * This example shows how to send structured data to the /submit-quote endpoint
 * and handle the response.
 */

// Example using fetch API
async function submitQuote() {
  // Form data for the quote request
  const quoteData = {
    email: "user@example.com",
    industry: "metal_fabrication",
    material: "Aluminum",
    quantity: 100,
    complexity: "Medium",
    surface_finish: "Powder Coat",
    lead_time_preference: "Standard",
    custom_fields: {
      thickness_mm: 2.0,
      width_mm: 50,
      height_mm: 30
    },
    full_quote_shown: true
  };

  try {
    // Send POST request to the API
    const response = await fetch('/api/v1/submit-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteData),
    });

    // Parse the JSON response
    const result = await response.json();

    // Check if the request was successful
    if (response.ok) {
      console.log('Quote submitted successfully!');
      console.log(`Quote range: $${result.quote_range.minAmount} - $${result.quote_range.maxAmount}`);
      console.log(`Estimated lead time: ${result.lead_time_estimate}`);
      
      // You can now use the result data to update your UI
      updateQuoteUI(result);
    } else {
      console.error('Failed to submit quote:', result.error);
      showErrorMessage(result.error || 'An unknown error occurred');
    }
  } catch (error) {
    console.error('Exception while submitting quote:', error);
    showErrorMessage('Network error. Please try again later.');
  }
}

// Example function to update the UI with quote results
function updateQuoteUI(quoteResult) {
  // This is just an example - implement based on your actual UI
  document.getElementById('quote-min').textContent = `$${quoteResult.quote_range.minAmount}`;
  document.getElementById('quote-max').textContent = `$${quoteResult.quote_range.maxAmount}`;
  document.getElementById('lead-time').textContent = quoteResult.lead_time_estimate;
  
  // Show the quote result section
  document.getElementById('quote-result').classList.remove('hidden');
  
  // Hide the form
  document.getElementById('quote-form').classList.add('hidden');
}

// Example function to show error messages
function showErrorMessage(message) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  
  // Hide the error after 5 seconds
  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}

// Example HTML structure:
/*
<div id="quote-form">
  <form onSubmit="event.preventDefault(); submitQuote();">
    <input type="email" id="email" placeholder="Email" required />
    <select id="industry">
      <option value="metal_fabrication">Metal Fabrication</option>
      <option value="injection_molding">Injection Molding</option>
      <!-- Add more industries as needed -->
    </select>
    <input type="text" id="material" placeholder="Material" required />
    <input type="number" id="quantity" placeholder="Quantity" min="1" required />
    <select id="complexity">
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <input type="text" id="surface_finish" placeholder="Surface Finish" />
    <select id="lead_time_preference">
      <option value="Standard">Standard</option>
      <option value="Rush">Rush</option>
    </select>
    
    <!-- Custom fields section -->
    <div id="custom-fields">
      <input type="number" id="thickness_mm" placeholder="Thickness (mm)" step="0.1" />
      <input type="number" id="width_mm" placeholder="Width (mm)" />
      <input type="number" id="height_mm" placeholder="Height (mm)" />
    </div>
    
    <button type="submit">Get Quote</button>
  </form>
  
  <div id="error-message" class="hidden"></div>
</div>

<div id="quote-result" class="hidden">
  <h2>Your Quote</h2>
  <p>Estimated Price Range: <span id="quote-min"></span> - <span id="quote-max"></span></p>
  <p>Estimated Lead Time: <span id="lead-time"></span></p>
  
  <button onclick="document.getElementById('quote-form').classList.remove('hidden'); document.getElementById('quote-result').classList.add('hidden');">
    Back to Form
  </button>
</div>
*/ 