const weatherAppExample = `component ForecastCard:
  card-compact:
    stack-tight:
      >> $day
      >>> $temp
      > $condition


screen Home:
  header:
    >> Weather
    @ghost-icon[i-MapPin](Locations)

  container:
    # San Francisco
    >>> Current Location

    card:
      stack:
        # 72°F
        >> Partly Cloudy
        >>> Feels like 68°F

        ---

        grid-3:
          stack-tight:
            >> i-Droplet 65%
            >>> Humidity

          stack-tight:
            >> i-Wind 12 mph
            >>> Wind

          stack-tight:
            >> i-Eye 10 mi
            >>> Visibility

    ---

    ## 7-Day Forecast

    list $ForecastCard:
      - Monday | 75°F / 62°F | Sunny
      - Tuesday | 73°F / 60°F | Cloudy
      - Wednesday | 71°F / 59°F | Rainy
      - Thursday | 68°F / 57°F | Rainy
      - Friday | 74°F / 61°F | Partly Cloudy

    ---

    @outline[i-RefreshCw Update](Home)

  navigator:
    - i-Home | Home
    - i-CloudRain | Forecast
    - i-Settings | Settings


screen Forecast:
  header:
    ## Detailed Forecast
    @ghost-icon[i-ArrowLeft](Home)

  container:
    # This Week

    card:
      ## Monday
      >>> High: 75°F • Low: 62°F

      row:
        > i-Sun Morning: Sunny

      row:
        > i-Cloud Afternoon: Partly Cloudy

      row:
        > i-Moon Evening: Clear

    ---

    card:
      ## Tuesday
      >>> High: 73°F • Low: 60°F

      row:
        > i-CloudRain 60% chance of rain

      *> Bring an umbrella!

  navigator:
    - i-Home | Home
    - i-CloudRain | Forecast
    - i-Settings | Settings


screen Locations:
  header:
    ## Locations
    @ghost-icon[i-Plus](AddLocation)

  container:
    # My Locations

    card:
      row-between:
        stack-tight:
          >> San Francisco, CA
          >>> 72°F • Partly Cloudy
        @ghost-small[i-Star](Locations)

    card:
      row-between:
        stack-tight:
          >> New York, NY
          >>> 65°F • Rainy
        @ghost-small[i-X](Locations)

    card:
      row-between:
        stack-tight:
          >> Tokyo, Japan
          >>> 58°F • Clear
        @ghost-small[i-X](Locations)


modal AddLocation:
  card:
    ## Add Location

    ___[City][Enter city name] | required

    ---

    > Recent searches:

    stack-tight:
      > [Los Angeles, CA](Locations)
      > [Chicago, IL](Locations)
      > [Miami, FL](Locations)

    ---

    row-between:
      @ghost[Cancel](-1)
      @primary[i-Plus Add](Locations)


screen Settings:
  header:
    ## Settings
    @ghost-icon[i-ArrowLeft](Home)

  container:
    card:
      ## Units

      #### Temperature
      (X) Fahrenheit (°F)
      ( ) Celsius (°C)

      ---

      #### Wind Speed
      (X) mph
      ( ) km/h
      ( ) m/s

    ---

    card:
      ## Notifications

      [X] Weather alerts
      [X] Daily forecast
      [ ] Severe weather warnings
      [ ] Rain notifications

    ---

    card:
      ## Display

      [X] Show humidity
      [X] Show wind speed
      [X] 7-day forecast
      [ ] UV index

  navigator:
    - i-Home | Home
    - i-CloudRain | Forecast
    - i-Settings | Settings
`

export default weatherAppExample
