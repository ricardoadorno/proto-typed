const login = `
@screen Login:
  # Login to Your Account
  > Please enter your credentials to access your account.
  card:
    ## Welcome Back
    > Enter your login information below to access your account.
    __ type="text" placeholder="Username"
    __ type="password" placeholder="Password"
    
    [X] Remember me
    
    @[Login]
    row:
      #[Forgot Password](ForgotPassword)
    > Don't have an account?
    #[Signup](Signup)

@screen Signup:
  # Create a New Account
  > Join us today! Fill out the form below to create your account.
  card:
    __ type="text" placeholder="Username"
    __ type="email" placeholder="Email Address"
    __ type="password" placeholder="Password"
    __ type="password" placeholder="Confirm Password"
    
    @[Sign Up]
    #[Login](Login)

@screen ForgotPassword:
  # Reset Your Password
  > Please enter your email address to reset your password.
  
  card:
    # Password Recovery
    > Enter your email address below to receive a password reset link.
    __ type="email" placeholder="Email Address"
    @[Send Reset Link]
    #[Back to Login](Login)
`


export default login;