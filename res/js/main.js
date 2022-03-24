let defaults = document.createElement('script');
defaults.type = 'text/javascript';
defaults.src = 'res/js/defaults.js';
document.head.appendChild(defaults);

document.getElementById("search_query").focus();
document.getElementById("settings-icon").addEventListener("click", openOptions);
document.getElementById("search_query").addEventListener("keydown", queryListener);
document.getElementById("search_query").addEventListener("keyup", disableXButton);
document.getElementById("search_query").addEventListener("input", enableXButton);
document.getElementById("search_button").addEventListener("click", submitQuery);
browser.storage.onChanged.addListener(getSettings);

let settings = new Object();

getSettings();

function getSettings() {
    browser.storage.sync.get('settings')
        .then(syncGetSuccess, syncGetError);
}

function syncGetSuccess(obj) {
    if (Object.keys(obj).length === 0) {
       loadDefaults();
       loadContent();
    } else {
        settings = obj.settings;
        loadContent();
    }
}

function syncGetError(error) {
    console.error('Error getting storage: ' + error);
}

function openOptions() {
  browser.runtime.openOptionsPage();
}

function loadContent() {
  if (settings.use_wallpaper) {
    if (settings.enable_fade) {
      document.getElementById("fade").style.display = "block"
      document.getElementById("fade").classList.add("invisible")
    } else {
      document.getElementById("fade").style.display = "none"
    }
    document.getElementsByTagName("html")[0].style = "background: url(" + settings.wallpaper + ");";
  } else {
    document.getElementById("fade").style.display = "none"
    document.getElementsByTagName("html")[0].style = "background: #" + settings.bg_color + ";"
  }

  if (settings.enable_search) {
    document.getElementById("search_bar").style.display = "flex";
  } else {
    document.getElementById("search_bar").style.display = "none";
  }

  searchBar = document.getElementById("search_query");
  searchBar.placeholder = settings.search_engine

  startTime();
  startDate();

  if (settings.enable_settings) {
    document.getElementById("settings-icon").style.display = "block";
  } else {
    document.getElementById("settings-icon").style.display = "none";
  }

  switch (settings.favicon_color) {
    case 'color':
      document.getElementById("favicon").href = "res/img/icons/favicon.ico";
    break;
    case 'bw':
      document.getElementById("favicon").href = "res/img/icons/favicon_grey.ico";
      break;
    case 'none':
      document.getElementById("favicon").remove;
      break;
  }

  if (settings.enable_weather) {
    document.getElementById("weather-widget").style.display = "block"
    getOWM();
  } else {
    document.getElementById("weather-widget").style.display = "none"
  }

  // Load links
  let linksContainer = document.querySelector("#links");

  while (linksContainer.firstChild) {
    linksContainer.removeChild(linksContainer.firstChild);
  }

  for (let i = 0; i < settings.links.length; i++) {
    if (settings.links[i][0] != "" && settings.links[i][1] != "") {
      let link = document.createElement("a");
      link.classList.add("custom_link");

      if (
        settings.links[i][1].slice(0,7) != "http://" &&
        settings.links[i][1].slice(0,8) != "https://" &&
        settings.links[i][1].slice(0,8) != "file:///") {
          link.href = "https://" + settings.links[i][1];
      } else {
        link.href = settings.links[i][1];
      }
  
      let favicon = document.createElement("img");
      favicon.classList.add("link_favicon");
      favicon.src = "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link.href + "&size=16";
      link.appendChild(favicon);
  
      let linkName = document.createElement("div");
      linkName.classList.add("link_name");
      linkName.innerHTML = settings.links[i][0];
      link.appendChild(linkName);
  
      linksContainer.appendChild(link);
    }
  }
}

function getOWM() {
  if (settings.api_key) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + settings.city + '&units=' + settings.units + '&appid=' + settings.api_key)
      .then(response => response.json())
      .then(data => {
        document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°"
        document.getElementById("weather_desc").innerHTML = data.weather[0].main
        document.getElementById("weather-icon").src = "res/img/weather/" + data.weather[0].icon + ".png"
      }
    );
  }
}

function submitQuery() {
  const query = document.getElementById("search_query").value;

  if (query) {
    switch (settings.search_engine) {
      case 'Google':
        window.open("https://www.google.com/search?q=" + query, "_self");
        break;
      case 'DuckDuckGo':
        window.open("https://www.duckduckgo.com/?q=" + query, "_self");
        break;
      case 'Bing':
        window.open("https://www.bing.com/search?q=" + query, "_self");
        break;
      case 'Startpage':
        window.open("https://www.startpage.com/sp/search?query=" + query, "_self");
        break;
    }
  }
}

function queryListener(event) {
  if (event.which == 13) {
    submitQuery();
  }
}

function enableXButton() {
  let x = document.getElementById("x_button");
  x.style = "display: block";
  x.addEventListener("click", clearQuery);
}

function disableXButton() {
  let x = document.getElementById("x_button");
  if (document.getElementById("search_query").value == "") {
    x.style = "display: none";
    x.removeEventListener("click", clearQuery);
  }
}

function clearQuery() {
  let x = document.getElementById("x_button");
  document.getElementById("search_query").value = ""
  x.style = "display: none";
  x.removeEventListener("click", clearQuery);
}

function startTime() {
  if (!settings.enable_clock) {return}
  const today = new Date();
  
  let h = today.getHours();
  let m = today.getMinutes();
  let t_suffix = ""

  if (m < 10) {m = "0" + m};

  if (settings.clock_12) {

    if (h == 0) {
      h = 12;
    }

    if (h > 12) {
      h = h - 12
      t_suffix = " PM"
    } else {
      t_suffix = " AM"
    }
  } else {
    if (h == 0) {
      h = '00'
    }
  }

  document.getElementById("clock").innerHTML = h + ":" + m + t_suffix;

  if (settings.enable_date) {

  }
  setTimeout(startTime, 1000);
}

function startDate() {
  if (!settings.enable_date) {return}
  const today = new Date();

  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let weekday = week[today.getDay()];
  let date = today.getDate().toString();
  let d_suffix = new String;

  switch (date.slice(-1)) {
    case '1':
      d_suffix = 'st';
      break;
    case '2':
      d_suffix = 'nd';
    case '3':
      d_suffix = 'rd';
    default:
      d_suffix = 'th'
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month = months[today.getMonth() - 1];

  document.getElementById('date').innerText = weekday + ", " + month + " " + date + d_suffix + " " + today.getFullYear();

  setTimeout(startDate, 1000);
}