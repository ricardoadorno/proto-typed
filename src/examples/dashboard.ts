const dashboardExample = `
screen Dashboard:
  # My Dashboard
  > Welcome to your personal dashboard
  
  row-between:
    card:
        ## Analytics
        > This widget shows analytics data
        list:
          - Total Users: 1,245
          - Active Sessions: 423
          - Conversion Rate: 8.5%
        @[View Details]
    
    card:
        ## Reports
        > View and download reports
        list:
          - Monthly Summary
          - User Activity
          - Performance Metrics
        ___:Report Type{Select report type}[Monthly | Weekly | Daily | Custom]
        @[Generate Report]
        
  card:
    ## Recent Activity
    list:
      - Updated profile information
      - Changed account settings
      - Added new dashboard widget
      - Completed onboarding process
  
  row-between:
    card:
        ## Quick Actions
        stack:
          @[New Post]
          @[Settings]
          @[Help]
    
    card:
        ## Notifications
        stack:
          [X] Enable email alerts
          [X] Enable browser notifications
          [ ] Enable SMS alerts
          ___:Notification Frequency{Set frequency}[Immediate | Hourly | Daily | Weekly]
`;

export default dashboardExample;