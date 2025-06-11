export const mobileTest = `
screen TestMobile:
  header:
    # Mobile Test
    @[Settings](TestMobile)

  # Mobile Components Test
  > Testing header, FAB, and bottom nav rendering
  
  card:
    ## Test Content
    > This screen should have:
    > • Header at the top (sticky)
    > • FAB in bottom right corner
    > • Bottom nav at the bottom (sticky)
    
    @[Test Button](TestMobile)
  fab {+} TestMobile

  bottom_nav:
    nav_item [Home]{🏠}(TestMobile)
    nav_item [Search]{🔍}(TestMobile)
    nav_item [Messages]{💬}(TestMobile)
    nav_item [Profile]{👤}(TestMobile)
`;
