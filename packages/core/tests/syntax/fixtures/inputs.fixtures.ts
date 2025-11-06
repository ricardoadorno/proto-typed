/**
 * Inputs Domain - DSL Fixtures
 *
 * Collection of DSL examples for input form elements testing.
 * Each fixture includes the DSL string for parsing and rendering.
 */

export const inputsFixtures = {
  textInputs: {
    basic: `screen Test:
  ___[Name][Enter your name]`,

    email: `screen Test:
  ___email[Email][your@email.com]`,

    password: `screen Test:
  ___password[Password][Enter password]`,

    number: `screen Test:
  ___number[Age][Enter your age]`,

    date: `screen Test:
  ___date[Birthday][Select date]`,

    url: `screen Test:
  ___[Website][https://example.com]`,

    tel: `screen Test:
  ___[Phone][+1234567890]`,

    textarea: `screen Test:
  ___textarea[Message][Your message here]`,

    multiple: `screen Test:
  stack:
    ___[Username][Enter username]
    ___email[Email][your@email.com]
    ___password[Password][********]
    ___textarea[Bio][Tell us about yourself]`,
  },

  checkboxes: {
    unchecked: `screen Test:
  [ ] Accept terms`,

    checked: `screen Test:
  [X] Remember me`,

    checkedLowercase: `screen Test:
  [x] Subscribe`,

    multiple: `screen Test:
  stack-tight:
    [X] Email notifications
    [ ] SMS notifications
    [X] Push notifications
    [ ] Newsletter`,

    inForm: `screen Test:
  card:
    # Preferences
    stack-tight:
      [X] Dark mode
      [ ] Auto-save
      [X] Show tooltips
    @[Save](save)`,
  },

  radioButtons: {
    single: `screen Test:
  ( ) Option One`,

    selected: `screen Test:
  (X) Selected Option`,

    group: `screen Test:
  ( ) Option A
  (X) Option B
  ( ) Option C`,

    labeled: `screen Test:
  # Choose a plan
  stack-tight:
    (X) Free - $0/month
    ( ) Pro - $10/month
    ( ) Enterprise - $50/month`,

    multiple: `screen Test:
  stack:
    # Payment Method
    stack-tight:
      (X) Credit Card
      ( ) PayPal
      ( ) Bank Transfer
    # Billing Cycle
    stack-tight:
      (X) Monthly
      ( ) Yearly`,
  },

  selects: {
    basic: `screen Test:
  ___[Country][][[USA][Canada][Mexico]]`,

    noLabel: `screen Test:
  ___[][][[Red][Green][Blue]]`,

    multiple: `screen Test:
  stack:
    ___[Country][][[USA][Canada][Mexico]]
    ___[State][][[CA][NY][TX]]
    ___[City][][[San Francisco][New York][Austin]]`,

    inForm: `screen Test:
  card:
    # Shipping Information
    stack:
      ___[Name][Your name]
      ___[Country][][[USA][Canada][Mexico]]
      ___textarea[Address][Full address]
      @[Submit](submit)`,
  },

  forms: {
    login: `screen Login:
  card:
    # Login
    stack:
      ___email[Email][your@email.com]
      ___password[Password][Enter password]
      [X] Remember me
      row:
        @secondary[Cancel](cancel)
        @[Login](login)`,

    register: `screen Register:
  container-narrow:
    card:
      # Create Account
      stack:
        ___[Full Name][John Doe]
        ___email[Email][you@example.com]
        ___password[Password][********]
        ___password[Confirm Password][********]
        ---
        # Preferences
        stack-tight:
          [X] Email notifications
          [ ] Newsletter
        ---
        > By registering, you agree to our terms
        @[Create Account](register)`,

    profile: `screen Profile:
  container:
    # Edit Profile
    stack:
      row:
        !circle-64x64[Avatar](avatar.jpg)
        @secondary[Change Photo](upload)
      ___[Username][johndoe]
      ___email[Email][john@example.com]
      ___textarea[Bio][Tell us about yourself]
      ---
      # Settings
      stack-tight:
        [X] Public profile
        [X] Show email
        [ ] Show location
      ---
      row-between:
        @destructive[Delete Account](delete)
        row:
          @secondary[Cancel](cancel)
          @[Save Changes](save)`,

    complex: `screen Survey:
  card:
    # Survey
    stack:
      ## Personal Information
      ___[Name][Your name]
      ___number[Age][25]
      ___[Country][][[USA][Canada][UK][Other]]

      ## Preferences
      # Favorite Color
      stack-tight:
        (X) Blue
        ( ) Red
        ( ) Green

      # Features You Want
      stack-tight:
        [X] Dark mode
        [X] Mobile app
        [ ] Desktop app
        [ ] API access

      ___textarea[Comments][Any additional feedback]

      row-between:
        @secondary[Clear](clear)
        @[Submit Survey](submit)`,
  },

  mixed: {
    simple: `screen Test:
  ___[Name][Enter name]
  [ ] Agree
  ( ) Option A
  ___[][][[Choice 1][Choice 2]]`,

    realistic: `screen Settings:
  container:
    # Account Settings
    stack:
      card:
        ## Profile
        stack:
          ___[Display Name][Your name]
          ___email[Email][you@example.com]
          ___[Phone][+1234567890]

      card:
        ## Notifications
        stack-tight:
          [X] Email notifications
          [ ] Push notifications
          [X] Weekly digest

      card:
        ## Privacy
        stack-tight:
          # Profile Visibility
          stack-tight:
            (X) Public
            ( ) Friends only
            ( ) Private

          ___[Theme][][[Auto][Light][Dark]]

      row-between:
        @destructive[Logout](logout)
        @[Save Settings](save)`,
  },
}
