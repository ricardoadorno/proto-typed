/**
 * Primitives Domain - DSL Fixtures with Expected Output
 *
 * Each fixture contains:
 * - dsl: Input DSL string
 * - expected: Expected output (HTML patterns and/or complete HTML)
 *   - htmlOutput: Complete expected HTML output (optional, for precise validation)
 *   - htmlContains: Patterns that must be present in HTML (for flexible validation)
 *   - htmlNotContains: Patterns that must NOT be present
 */

export interface Fixture {
  dsl: string
  expected: {
    htmlOutput?: string // Complete expected HTML output (optional)
    htmlContains: string[] // Patterns that must be present in HTML
    htmlNotContains?: string[] // Patterns that must NOT be present
  }
}

export const primitivesFixtures = {
  buttons: {
    basic: {
      dsl: `screen Test:
  @[Click Me](action)`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><button class="inline-flex items-center justify-center   focus:outline-none focus:ring-2 transition-colors duration-200 h-10 px-5 text-sm" style="border-radius: var(--radius); focus-ring-color: var(--ring); background-color: var(--primary); color: var(--primary-foreground);" data-nav="action" data-nav-type="internal">Click Me</button></div>`,
        htmlContains: [
          '<button',
          'Click Me',
          '</button>',
          'data-nav="action"',
          'data-nav-type="internal"',
          'var(--primary)',
        ],
      },
    } as Fixture,

    secondary: {
      dsl: `screen Test:
  @secondary[Submit](submit)`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><button class="inline-flex items-center justify-center   focus:outline-none focus:ring-2 transition-colors duration-200 h-10 px-5 text-sm" style="border-radius: var(--radius); focus-ring-color: var(--ring); background-color: var(--secondary); color: var(--secondary-foreground);" data-nav="submit" data-nav-type="internal">Submit</button></div>`,
        htmlContains: [
          '<button',
          'Submit',
          'data-nav="submit"',
          'background-color: var(--secondary)',
        ],
      },
    } as Fixture,

    destructive: {
      dsl: `screen Test:
  @destructive[Delete](delete)`,
      expected: {
        htmlContains: [
          '<button',
          'Delete',
          'data-nav="delete"',
          'background-color: var(--destructive)',
        ],
      },
    } as Fixture,

    outline: {
      dsl: `screen Test:
  @outline[Cancel](cancel)`,
      expected: {
        htmlContains: [
          '<button',
          'Cancel',
          'data-nav="cancel"',
          'border: 1px solid var(--input)',
        ],
      },
    } as Fixture,

    ghost: {
      dsl: `screen Test:
  @ghost[Menu](menu)`,
      expected: {
        htmlContains: ['<button', 'Menu', 'data-nav="menu"'],
      },
    } as Fixture,

    withSize: {
      dsl: `screen Test:
  @secondary-large[Big Button](action)
  @primary-small[Tiny Button](action)`,
      expected: {
        htmlContains: [
          '<button',
          'Big Button',
          'Tiny Button',
          'px-6', // large size
          'h-12', // large height
          'px-4', // small size
          'h-9', // small height
        ],
      },
    } as Fixture,

    navigation: {
      dsl: `screen Test:
  @[Go to Settings](SettingsScreen)
  @[Go Home](HomePage)`,
      expected: {
        htmlContains: [
          'data-nav="SettingsScreen"',
          'data-nav="HomePage"',
          'data-nav-type="internal"',
          'Go to Settings',
          'Go Home',
        ],
      },
    } as Fixture,

    allVariants: {
      dsl: `screen Test:
  stack:
    @[Primary](action)
    @secondary[Secondary](action)
    @outline[Outline](action)
    @ghost[Ghost](action)
    @destructive[Destructive](action)`,
      expected: {
        htmlContains: [
          'Primary',
          'Secondary',
          'Outline',
          'Ghost',
          'Destructive',
          'var(--primary)',
          'var(--secondary)',
          'var(--destructive)',
        ],
      },
    } as Fixture,
  },

  inlineLinks: {
    internal: {
      dsl: `screen Test:
  > Read the [documentation](Docs) for more details.`,
      expected: {
        htmlContains: [
          '<p',
          '<a',
          'href="#Docs"',
          'documentation',
          '</a>',
          'for more details',
          '</p>',
        ],
      },
    } as Fixture,

    external: {
      dsl: `screen Test:
  > Visit [Proto-Typed](https://proto-typed.dev) website.`,
      expected: {
        htmlContains: [
          '<a',
          'href="https://proto-typed.dev"',
          'Proto-Typed',
          'data-nav-type="external"',
        ],
      },
    } as Fixture,

    multiple: {
      dsl: `screen Test:
  > Check [guides](Guides) and [examples](Examples) or visit [site](https://example.com).`,
      expected: {
        htmlContains: [
          'href="#Guides"',
          'href="#Examples"',
          'href="https://example.com"',
          'guides',
          'examples',
          'site',
        ],
      },
    } as Fixture,

    withIcon: {
      dsl: `screen Test:
  > Mixed [i-zap Help](Support) example`,
      expected: {
        htmlContains: ['<a', 'href="#Support"', 'i-zap Help', '</a>'],
        htmlNotContains: ['<svg'], // Icons should not be rendered inside link text
      },
    } as Fixture,
  },

  images: {
    basic: {
      dsl: `screen Test:
  ![Logo](logo.png)`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><img src="logo.png" alt="Logo" class="max-w-full h-auto" /></div>`,
        htmlContains: ['<img', 'src="logo.png"', 'alt="Logo"', '/>'],
      },
    } as Fixture,

    rounded: {
      dsl: `screen Test:
  !rounded[Avatar](avatar.jpg)`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><img src="avatar.jpg" alt="Avatar" class="max-w-full h-auto rounded-[--radius] shadow-md" /></div>`,
        htmlContains: ['<img', 'src="avatar.jpg"', 'alt="Avatar"', 'rounded-[--radius]'],
      },
    } as Fixture,

    circle: {
      dsl: `screen Test:
  !circle[Profile](profile.jpg)`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><img src="profile.jpg" alt="Profile" class="max-w-full h-auto rounded-full object-cover shadow-md" style="aspect-ratio: 1 / 1" /></div>`,
        htmlContains: [
          '<img',
          'src="profile.jpg"',
          'alt="Profile"',
          'rounded-full',
          'aspect-ratio: 1 / 1',
        ],
      },
    } as Fixture,

    withDimensions: {
      dsl: `screen Test:
  !circle-64x64[Avatar](user.jpg)
  !rounded-200x150[Banner](banner.png)`,
      expected: {
        htmlContains: [
          'width: 64px',
          'height: 64px',
          'width: 200px',
          'height: 150px',
          'rounded-full',
          'rounded-[--radius]',
        ],
      },
    } as Fixture,

    multiple: {
      dsl: `screen Test:
  stack:
    ![Header](header.jpg)
    !rounded[Thumbnail](thumb.png)
    !circle-48x48[Icon](icon.png)`,
      expected: {
        htmlContains: [
          'src="header.jpg"',
          'src="thumb.png"',
          'src="icon.png"',
          'rounded-[--radius]',
          'rounded-full',
          'width: 48px',
        ],
      },
    } as Fixture,
  },

  headings: {
    h1: {
      dsl: `screen Test:
  # Main Title`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight text-[var(--fg-primary)]">Main Title</h1></div>`,
        htmlContains: ['<h1', 'Main Title', '</h1>', 'text-4xl', 'font-extrabold'],
      },
    } as Fixture,

    h2: {
      dsl: `screen Test:
  ## Section Title`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><h2 class="scroll-m-20 text-3xl font-semibold tracking-tight text-[var(--fg-primary)]">Section Title</h2></div>`,
        htmlContains: ['<h2', 'Section Title', '</h2>', 'text-3xl', 'font-semibold'],
      },
    } as Fixture,

    h3: {
      dsl: `screen Test:
  ### Subsection`,
      expected: {
        htmlContains: ['<h3', 'Subsection', '</h3>', 'text-2xl'],
      },
    } as Fixture,

    h4: {
      dsl: `screen Test:
  #### Small Heading`,
      expected: {
        htmlContains: ['<h4', 'Small Heading', '</h4>', 'text-xl'],
      },
    } as Fixture,

    hierarchy: {
      dsl: `screen Test:
  # Page Title
  > Introduction paragraph
  ## First Section
  > Section content
  ### Subsection
  > Subsection content
  #### Detail
  > Detail content`,
      expected: {
        htmlContains: [
          '<h1',
          'Page Title',
          '<p',
          'Introduction paragraph',
          '<h2',
          'First Section',
          '<h3',
          'Subsection',
          '<h4',
          'Detail',
        ],
      },
    } as Fixture,
  },

  text: {
    paragraph: {
      dsl: `screen Test:
  > This is a paragraph`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><p class="text-base leading-7 text-[var(--fg-secondary)]">This is a paragraph</p></div>`,
        htmlContains: ['<p', 'This is a paragraph', '</p>', 'text-base', 'leading-7'],
      },
    } as Fixture,

    small: {
      dsl: `screen Test:
  >> Small text here`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><p class="text-sm leading-6 text-[var(--fg-secondary)]">Small text here</p></div>`,
        htmlContains: ['Small text here', 'text-sm', 'leading-6'],
      },
    } as Fixture,

    muted: {
      dsl: `screen Test:
  >>> Muted text here`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><p class="text-sm leading-6 text-muted-foreground">Muted text here</p></div>`,
        htmlContains: ['Muted text here', 'text-sm', 'muted-foreground'],
      },
    } as Fixture,

    blockquote: {
      dsl: `screen Test:
  *> This is a quote`,
      expected: {
        htmlOutput: `<div class="screen container Test" data-screen="Test"><blockquote class="mt-6 border-l-2 pl-6 italic text-muted-foreground">This is a quote</blockquote></div>`,
        htmlContains: ['<blockquote', 'This is a quote', '</blockquote>', 'border-l-2'],
      },
    } as Fixture,

    note: {
      dsl: `screen Test:
  **> Important note`,
      expected: {
        htmlContains: ['Important note', 'role="note"', 'border', 'rounded-lg'],
      },
    } as Fixture,

    mixed: {
      dsl: `screen Test:
  > Regular paragraph
  >> Small text for details
  >>> Muted secondary info
  *> "A memorable quote"
  **> Don't forget this important point`,
      expected: {
        htmlContains: [
          '<p',
          'Regular paragraph',
          'Small text for details',
          'Muted secondary info',
          '<blockquote',
          'A memorable quote',
          'role="note"',
          "Don't forget this important point",
        ],
      },
    } as Fixture,
  },

  icons: {
    basic: {
      dsl: `screen Test:
  > i-home Home Icon
  > i-user User Icon
  > i-settings Settings Icon`,
      expected: {
        // Note: Icons are currently rendered as text literals, not SVG
        htmlContains: ['Home Icon', 'User Icon', 'Settings Icon', '<p', 'i-home', 'i-user'],
      },
    } as Fixture,

    sizes: {
      dsl: `screen Test:
  > i-16-home Small Home
  > i-24-user Medium User
  > i-32-settings Large Settings`,
      expected: {
        // Note: Icons are currently rendered as text literals, not SVG
        htmlContains: [
          'i-16-home',
          'i-24-user',
          'i-32-settings',
          'Small Home',
          'Medium User',
          'Large Settings',
        ],
      },
    } as Fixture,

    inText: {
      dsl: `screen Test:
  > Click i-arrow-right to continue
  > Settings i-gear available in menu`,
      expected: {
        // Note: Icons are currently rendered as text literals, not SVG
        htmlContains: [
          'Click',
          'i-arrow-right',
          'to continue',
          'Settings',
          'i-gear',
          'available in menu',
        ],
      },
    } as Fixture,
  },
}
