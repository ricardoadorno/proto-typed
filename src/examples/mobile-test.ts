export const mobileTest = `
screen TestMobile:
  header:
    # Mobile Test
    @primary[Settings](TestMobile)

  # Mobile Components Test
  > Testing header, FAB, and bottom nav rendering
  
  card:
    ## Test Content
    > This screen should have:
    > Header at the top (sticky)
    > FAB in bottom right corner
    > Bottom nav at the bottom (sticky)
    
    @primary[Test Button](TestMobile)
  fab{+}(TestMobile)
  navigator:
    - Home | 🏠 | TestMobile
    - Search | 🔍 | TestMobile
    - Messages | 💬 | TestMobile
    - Profile | 👤 | TestMobile
`;
