import { ExampleCategory } from '../types';

/**
 * Display component examples covering typography, progress indicators, badges, and data visualization
 */
export const displayExamples: ExampleCategory = {
  title: "Display Elements",
  examples: [
    {
      name: "Typography Hierarchy",
      code: `screen TypographyExample:
  # Main Heading (H1)
  ## Section Heading (H2)
  ### Subsection Heading (H3)
  #### Minor Heading (H4)
  ##### Small Heading (H5)
  ###### Tiny Heading (H6)
  
  > Regular paragraph text with normal content
  *> Note text with emphasis for important information
  "> Quote text for citations and highlighted content
  
  > Multiple paragraphs can be used to create
  > structured content with proper spacing`,
      description: "Display text hierarchy from H1-H6 headings plus paragraph, note, and quote styles"
    },
    {
      name: "Ordered Lists",
      code: `screen OrderedListExample:
  # Setup Instructions
  1. Download the application
  2. Install dependencies
  3. Configure environment variables
  4. Run database migrations
  5. Start the development server
  6. Open browser to localhost:3000
  
  # Troubleshooting Steps
  1. Check system requirements
  2. Verify network connection
  3. Clear browser cache
  4. Restart the application`,
      description: "Create numbered lists for step-by-step instructions and procedures"
    },
    {
      name: "Unordered Lists",
      code: `screen UnorderedListExample:
  # Features
  - Real-time collaboration
  - Version control integration
  - Advanced search capabilities
  - Custom themes and styling
  - Mobile-responsive design
  
  # Supported Formats
  - JSON configuration files
  - YAML data structures
  - Markdown documentation
  - CSV data imports`,
      description: "Create bullet point lists for features, benefits, and general information"
    },    {
      name: "Data Dashboard",
      code: `screen DataDashboardExample:
  # System Status
  ## Server Performance
  > Current status: Operational
  
  ## Database Health
  > Status: Excellent performance
  
  ## API Response Time
  > Average: 120ms
  
  ---
  
  # Recent Activities
  1. User authentication system updated
  2. Database backup completed successfully
  3. New feature deployed to production
  4. Security patch applied
  
  ---
  
  # System Metrics
  - CPU Usage: 45%
  - Memory Usage: 62%
  - Disk Space: 78% used
  - Active Users: 1,247`,
      description: "Combine headings, text, and lists to create informative data displays"
    }
  ]
};

export default displayExamples;
