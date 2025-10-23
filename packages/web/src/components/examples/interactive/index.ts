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
  # Internal Navigation
  #[Dashboard](dashboard-screen)
  #[User Profile](profile-screen)
  #[Settings](settings-screen)
  #[Reports](reports-screen)
  
  # External Links
  #[Visit Website](https://example.com)
  #[Documentation](https://docs.example.com)
  
  # Simple Links
  #[About Us]
  #[Contact]`,
      description: "Create navigational links for internal screens and external URLs using #[text](destination) syntax"
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
  # Control Panel
  @[Refresh Data]{🔄}(refresh)
  @+[Export]{📊}(export)
  @-[Settings]{⚙️}(settings)
  
  card:
    ## Quick Actions
    row:
      col:
        @[New Project](new-project)
        @[View Reports](reports)
      col:
        @![Emergency Stop](emergency)
        @_[Help](help)
  
  # Navigation Menu
  #[Home](home)
  #[Projects](projects) 
  #[Analytics](analytics)
  #[Team](team)`,
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
