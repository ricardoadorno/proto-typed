const login = `
@screen Login:
  # Login to Your Account
    text Please enter your credentials to access your account.

  card
    ## Welcome Back
      text Enter your login information below to access your account.

    input type="text" placeholder="Username"
    input type="password" placeholder="Password"
    [X] Remember me
    
    button "Login"
    row
      link ["ForgotPassword"] Forgot your password?
    text Don't have an account?
    link ["Signup"] Sign up here

@screen Signup:
  # Create a New Account
    text Join us today! Fill out the form below to create your account.

  card
    input type="text" placeholder="Username"
    input type="email" placeholder="Email Address"
    input type="password" placeholder="Password"
    input type="password" placeholder="Confirm Password"
    
    button "Sign Up"
    link ["Login"] Already have an account? Log in here 

@screen ForgotPassword:
  # Reset Your Password
    text Please enter your email address to reset your password.
  
  card
    # Password Recovery
    text Enter your email address below to receive a password reset link.
    input type="email" placeholder="Email Address"
    button "Send Reset Link"
    link ["Login"] Back to Login
`


export default login;