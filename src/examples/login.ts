const login = `
@screen Login:
  # Login to Your Account
  > Please enter your credentials to access your account.
  card:
    ## Welcome Back
    > Enter your login information below to access your account.
    ___:Username(Enter your username)[text]
    ___*:Password(Enter your password)[password]
    
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
    ___:Username(Choose a username)[text]
    ___*:Email(Your email address)[email]
    ___*:Password(Create a password)[password]
    ___*:Confirm Password(Confirm your password)[password]
    
    @[Sign Up]
    #[Login](Login)

@screen ForgotPassword:
  # Reset Your Password
  > Please enter your email address to reset your password.
  
  card:
    # Password Recovery
    > Enter your email address below to receive a password reset link.
    ___*:Email(Your registered email address)[email]
    @[Send Reset Link]
    #[Back to Login](Login)
`


export default login;