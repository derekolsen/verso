function loadDefaults() {
    settings = {
      use_wallpaper: true,
      wallpaper: 'res/img/default.jpg',
      enable_fade: true,
      bg_color: '000000',
      enable_search: true,
      search_engine: 'Google',
      links: [
          ['Discord', 'https://discord.com/app'],
          ['YouTube', 'https://youtube.com'],
          ['Spotify', 'https://open.spotify.com']
      ],
      enable_weather: false,
      api_key: '',
      city: '',
      units: 'imperial',
      enable_clock: true,
      clock_12: 'ampm',
      enable_date: true,
      favicon_color: 'color',
      enable_settings: true
    }
}