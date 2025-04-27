const login = `
@screen Login:
  # Login to Your Account
  text Please enter your credentials to access your account.

  card
    
      # Welcome Back
    
    
      text Enter your login information below to access your account.
    
    
      input type="text" placeholder="Username"
    
    
      input type="password" placeholder="Password"
    
    
        [X] Remember me
    
    
    button "Login"

    link ["ForgotPassword"] Forgot your password?
    text Don't have an account?
    link ["#signup"] Sign up here
      
@screen SignupSuccess:
  # Registration Complete
  text Thank you for registering! Please check your email to confirm your account.
  
  card
    
      # Welcome Aboard!
    
      text Your account has been created successfully.
      text Please check your inbox for a confirmation email to activate your account.
    
      button "Return to Login"  

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