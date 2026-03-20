/**
 * ============================================================================
 * SAFESTART SECURITY DASHBOARD - MAIN JAVASCRIPT
 * ============================================================================
 * 
 * This file controls all the interactive behavior of the dashboard.
 * 
 * TABLE OF CONTENTS:
 * ------------------
 * 1. INITIALIZATION (DOMContentLoaded)
 * 2. RISK CHART - Donut chart drawing with Canvas API
 * 3. ANIMATIONS - Progress bars, counters, score circle
 * 4. EVENT LISTENERS - Button clicks, navigation, filters
 * 5. TOAST NOTIFICATIONS - Popup messages
 * 6. API INTEGRATION - Fetch data from server (optional)
 * 
 * HOW THIS FILE WORKS:
 * --------------------
 * When the page loads, the browser triggers "DOMContentLoaded" event.
 * This event calls 3 setup functions:
 *   1. initRiskChart()      → Draws the donut chart
 *   2. initAnimations()     → Animates progress bars and numbers
 *   3. initEventListeners() → Sets up button clicks and interactions
 * 
 * ============================================================================
 */


/* ============================================================================
   1. INITIALIZATION
   ============================================================================
   
   PURPOSE: This runs automatically when the HTML page finishes loading.
            It sets up everything the user sees and can interact with.
   
   WHEN IT RUNS: Automatically, as soon as the page loads
   
   WHAT IS DOMContentLoaded?
   -------------------------
   - "DOM" = Document Object Model (the HTML structure as a tree)
   - "ContentLoaded" = All HTML has been read and processed
   - This ensures we don't try to access elements that don't exist yet
   
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /**
   * This arrow function (=>) runs when the page is ready.
   * It calls 3 setup functions in order:
   */
  
  initRiskChart();      // Step 1: Draw the donut chart in right sidebar
  initAnimations();     // Step 2: Animate progress bars and score numbers
  initEventListeners(); // Step 3: Set up button clicks and interactions
});


/* ============================================================================
   2. RISK CHART (Donut Chart)
   ============================================================================
   
   PURPOSE: Draws the colored donut chart in the right sidebar.
            Shows risk distribution across security domains.
   
   USED IN: <canvas id="riskChart"> in index.html (line ~322)
   
   WHAT IS CANVAS?
   ---------------
   Canvas is an HTML element that lets you draw graphics with JavaScript.
   We use it here instead of an image so we can animate the chart.
   
   HOW THE DONUT CHART WORKS:
   --------------------------
   1. We define data (domain names, values, colors)
   2. Calculate angles for each slice based on values
   3. Draw filled arcs (pie slices) for each domain
   4. Draw a smaller circle on top to create the "hole"
   5. Add a shield icon in the center
   
   ============================================================================ */

function initRiskChart() {
  /**
   * STEP 1: Get the canvas element from the HTML
   * ---------------------------------------------
   * document.getElementById() finds an element by its id attribute.
   * Returns null if not found, so we check before continuing.
   */
  const canvas = document.getElementById('riskChart');
  if (!canvas) return;  // Exit if canvas doesn't exist
  
  /**
   * STEP 2: Get the 2D drawing context
   * -----------------------------------
   * The "context" is what we use to actually draw on the canvas.
   * It has methods like: arc(), fill(), stroke(), etc.
   */
  const ctx = canvas.getContext('2d');
  
  /**
   * STEP 3: Define chart dimensions
   * --------------------------------
   * centerX, centerY = The center point of the chart
   * radius           = How big the outer circle is
   * innerRadius      = How big the inner "hole" is (makes it a donut)
   */
  const centerX = canvas.width / 2;   // Horizontal center
  const centerY = canvas.height / 2;  // Vertical center
  const radius = 55;                   // Outer edge size
  const innerRadius = 35;              // Inner hole size (smaller = thicker ring)
  
  /**
   * STEP 4: Define the chart data
   * ------------------------------
   * Each object has:
   *   - label: The domain name (for reference)
   *   - value: A score from 0-100
   *   - color: Hex color code for this slice
   */
  const data = [
    { label: 'Access Control', value: 90, color: '#f59e0b' },   // Orange
    { label: 'Network Security', value: 75, color: '#06b6d4' }, // Cyan
    { label: 'Endpoint Security', value: 85, color: '#3b82f6' },// Blue
    { label: 'Data Protection', value: 80, color: '#10b981' },  // Green
    { label: 'Monitoring', value: 78, color: '#8b5cf6' }        // Purple
  ];
  
  /**
   * STEP 5: Calculate the total of all values
   * ------------------------------------------
   * We need this to figure out what percentage each slice takes.
   * reduce() adds up all the values: 90 + 75 + 85 + 80 + 78 = 408
   */
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  /**
   * STEP 6: Set starting angle
   * ---------------------------
   * In canvas, angles are measured in radians (not degrees).
   * -Math.PI / 2 = -90 degrees = starts at the top
   * Without this, the chart would start on the right side.
   */
  let startAngle = -Math.PI / 2;
  
  /**
   * STEP 7: Animation variables
   * ----------------------------
   * progress          = 0 to 1, how much of the animation is done
   * animationDuration = How long the animation takes (1000ms = 1 second)
   * startTime         = When the animation started (for calculating progress)
   */
  let progress = 0;
  const animationDuration = 1000;
  const startTime = performance.now();
  
  /**
   * STEP 8: The animation function
   * -------------------------------
   * This function is called 60 times per second by requestAnimationFrame.
   * Each call, it:
   *   1. Calculates how far along the animation is
   *   2. Clears the canvas
   *   3. Redraws the chart with the current progress
   * 
   * requestAnimationFrame is better than setInterval because:
   *   - It syncs with the screen's refresh rate (smooth animation)
   *   - It pauses when the tab is not visible (saves battery)
   */
  function animate(currentTime) {
    // Calculate progress: 0 at start, 1 when done
    progress = Math.min((currentTime - startTime) / animationDuration, 1);
    
    // Clear the canvas (erase previous frame)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Start drawing from the top
    let currentAngle = -Math.PI / 2;
    
    /**
     * Draw each pie slice
     * --------------------
     * For each data item, we:
     *   1. Calculate how much angle this slice should take
     *   2. Multiply by progress (0 to 1) for animation effect
     *   3. Draw the slice using arc()
     */
    data.forEach((item, index) => {
      // Calculate the angle size for this slice
      // (value / total) = percentage, * 2π = radians, * progress = animation
      const sliceAngle = (item.value / total) * 2 * Math.PI * progress;
      
      // Start a new path (shape)
      ctx.beginPath();
      
      // Move to center point
      ctx.moveTo(centerX, centerY);
      
      // Draw an arc from currentAngle to currentAngle + sliceAngle
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      
      // Close the path (draws a line back to center)
      ctx.closePath();
      
      // Set the color and fill the slice
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Move to the end of this slice for the next one
      currentAngle += sliceAngle;
    });
    
    /**
     * Draw the inner circle (creates the donut hole)
     * ------------------------------------------------
     * This draws a smaller circle on top in the background color,
     * which creates the "hole" in the donut.
     */
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a2234';  // Same as card background color
    ctx.fill();
    
    /**
     * Draw the shield icon in the center
     * ------------------------------------
     * This draws a small blue shield shape using moveTo(), lineTo(),
     * and quadraticCurveTo() for the curved bottom.
     */
    ctx.fillStyle = '#3b82f6';  // Blue color
    ctx.beginPath();
    // Start at top point of shield
    ctx.moveTo(centerX, centerY - 12);
    // Right side going down
    ctx.lineTo(centerX + 10, centerY - 6);
    ctx.lineTo(centerX + 10, centerY + 4);
    // Curved bottom right
    ctx.quadraticCurveTo(centerX, centerY + 14, centerX, centerY + 14);
    // Curved bottom left
    ctx.quadraticCurveTo(centerX, centerY + 14, centerX - 10, centerY + 4);
    // Left side going up
    ctx.lineTo(centerX - 10, centerY - 6);
    ctx.closePath();
    ctx.fill();
    
    /**
     * Draw the checkmark inside the shield
     * --------------------------------------
     * Uses stroke() to draw a line instead of fill().
     */
    ctx.strokeStyle = '#ffffff';  // White color
    ctx.lineWidth = 2;            // Line thickness
    ctx.beginPath();
    // Draw a checkmark shape
    ctx.moveTo(centerX - 4, centerY);       // Start point
    ctx.lineTo(centerX - 1, centerY + 3);   // Down to bottom of check
    ctx.lineTo(centerX + 5, centerY - 3);   // Up to top of check
    ctx.stroke();
    
    /**
     * Continue animation if not done
     * --------------------------------
     * If progress < 1, we're not done yet, so request another frame.
     */
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  // Start the animation
  requestAnimationFrame(animate);
}


/* ============================================================================
   3. ANIMATIONS
   ============================================================================
   
   PURPOSE: Adds smooth animations to various dashboard elements:
            - Domain progress bars (slide from 0% to actual value)
            - Security score number (counts up from 0 to 82)
            - Score circle (draws gradually)
   
   WHEN IT RUNS: Called once when page loads
   
   ============================================================================ */

function initAnimations() {
  
  /* ──────────────────────────────────────────────────────────────────────────
     DOMAIN PROGRESS BARS
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Animates the colored bars in each domain card
     
     USED IN: <span class="domain-fill" style="width: 90%"> in index.html
     
     HOW IT WORKS:
       1. Get all elements with class "domain-fill"
       2. Save their target width (e.g., "90%")
       3. Set width to "0%" immediately
       4. After a small delay, set back to target width
       5. CSS transition handles the smooth animation
     ────────────────────────────────────────────────────────────────────────── */
  
  const domainFills = document.querySelectorAll('.domain-fill');
  
  domainFills.forEach((fill, index) => {
    // Save the target width from the inline style
    const width = fill.style.width;
    
    // Reset to 0% (no visible width)
    fill.style.width = '0%';
    
    // After a delay, animate to the target width
    // Each card has a slightly longer delay (staggered animation)
    setTimeout(() => {
      fill.style.width = width;
    }, 100 + index * 50);  // 100ms, 150ms, 200ms, 250ms, etc.
  });
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     SCORE CIRCLE (SVG Animation)
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Animates the circular progress ring in left sidebar
     
     USED IN: <circle class="score-progress"> in index.html
     
     HOW SVG CIRCLE ANIMATION WORKS:
       - stroke-dasharray: Total length of the circle's stroke
       - stroke-dashoffset: How much of the stroke is hidden
       - To show 82%, we hide 18% of the circle
     
     MATH:
       - Circle circumference = 2 * π * r = 2 * 3.14 * 50 ≈ 314
       - 82% visible means offset = 314 * 0.18 = 56.5
     ────────────────────────────────────────────────────────────────────────── */
  
  const scoreProgress = document.querySelector('.score-progress');
  
  if (scoreProgress) {
    // 56.5 = final offset for 82% (calculated: 314 * 0.18)
    const finalOffset = 56.5;
    
    // Start with circle hidden (offset = 314 = full circumference)
    scoreProgress.style.strokeDashoffset = '314';
    
    // After 300ms, animate to final offset
    setTimeout(() => {
      scoreProgress.style.strokeDashoffset = finalOffset.toString();
    }, 300);
  }
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     SCORE NUMBER COUNTER
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Makes the "82" number count up from 0
     
     USED IN: <span class="score-number">82</span> in index.html
     ────────────────────────────────────────────────────────────────────────── */
  
  const scoreNumber = document.querySelector('.score-number');
  
  if (scoreNumber) {
    // Count from 0 to 82 over 1500ms (1.5 seconds)
    animateCounter(scoreNumber, 0, 82, 1500);
  }
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     SUMMARY VALUES (Optional enhancement)
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Could animate the summary numbers (35, 35, 82)
     
     NOTE: This code is partially implemented but not active.
           The original numbers are used instead.
     ────────────────────────────────────────────────────────────────────────── */
  
  const summaryValues = document.querySelectorAll('.summary-value');
  summaryValues.forEach(el => {
    const text = el.textContent;
    const match = text.match(/^(\d+)/);  // Extract the number at the start
    if (match) {
      const target = parseInt(match[1]);
      const span = document.createElement('span');
      span.className = 'counter';
      el.prepend(span);
      
      // Note: Animation not fully implemented here
      const remaining = el.innerHTML.replace(text, '');
    }
  });
}


/* ============================================================================
   COUNTER ANIMATION HELPER
   ============================================================================
   
   PURPOSE: Smoothly animates a number from one value to another.
            Used by initAnimations() to count up the score number.
   
   PARAMETERS:
     - element  : The HTML element to update (its textContent will change)
     - start    : Starting number (usually 0)
     - end      : Target number (e.g., 82)
     - duration : How long the animation takes in milliseconds
   
   EASING:
     Uses "ease out cubic" for natural deceleration.
     The number speeds up at first, then slows down as it approaches the target.
     This feels more natural than linear counting.
   
   ============================================================================ */

function animateCounter(element, start, end, duration) {
  // Record when animation started
  const startTime = performance.now();
  
  /**
   * UPDATE FUNCTION
   * ----------------
   * Called ~60 times per second by requestAnimationFrame.
   * Each call updates the number based on elapsed time.
   */
  function update(currentTime) {
    // Calculate elapsed time
    const elapsed = currentTime - startTime;
    
    // Calculate progress (0 to 1)
    const progress = Math.min(elapsed / duration, 1);
    
    /**
     * EASING: Ease Out Cubic
     * -----------------------
     * Formula: 1 - (1 - progress)³
     * 
     * This makes the animation:
     *   - Start fast
     *   - Slow down at the end
     * 
     * Example at different progress values:
     *   progress = 0.0 → easeOut = 0.00 (start)
     *   progress = 0.5 → easeOut = 0.88 (already 88% done!)
     *   progress = 1.0 → easeOut = 1.00 (end)
     */
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    // Calculate current display value
    const current = Math.round(start + (end - start) * easeOut);
    
    // Update the element's text
    element.textContent = current;
    
    // Continue animation if not done
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  // Start the animation
  requestAnimationFrame(update);
}


/* ============================================================================
   4. EVENT LISTENERS
   ============================================================================
   
   PURPOSE: Sets up what happens when users click buttons, links, etc.
   
   WHAT ARE EVENT LISTENERS?
   -------------------------
   In JavaScript, we can "listen" for events like:
     - 'click'      : User clicked on something
     - 'mouseenter' : Mouse moved over an element
     - 'mouseleave' : Mouse moved away from an element
     - 'change'     : User changed a form input value
   
   When the event happens, a function (called "handler") runs.
   
   ============================================================================ */

function initEventListeners() {
  
  /* ──────────────────────────────────────────────────────────────────────────
     THEME TOGGLE BUTTON
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Switches between dark and light theme
     
     USED IN: <button class="icon-btn theme-toggle"> in index.html
     
     HOW IT WORKS:
       - Toggles the 'light-theme' class on <body>
       - CSS can then show different colors for .light-theme
       - Currently only shows a toast (light theme CSS not implemented)
     ────────────────────────────────────────────────────────────────────────── */
  
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Toggle the class on/off
      document.body.classList.toggle('light-theme');
      
      // Show confirmation message
      showToast('Theme toggled');
    });
  }
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     GENERATE REPORT BUTTONS
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Simulates report generation with loading state
     
     USED IN: 
       - <button class="btn btn-primary generate-report-btn"> in header
       - <button class="btn btn-success full-report-btn"> in right sidebar
     
     HOW IT WORKS:
       1. User clicks button
       2. Button shows spinner and "Generating..." text
       3. Button is disabled (can't click again)
       4. After 1.5 seconds: Shows checkmark and "Report Ready!"
       5. After 2 more seconds: Resets button to original state
     ────────────────────────────────────────────────────────────────────────── */
  
  const reportBtns = document.querySelectorAll('.generate-report-btn, .full-report-btn');
  
  reportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /**
       * PHASE 1: Show loading state
       * ----------------------------
       * Replace button content with a spinner SVG.
       * The spinner rotates via CSS animation defined in showToast().
       */
      btn.innerHTML = '<svg class="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 70"/></svg> Generating...';
      btn.disabled = true;  // Prevent double-clicks
      
      /**
       * PHASE 2: After 1.5 seconds, show success
       */
      setTimeout(() => {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Report Ready!';
        showToast('Report generated successfully!');
        
        /**
         * PHASE 3: After 2 more seconds, reset to original
         */
        setTimeout(() => {
          btn.disabled = false;
          
          // Restore original button text (different for each button type)
          if (btn.classList.contains('full-report-btn')) {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg> Generate Full Report';
          } else {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg> Generate Report';
          }
        }, 2000);
      }, 1500);
    });
  });
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     DOWNLOAD BUTTONS (PDF, CSV, Email)
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Shows a toast when download buttons are clicked
     
     USED IN: <button class="download-btn pdf|csv|email"> in right sidebar
     
     NOTE: In a real application, these would trigger actual file downloads.
           This is just a visual demonstration.
     ────────────────────────────────────────────────────────────────────────── */
  
  const downloadBtns = document.querySelectorAll('.download-btn');
  
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Determine which format was clicked based on CSS class
      const format = btn.classList.contains('pdf') ? 'PDF' : 
                     btn.classList.contains('csv') ? 'CSV' : 'Email';
      
      // Show confirmation toast
      showToast(`Downloading ${format}...`);
    });
  });
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     NAVIGATION MENU
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Highlights the clicked navigation item
     
     USED IN: <a class="nav-item"> in left sidebar
     
     HOW IT WORKS:
       1. Remove 'active' class from all nav items
       2. Add 'active' class to clicked item
       3. CSS styles the active item with blue highlight
     
     NOTE: e.preventDefault() stops the link from navigating away.
           In a real app, you might load different content instead.
     ────────────────────────────────────────────────────────────────────────── */
  
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();  // Don't follow the link
      
      // Remove active class from all items
      navItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
    });
  });
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     PRIORITY FILTER (Recommendations)
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Filters recommendations by priority level
     
     USED IN: <select class="priority-filter"> in right sidebar
     
     HOW IT WORKS:
       1. User selects "High", "Medium", or "Low" from dropdown
       2. Loop through all recommendation items
       3. Check if item's priority badge matches the filter
       4. Show matching items, hide non-matching items
     ────────────────────────────────────────────────────────────────────────── */
  
  const priorityFilter = document.querySelector('.priority-filter');
  
  if (priorityFilter) {
    priorityFilter.addEventListener('change', (e) => {
      // Get selected value (e.g., "high", "medium", "low")
      const value = e.target.value.toLowerCase();
      
      // Get all recommendation items
      const items = document.querySelectorAll('.recommendation-item');
      
      items.forEach(item => {
        // Find the priority badge in this item
        const badge = item.querySelector('.priority-badge');
        
        // Show if "All" selected OR badge matches filter
        if (value === 'priority' || badge.classList.contains(value)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     DOMAIN CARD HOVER EFFECTS
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Adds a subtle lift effect when hovering over domain cards
     
     USED IN: <div class="domain-card"> in main content area
     
     HOW IT WORKS:
       - mouseenter: When mouse moves over card, lift it up
       - mouseleave: When mouse leaves card, return to normal
     
     NOTE: This enhances basic CSS hover that's already in styles.css
     ────────────────────────────────────────────────────────────────────────── */
  
  const domainCards = document.querySelectorAll('.domain-card');
  
  domainCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Lift up and scale slightly
      card.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      // Return to original position
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  
  /* ──────────────────────────────────────────────────────────────────────────
     NOTIFICATION BUTTON
     ──────────────────────────────────────────────────────────────────────────
     
     PURPOSE: Shows notification count when clicked
     
     USED IN: <button class="icon-btn notifications"> in header
     
     NOTE: In a real app, this might open a notification dropdown.
     ────────────────────────────────────────────────────────────────────────── */
  
  const notificationBtn = document.querySelector('.notifications');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      showToast('3 new notifications');
    });
  }
}


/* ============================================================================
   5. TOAST NOTIFICATIONS
   ============================================================================
   
   PURPOSE: Shows temporary popup messages at the bottom of the screen.
            Used to confirm actions like "Report generated successfully!"
   
   WHAT IS A TOAST?
   ----------------
   A toast is a small message that appears briefly then disappears.
   Named after toast popping up from a toaster!
   
   HOW THIS FUNCTION WORKS:
   ------------------------
   1. Remove any existing toast (so they don't stack)
   2. Create a new <div> element with the message
   3. Style it with inline CSS
   4. Add animation CSS if not already present
   5. Append to body
   6. After 3 seconds, animate out and remove
   
   ============================================================================ */

function showToast(message) {
  /**
   * STEP 1: Remove existing toast
   * ------------------------------
   * Only one toast should be visible at a time.
   */
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  /**
   * STEP 2: Create the toast element
   * ----------------------------------
   * document.createElement() creates a new HTML element.
   */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  /**
   * STEP 3: Apply styles
   * ---------------------
   * We use inline styles here so the toast works without CSS file changes.
   * cssText lets us set multiple CSS properties at once.
   */
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a2234;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideUp 0.3s ease;
    border: 1px solid #3b82f6;
  `;
  
  /**
   * STEP 4: Add animation CSS (once)
   * ----------------------------------
   * We dynamically add @keyframes rules for the slide animation.
   * The #toast-styles check ensures we only add this once.
   */
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      /* Slide up animation for toast appearing */
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
      }
      
      /* Slide down animation for toast disappearing */
      @keyframes slideDown {
        from { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }
        to { 
          opacity: 0; 
          transform: translateX(-50%) translateY(20px); 
        }
      }
      
      /* Spinner rotation for loading buttons */
      .spinner {
        animation: spin 1s linear infinite;
        width: 18px;
        height: 18px;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * STEP 5: Add toast to the page
   */
  document.body.appendChild(toast);
  
  /**
   * STEP 6: Auto-remove after 3 seconds
   * -------------------------------------
   * Start the slideDown animation, then remove the element.
   */
  setTimeout(() => {
    // Apply exit animation
    toast.style.animation = 'slideDown 0.3s ease forwards';
    
    // Remove from DOM after animation completes (300ms)
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* ============================================================================
   6. API INTEGRATION (Optional)
   ============================================================================
   
   PURPOSE: Fetches dashboard data from the server's API endpoint.
            This allows the dashboard to show real data instead of hardcoded values.
   
   CURRENTLY: Not actively used - data is hardcoded in HTML.
              This function is ready for future enhancement.
   
   HOW TO USE:
   -----------
   const data = await fetchDashboardData();
   if (data) {
     // Use data.totalQuestions, data.security_score, etc.
   }
   
   API ENDPOINT: GET /api/dashboard (defined in server.js)
   
   WHAT IS async/await?
   --------------------
   - async: Tells JavaScript this function does something that takes time
   - await: Waits for the operation to complete before continuing
   - This makes asynchronous code look like regular synchronous code
   
   ============================================================================ */

async function fetchDashboardData() {
  try {
    /**
     * STEP 1: Make the request
     * -------------------------
     * fetch() sends an HTTP request to the server.
     * await pauses until the response comes back.
     */
    const response = await fetch('/api/dashboard');
    
    /**
     * STEP 2: Parse the JSON
     * -----------------------
     * The server sends JSON text, we need to convert it to a JavaScript object.
     */
    const data = await response.json();
    
    /**
     * STEP 3: Return the data
     */
    return data;
    
  } catch (error) {
    /**
     * ERROR HANDLING
     * ---------------
     * If the request fails (server down, network error, etc.),
     * log the error and return null so the caller knows it failed.
     */
    console.error('Failed to fetch dashboard data:', error);
    return null;
  }
}


/* ============================================================================
   END OF FILE
   ============================================================================
   
   SUMMARY:
   --------
   This file contains all the interactive JavaScript for the dashboard:
   
   1. INITIALIZATION
      - Runs when page loads
      - Sets up everything
   
   2. RISK CHART
      - Draws animated donut chart using Canvas API
      - Shows risk distribution by security domain
   
   3. ANIMATIONS
      - Progress bars slide in
      - Score number counts up
      - Circle fills gradually
   
   4. EVENT LISTENERS
      - Navigation clicks
      - Button interactions
      - Filter changes
      - Hover effects
   
   5. TOAST NOTIFICATIONS
      - Temporary popup messages
      - Confirms user actions
   
   6. API INTEGRATION
      - Ready for real data
      - Currently uses hardcoded HTML values
   
   FILE CONNECTIONS:
   -----------------
   - index.html : Uses the classes and IDs this file targets
   - styles.css : Provides visual styling, some animations
   - server.js  : Provides /api/dashboard endpoint for fetchDashboardData()
   
   ============================================================================ */
