const dashboardExample = `
screen Dashboard:
  # My Dashboard
  > Welcome to your personal dashboard
  
  row:
    col:
      card:
        ## Analytics
        > This widget shows analytics data
        - Total Users: 1,245
        - Active Sessions: 423
        - Conversion Rate: 8.5%
        @[View Details]
    
    col:
      card:
        ## Reports
        > View and download reports
        - Monthly Summary
        - User Activity
        - Performance Metrics
        ___:Report Type{Select report type}[Monthly | Weekly | Daily | Custom]
        @[Generate Report]
  card:
    ## Recent Activity
    - Updated profile information
    - Changed account settings
    - Added new dashboard widget
    - Completed onboarding process
  
  row:
    col:
      card:
        ## Quick Actions
        @[New Post]
        @[Settings]
        @[Help]
    
    col:
      card:
        ## Notifications
        [X] Enable email alerts
        [X] Enable browser notifications
        [ ] Enable SMS alerts
        ___:Notification Frequency{Set frequency}[Immediate | Hourly | Daily | Weekly]
`;

export default dashboardExample;