const dashboardExample = `
@screen Dashboard:
  # My Dashboard
  > Welcome to your personal dashboard
  
  card:
    row:
      col:
        # Analytics
        > This widget shows analytics data
        @[View Details]
      
      col:
        # Reports
        > View and download reports
        @[Generate Report]
    
    row:
      col:
        # Recent Activity
        1. Updated profile
        2. Changed settings
        3. Added new widget

`;

export default dashboardExample;