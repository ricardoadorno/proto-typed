const login = `
component LoginForm:
  ___: Username{Enter your username}
  ___password: Password{Enter your password}
  
  stack:
    [X] Remember me
    @primary[Login]
    #[Forgot Password](ForgotPassword)

screen Login:
  # Login to Your Account
  > Please enter your credentials to access your account.
  card:
    ## Welcome Back
    > Enter your login information below to access your account.
    $LoginForm
    > Don't have an account?
    #[Signup](Signup)

screen Signup:
  # Create a New Account
  > Join us today! Fill out the form below to create your account.
  card:
    ___: Username{Choose a username}
    ___email: Email{Your email address}
    ___password: Password{Create a password}
    ___password: Confirm Password{Confirm your password}
    
    @primary[Sign Up]
    #[Login](Login)

screen ForgotPassword:
  # Reset Your Password
  > Please enter your email address to reset your password.
  
  card:
    # Password Recovery
    > Enter your email address below to receive a password reset link.
    ___email: Email{Your registered email address}
    @primary[Send Reset Link]
    @link[Back to Login](-1)
`


export default login;