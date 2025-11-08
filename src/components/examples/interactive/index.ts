import { ExampleCategory } from '../types';

/**
 * Interactive component examples including buttons, links, and images with various variants
 */
export const interactiveExamples: ExampleCategory = {
  title: "Interactive Elements",
  examples: [
    {
      name: "Button Variants",
      code: `screen ButtonVariantsExample:
  # Standard Buttons
  @[Primary Button](action)
  @[Default Button]
  
  # Button Variants
  @+[Outline Button](outline-action)
  @-[Secondary Button](secondary-action)
  @_[Ghost Button](ghost-action)
  @=[Destructive Button](delete-action)
  @![Warning Button](warning-action)
  
  # Buttons with Icons
  @[Save]{💾}(save)
  @+[Edit]{✏️}(edit)
  @=[Delete]{🗑️}(delete)`,
      description: "Showcase different button variants using @[variant] syntax with optional icons and actions"
    },
    {
      name: "Navigation Links",
      code: `screen NavigationExample:
  container:
    ## Internal Navigation
    @core[Dashboard](dashboard-screen)
    @core[User Profile](profile-screen)
    @core[Settings](settings-screen)
    @core[Reports](reports-screen)

    ## External Links
    @web[Visit Website](https://example.com)
    @web[Documentation](https://docs.example.com)

    ## Simple Links
    @core[About Us](about)
    @core[Contact](contact)`,
      description: "Create navigational links using @core for internal navigation and @web for external URLs"
    },
    {
      name: "Image Gallery",
      code: `screen ImageGalleryExample:
  # Profile Images
  ![User Avatar](https://picsum.photos/100/100?random=1)
  ![Team Photo](https://picsum.photos/300/200?random=2)
  
  # Product Images
  ![Product Showcase](https://picsum.photos/400/300?random=3)
  ![Feature Banner](https://picsum.photos/500/200?random=4)
  
  # Icons and Graphics
  ![App Icon](https://picsum.photos/64/64?random=5)
  ![Logo](https://picsum.photos/200/80?random=6)`,
      description: "Display images with alt text using ![alt](url) syntax, supporting various sizes"
    },
    {
      name: "Interactive Dashboard",
      code: `screen InteractiveDashboard:
  container:
    ## Control Panel
    @[Refresh Data](refresh)
    @secondary[Export](export)
    @ghost[Settings](settings)

    card:
      ### Quick Actions
      row:
        @[New Project](new-project)
        @[View Reports](reports)
      row:
        @warning[Emergency Stop](emergency)
        @ghost[Help](help)

    ## Navigation Menu
    @core[Home](home)
    @core[Projects](projects)
    @core[Analytics](analytics)
    @core[Team](team)`,
      description: "Combine buttons, links, and layout elements for an interactive dashboard interface"
    },
    {
      name: "Action Panel",
      code: `screen ActionPanelExample:
  # Document Actions
  @[Save Document]{💾}(save)
  @+[Share]{📤}(share)
  @_[Preview]{👁️}(preview)
  
  ---
  
  # Collaboration
  @[Invite Users]{👥}(invite)
  @-[Comments]{💬}(comments)
  @[Version History]{📋}(history)
  
  ---
  
  # Danger Zone
  @![Archive]{📦}(archive)
  @=[Delete Forever]{🗑️}(delete-confirm)`,
      description: "Organize related actions with separators and appropriate button variants for different action types"
    }
  ]
};

export default interactiveExamples;
