const login = `
component LoginForm:
  ___: Username{Enter your username}
  ___password: Password{Enter your password}
  
  stack:
    [X] Remember me
    @primary[Login]
    #[Forgot Password](ForgotPassword)

screen Login:
  container:
    # Login to Your Account
    > Please enter your credentials to access your account.
    card:
      ## Welcome Back
      > Enter your login information below to access your account.
      $LoginForm
      > Don't have an account?
      #[Signup](Signup)

screen Signup:
  container:
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
  container:
    # Reset Your Password
    > Please enter your email address to reset your password.
    
    card:
      # Password Recovery
      > Enter your email address below to receive a password reset link.
      ___email: Email{Your registered email address}
      @primary[Send Reset Link]
      @link[Back to Login](-1)
`

export default login
