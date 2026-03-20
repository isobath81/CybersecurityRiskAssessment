/**
 * ============================================================================
 * SAFESTART SECURITY DASHBOARD - SERVER
 * ============================================================================
 * 
 * This is the main backend server file for the SafeStart Security Dashboard.
 * It uses Express.js to create a web server that:
 *   1. Serves static files (HTML, CSS, JavaScript)
 *   2. Provides a REST API endpoint for dashboard data
 * 
 * HOW IT WORKS:
 * - When a user visits http://localhost:3000, they get the dashboard webpage
 * - The webpage can call /api/dashboard to get data (currently returns mock data)
 * 
 * ============================================================================
 */

// ============================================================================
// STEP 1: IMPORT REQUIRED MODULES
// ============================================================================

/**
 * Express.js - A minimal web framework for Node.js
 * This is the main library that creates our web server.
 * Documentation: https://expressjs.com/
 */
const express = require('express');

/**
 * Path - Built-in Node.js module for handling file paths
 * Helps us locate files in a cross-platform way (Windows/Mac/Linux)
 */
const path = require('path');

// ============================================================================
// STEP 2: CREATE AND CONFIGURE THE SERVER
// ============================================================================

/**
 * Create an Express application instance
 * This 'app' object is our web server - we add routes and middleware to it
 */
const app = express();

/**
 * Define which port the server will listen on
 * - process.env.PORT: Uses environment variable if set (for production/cloud hosting)
 * - 3000: Default port for local development
 */
const PORT = process.env.PORT || 3000;

// ============================================================================
// STEP 3: CONFIGURE MIDDLEWARE
// ============================================================================

/**
 * MIDDLEWARE: Static File Server
 * 
 * This tells Express to serve all files in the 'public' folder automatically.
 * When someone requests a file like /css/styles.css, Express will look for it
 * at: ./public/css/styles.css
 * 
 * __dirname = The directory where this server.js file is located
 * path.join() = Safely combines folder paths (handles / vs \ for different OS)
 */
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// STEP 4: DEFINE API ROUTES
// ============================================================================

/**
 * API ENDPOINT: GET /api/dashboard
 * 
 * PURPOSE: Returns all the data needed to display the security dashboard
 * 
 * HOW TO ACCESS: 
 *   - From browser: http://localhost:3000/api/dashboard
 *   - From JavaScript: fetch('/api/dashboard')
 * 
 * RETURNS: JSON object containing:
 *   - user: Current user information
 *   - assessment: Overall assessment results
 *   - domainPerformance: Scores for each security domain
 *   - riskBreakdown: Data for the risk chart
 *   - actionPlan: Tasks to improve security
 *   - recentActivity: Recent user actions
 *   - recommendations: Priority-sorted security recommendations
 * 
 * NOTE: Currently returns mock/sample data. In production, this would
 * fetch data from a database based on the logged-in user.
 */
app.get('/api/dashboard', (req, res) => {
  
  // res.json() sends a JSON response back to the client
  res.json({
    
    // ========================================================================
    // USER INFORMATION
    // ========================================================================
    /**
     * User object - Information about the currently logged-in user
     * In production: Would come from authentication/session
     */
    user: {
      name: 'Issa Bathily',    // Display name shown in the header
      avatar: null             // Profile picture URL (null = use default icon)
    },
    
    // ========================================================================
    // ASSESSMENT SUMMARY
    // ========================================================================
    /**
     * Assessment object - Overall results of the security questionnaire
     * These values populate the summary cards at the top of the dashboard
     */
    assessment: {
      totalQuestions: 35,              // Total questions in the assessment
      completed: 35,                   // How many the user answered
      score: 82,                       // Overall security score (0-100)
      maxScore: 100,                   // Maximum possible score
      riskLevel: 'Low Risk',           // Calculated risk level
      lastAssessment: 'Today, 10:45 AM' // When the assessment was completed
    },
    
    // ========================================================================
    // DOMAIN PERFORMANCE
    // ========================================================================
    /**
     * Domain Performance array - Individual scores for each security area
     * Each domain represents a category of security controls
     * 
     * Colors use hex codes:
     *   #10b981 = Green (good)
     *   #3b82f6 = Blue
     *   #06b6d4 = Cyan
     *   #8b5cf6 = Purple
     *   #f59e0b = Orange (needs attention)
     */
    domainPerformance: [
      { name: 'Access Control', score: 90, color: '#10b981' },      // Authentication, passwords, MFA
      { name: 'Network Security', score: 75, color: '#3b82f6' },    // Firewalls, VPN, segmentation
      { name: 'Endpoint Security', score: 85, color: '#06b6d4' },   // Antivirus, device protection
      { name: 'Incident Response', score: 80, color: '#8b5cf6' },   // Breach handling procedures
      { name: 'Data Protection', score: 80, color: '#10b981' },     // Encryption, backups
      { name: 'Awareness', score: 75, color: '#3b82f6' },           // Employee training
      { name: 'Monitoring', score: 78, color: '#06b6d4' },          // SIEM, log analysis
      { name: 'Vulnerability Mgmt', score: 72, color: '#f59e0b' }   // Patching, scanning
    ],
    
    // ========================================================================
    // RISK BREAKDOWN (for donut chart)
    // ========================================================================
    /**
     * Risk Breakdown array - Data for the donut chart in the right sidebar
     * These are the top 5 domains shown in the visual chart
     */
    riskBreakdown: [
      { name: 'Access Control', percentage: 90, color: '#f59e0b' },
      { name: 'Network Security', percentage: 75, color: '#06b6d4' },
      { name: 'Endpoint Security', percentage: 85, color: '#3b82f6' },
      { name: 'Data Protection', percentage: 80, color: '#10b981' },
      { name: 'Monitoring', percentage: 78, color: '#8b5cf6' }
    ],
    
    // ========================================================================
    // ACTION PLAN
    // ========================================================================
    /**
     * Action Plan array - Tasks the user should complete to improve security
     * 
     * Status values:
     *   'completed'  = Task is done (green checkmark)
     *   'pending'    = Task needs urgent attention (red dot)
     *   'scheduled'  = Task is planned for later (orange dot)
     */
    actionPlan: [
      { task: 'Enable MFA for all users', due: 'This Week', status: 'completed' },
      { task: 'Update firewall rules', due: '2 Weeks', status: 'pending' },
      { task: 'Review access logs', due: '1 Month', status: 'scheduled' }
    ],
    
    // ========================================================================
    // RECENT ACTIVITY
    // ========================================================================
    /**
     * Recent Activity array - Timeline of recent security-related events
     * Shown in the activity feed on the dashboard
     */
    recentActivity: [
      { action: 'Assessment Completed', time: '10:45 AM', icon: 'check' },
      { action: 'Risk Score Updated', time: '10:46 AM', icon: 'chart' },
      { action: 'Report Generated', time: '11:10 AM', icon: 'document' },
      { action: 'Recommendations Sent', time: '11:15 AM', icon: 'send' }
    ],
    
    // ========================================================================
    // RECOMMENDATIONS
    // ========================================================================
    /**
     * Recommendations array - Actionable security improvements
     * Sorted by priority and displayed in the right sidebar
     * 
     * Priority levels:
     *   'High'   = Critical, do immediately (red badge)
     *   'Medium' = Important, schedule soon (orange badge)
     *   'Low'    = Nice to have (gray badge)
     */
    recommendations: [
      { title: 'Enable Multi-Factor Authentication', priority: 'High' },
      { title: 'Implement SIEM Monitoring', priority: 'High' },
      { title: 'Conduct Phishing Awareness Training', priority: 'Medium' },
      { title: 'Regular Backup Testing', priority: 'Medium' },
      { title: 'Patch Devices Monthly', priority: 'Low' }
    ]
  });
});

// ============================================================================
// STEP 5: DEFINE PAGE ROUTES
// ============================================================================

/**
 * ROUTE: GET /
 * 
 * PURPOSE: Serves the main dashboard HTML page
 * This is the entry point - when users visit http://localhost:3000
 * 
 * res.sendFile() sends the index.html file to the browser
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================================
// STEP 6: START THE SERVER
// ============================================================================

/**
 * app.listen() starts the server and begins accepting connections
 * 
 * Parameters:
 *   - PORT: Which port to listen on (default: 3000)
 *   - Callback function: Runs once the server is ready
 * 
 * After this runs, the server is accessible at:
 *   http://localhost:3000
 */
app.listen(PORT, () => {
  console.log(`SafeStart Security Dashboard running at http://localhost:${PORT}`);
});

// ============================================================================
// END OF SERVER.JS
// ============================================================================
/**
 * SUMMARY OF WHAT THIS FILE DOES:
 * 
 * 1. Creates an Express web server
 * 2. Serves static files from the /public folder (HTML, CSS, JS)
 * 3. Provides /api/dashboard endpoint that returns JSON data
 * 4. Listens on port 3000 (or custom PORT environment variable)
 * 
 * TO RUN THIS SERVER:
 *   npm install    (first time only - installs Express)
 *   npm start      (starts the server)
 * 
 * TO TEST THE API:
 *   Open browser: http://localhost:3000/api/dashboard
 *   You should see the JSON data displayed
 */
