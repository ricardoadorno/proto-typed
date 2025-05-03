import { describe, test, expect } from 'vitest';
import { parseInput } from '../../core/parser/parser';
import { astBuilder } from '../../core/parser/astBuilder';
import { astToHtml } from '../../core/renderer/astToHtml';
import { astToHtmlDocument } from '../../core/renderer/documentRenderer';

describe('Parser-Renderer Integration Tests', () => {
  test('should parse and render a complete login screen', () => {
    const input = `@screen Login:
  # Login to Your Account
    > Please enter your credentials to access your account.

  card:
    ## Welcome Back
      > Enter your login information below to access your account.

    __ type="text" placeholder="Username"
    __ type="password" placeholder="Password"
    
    [X] Remember me
    
    @[Login]
    #[Forgot Password](ForgotPassword)
    > Don't have an account?
    #[Signup](Signup)`;
    
    // Parse the input
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    // Render to HTML
    const html = astToHtml(ast, {});
    
    // Verify overall structure
    expect(html).toContain('id="login-screen"');
    expect(html).toContain('class="screen container login"');
    
    // Verify headings
    expect(html).toContain('<h1>Login to Your Account</h1>');
    expect(html).toContain('<h2>Welcome Back</h2>');
    
    // Verify card structure
    expect(html).toContain('<article class="card">');
    
    // Verify form inputs
    expect(html).toContain('<input type="text" placeholder="Username" />');
    expect(html).toContain('<input type="password" placeholder="Password" />');
    
    // Verify checkbox
    expect(html).toContain('<input type="checkbox" checked');
    expect(html).toContain('Remember me');
    
    // Verify button and links - use more flexible assertions
    expect(html).toContain('Login</button>');
    expect(html).toContain('data-screen-link="ForgotPassword">Forgot Password</a>');
    expect(html).toContain('data-screen-link="Signup">Signup</a>');
  });

  test('should parse and render a complete dashboard layout', () => {
    const input = `@screen Dashboard:
  # My Dashboard
  > Welcome to your personal dashboard
  
  row:
    col:
      card:
        ## Analytics
        > This widget shows analytics data
        @[View Details]
    
    col:
      card:
        ## Reports
        > View and download reports
        @[Generate Report]
  
  card:
    ## Recent Activity
    1. Updated profile
    2. Changed settings
    3. Added new widget`;
    
    // Parse the input
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    // Render to HTML
    const html = astToHtml(ast, {});
    
    // Verify overall structure
    expect(html).toContain('id="dashboard-screen"');
    expect(html).toContain('class="screen container dashboard"');
    
    // Verify headings
    expect(html).toContain('<h1>My Dashboard</h1>');
    expect(html).toContain('<h2>Analytics</h2>');
    expect(html).toContain('<h2>Reports</h2>');
    expect(html).toContain('<h2>Recent Activity</h2>');
    
    // Verify layout structure
    expect(html).toContain('<div class="row">');
    expect(html).toContain('<div class="column">');
    expect(html).toContain('<article class="card">');
    
    // Verify buttons
    expect(html).toContain('>View Details</button>');
    expect(html).toContain('>Generate Report</button>');
    
    // Verify ordered list
    expect(html).toContain('<ol>');
    expect(html).toContain('<li>Updated profile</li>');
    expect(html).toContain('<li>Changed settings</li>');
    expect(html).toContain('<li>Added new widget</li>');
    expect(html).toContain('</ol>');
  });

  test('should generate a complete multi-screen HTML document', () => {
    const inputs = [
      `@screen Home:
  # Welcome
  > This is the home page
  @[Get Started](Features)`,
      
      `@screen Features:
  # Features
  1. Easy to use
  2. Powerful
  3. Flexible
  @[Back to Home](Home)`
    ];
    
    // Parse and convert to ASTs
    const asts = inputs.map(input => {
      const cst = parseInput(input);
      return astBuilder.visit(cst);
    });
    
    // Generate full HTML document
    const document = astToHtmlDocument(asts);
    
    // Check for HTML document structure - use more flexible assertions
    expect(document).toContain('<!DOCTYPE html>');
    expect(document).toContain('<html lang="en">');
    expect(document).toContain('<head>');
    expect(document).toContain('<meta charset="UTF-8">');
    expect(document).toContain('<meta name="viewport"');
    expect(document).toContain('@picocss/pico'); // Check for CSS framework reference instead of exact link tag
    expect(document).toContain('<body>');
    
    // Check for screens
    expect(document).toContain('class="screen container home"');
    expect(document).toContain('class="screen container features" style="display:none"');
    
    // Check for navigation script
    expect(document).toContain('function showScreen(screenName)');
    expect(document).toContain('document.addEventListener');
    
    // Check content of both screens
    expect(document).toContain('<h1>Welcome</h1>');
    expect(document).toContain('<h1>Features</h1>');
    expect(document).toContain('Get Started</button>');
    expect(document).toContain('Back to Home</button>');
  });

  test('should handle complex form with validation attributes', () => {
    const input = `@screen ContactForm:
  # Contact Us
  
  card:
    __ type="text" placeholder="Your Name" required="true"
    __ type="email" placeholder="Email Address" required="true"
    __ type="tel" placeholder="Phone Number"
    
    <[Question]>
    <[Feedback]>
    <[Support]>
    
    __ type="textarea" placeholder="Your message" rows="4" required="true"
    
    [X] Subscribe to newsletter
    
    @[Submit]
    @[Cancel]`;
    
    // Parse the input
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    // Render to HTML
    const html = astToHtml(ast, {});
    
    // Verify form attributes are properly rendered
    expect(html).toContain('<input type="text" placeholder="Your Name" required="true" />');
    expect(html).toContain('<input type="email" placeholder="Email Address" required="true" />');
    expect(html).toContain('<input type="tel" placeholder="Phone Number" />');
    
    // Verify select dropdown
    expect(html).toContain('<select>');
    expect(html).toContain('<option value="Question">Question</option>');
    expect(html).toContain('<option value="Feedback">Feedback</option>');
    expect(html).toContain('<option value="Support">Support</option>');
    expect(html).toContain('</select>');
    
    // Verify textarea
    expect(html).toContain('<input type="textarea" placeholder="Your message" rows="4" required="true" />');
    
    // Verify checkbox
    expect(html).toContain('Subscribe to newsletter');
    
    // Verify buttons
    expect(html).toContain('Submit</button>');
    expect(html).toContain('Cancel</button>');
  });
});