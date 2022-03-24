let defaults = document.createElement('script');
defaults.type = 'text/javascript';
defaults.src = 'res/js/defaults.js';
document.head.appendChild(defaults);

// Background
document.querySelector('#radio_wallpaper').addEventListener('change', controlRadioWallpaper);
document.querySelector('#radio_hexcolor').addEventListener('change', controlRadioHexColor);
document.querySelector('#text_wallpaper').addEventListener('keyup', controlWallpaper);
document.querySelector('#text_wallpaper').addEventListener('paste', controlWallpaper);
document.querySelector('#text_hexcolor').addEventListener('keyup', controlHexColor);
document.querySelector('#text_hexcolor').addEventListener('paste', controlHexColor);
document.querySelector('#enable_fade').addEventListener('change', controlFade);

// Search
document.querySelector('#enable_search').addEventListener('change', controlEnableSearch);
document.querySelector('#search_engine').addEventListener('change', controlSearchEngine);

// Bookmarks
document.querySelector('#add_bookmark').addEventListener('click', addBookmark);

// Weather
document.querySelector('#enable_weather').addEventListener('change', controlEnableWeather);
document.querySelector('#api_key').addEventListener('keyup', controlAPIkey);
document.querySelector('#api_key').addEventListener('paste', controlAPIkey);
document.querySelector('#city').addEventListener('keyup', controlCity);
document.querySelector('#city').addEventListener('paste', controlCity);
document.querySelector('#units').addEventListener('change', controlUnits);

// Clock
document.querySelector('#enable_clock').addEventListener('change', controlEnableClock);
document.querySelector('#clock_12').addEventListener('change', controlClockFormat);
document.querySelector('#enable_date').addEventListener('change', controlEnableDate);

// Other
document.querySelector('#favicon_color').addEventListener('change', controlFavicon);
document.querySelector('#enable_settings').addEventListener('change', controlSettingsIcon)

// Reset
document.querySelector('#reset').addEventListener('click', resetDefaults);

let settings = new Object();

getSettings();

function getSettings() {
    browser.storage.sync.get('settings')
        .then(syncGetSuccess, syncGetError);
}

function syncGetSuccess(obj) {
    if (Object.keys(obj).length === 0) {
       resetDefaults();
    } else {
        settings = obj.settings;
        loadSettings();
    }
}

function syncGetError(error) {
    console.error('Error getting storage: ' + error);
}

function syncSetError(error) {
    console.error('Error setting storage: ' + error);
}

function resetDefaults() {
    loadDefaults();
    saveSettings();
    loadSettings();
}

function loadSettings() {
    // Background
    if (settings.use_wallpaper) {
        document.querySelector('#radio_wallpaper').checked = true;
        document.querySelector('#radio_hexcolor').checked = false;
        document.querySelector('#radio_wallpaper').dispatchEvent(new Event('change'));
    } else {
        document.querySelector('#radio_hexcolor').checked = true;
        document.querySelector('#radio_wallpaper').checked = false;
        document.querySelector('#radio_hexcolor').dispatchEvent(new Event('change'));
    }
    document.querySelector('#text_wallpaper').value = settings.wallpaper;
    document.querySelector('#enable_fade').checked = settings.enable_fade;
    document.querySelector('#text_hexcolor').value = settings.bg_color;
    
    // Search
    document.querySelector('#enable_search').checked = settings.enable_search;
    document.querySelector('#search_engine').value = settings.search_engine;

    // Bookmarks
    instantiateBookmarks();

    // Weather
    document.querySelector('#enable_weather').checked = settings.enable_weather;
    document.querySelector('#api_key').value = settings.api_key;
    document.querySelector('#city').value = settings.city;
    document.querySelector('#units').value = settings.units;

    // Clock
    document.querySelector('#enable_clock').checked = settings.enable_clock;
    document.querySelector('#clock_12').value = settings.clock_12;
    document.querySelector('#enable_date').checked = settings.enable_date;

    // Other
    document.querySelector('#favicon_color').value = settings.favicon_color;
    document.querySelector('#enable_settings').checked = settings.enable_settings;
}

function saveSettings() {
    browser.storage.sync.set({settings})
        .then(syncSetSuccess, syncSetError);
}

function syncSetSuccess() {
    return
}

function controlRadioWallpaper() {
    document.getElementById('text_wallpaper').disabled = false;
    document.getElementById('enable_fade').disabled = false
    document.getElementById('text_hexcolor').disabled = true;
    settings.use_wallpaper = true;
    controlWallpaper();
}

function controlRadioHexColor() {
    document.getElementById('text_wallpaper').disabled = true;
    document.getElementById('enable_fade').disabled = true
    document.getElementById('text_hexcolor').disabled = false;
    settings.use_wallpaper = false;
    controlHexColor();
}

function controlWallpaper() {
    setTimeout(() => {
        settings.wallpaper = document.getElementById('text_wallpaper').value;
        saveSettings();
    });
}

function controlHexColor() {
    setTimeout(() => {
        settings.bg_color = document.getElementById('text_hexcolor').value;
        saveSettings(); 
    });
}

function controlFade() {
    settings.enable_fade = this.checked;
    saveSettings();
}

function controlEnableSearch() {
    settings.enable_search = this.checked;
    console.log(this)
    saveSettings();
}

function controlSearchEngine() {
    settings.search_engine = this.value;
    saveSettings();
}

function controlEnableWeather() {
    settings.enable_weather = this.checked;
    saveSettings();
}

function controlAPIkey() {
    setTimeout(() => {
        settings.api_key = this.value;
        saveSettings();
    });
}

function controlCity() {
    setTimeout(() => {
        settings.city = this.value;
        saveSettings();
    });
}

function controlUnits() {
    settings.units = this.value;
    saveSettings();
}

function controlEnableClock() {
    settings.enable_clock = this.checked;
    saveSettings();
}

function controlClockFormat() {
    if (this.value == 'ampm') {
        settings.clock_12 = true;
    } else if (this.value == '24') {
        settings.clock_12 = false;
    }
    saveSettings();
}

function controlEnableDate() {
    settings.enable_date = this.checked;
    saveSettings();
}

function controlFavicon() {
    settings.favicon_color = this.value;
    saveSettings();
}

function controlSettingsIcon() {
    settings.enable_settings = this.checked;
    saveSettings();
}

function instantiateBookmarks() {
    let bookmarkArray = document.getElementsByClassName('bookmark');

    const bookmarkCtnr = document.getElementById('bookmarks_ctnr')
    while (document.getElementsByClassName('bookmark').length != 0) {
        bookmarkCtnr.removeChild(bookmarkCtnr.firstChild);
    }

    for (index in settings.links) {
        let name = settings.links[index][0];
        let destination = settings.links[index][1];

        newBookmark = document.createElement('div');
        newBookmark.classList.add('bookmark');
        newBookmark.id = 'bookmark_' + index;
    
        newNameLabel = document.createElement('label')
        newNameLabel.for = 'bm_' + index + '_name';
        newNameLabel.innerHTML = 'Name:';
        newBookmark.appendChild(newNameLabel);
    
        newNameText = document.createElement('input');
        newNameText.type = 'text';
        newNameText.id = 'bm_' + index + '_name';
        newNameText.value = name;
        newNameText.addEventListener('keyup', saveName);
        newNameText.addEventListener('paste', saveName);
        newBookmark.appendChild(newNameText);
    
        newDestLabel = document.createElement('label');
        newDestLabel.for = 'bm_' + index + '_dest';
        newDestLabel.innerHTML = 'Destination:';
        newBookmark.appendChild(newDestLabel);
        
        newDestText = document.createElement('input');
        newDestText.type = 'text';
        newDestText.id = 'bm_' + index + '_dest';
        newDestText.value = destination;
        newDestText.addEventListener('keyup', saveDest);
        newDestText.addEventListener('paste', saveDest);
        newBookmark.appendChild(newDestText);
    
        newUpBtn = document.createElement('button');
        newUpBtn.id = "bm_" + index + "_up";
        newUpBtn.classList.add('bm_up');
        newUpBtn.innerHTML = '🡅';
        newUpBtn.addEventListener('click', moveBookmarkUp)
        newBookmark.appendChild(newUpBtn);
    
        newDownBtn = document.createElement('button');
        newDownBtn.id = "bm_" + index + "_down";
        newDownBtn.classList.add('bm_down');
        newDownBtn.innerHTML = '🡇';
        newDownBtn.addEventListener('click', moveBookmarkDown)
        newBookmark.appendChild(newDownBtn);
    
        newDelBtn = document.createElement('button');
        newDelBtn.id = "bm_" + index + "_del";
        newDelBtn.classList.add('bm_del');
        newDelBtn.innerHTML = '✕';
        newDelBtn.addEventListener('click', deleteBookmark);
        newBookmark.appendChild(newDelBtn);

        document.querySelector('#bookmarks_ctnr').appendChild(newBookmark);
    }
}

function addBookmark() {
    settings.links[settings.links.length] = ['','']
    if (settings.links.length == 20) {
        document.querySelector('#add_bookmark').disabled = true;
    }
    saveSettings();
    instantiateBookmarks();
}

function deleteBookmark() {
    let index = this.id.slice(3,4);
    settings.links.splice(index, 1);
    if (settings.links.length == 19) {
        document.querySelector('#add_bookmark').disabled = false;
    }
    saveSettings();
    instantiateBookmarks();
}

function moveBookmarkUp() {
    let index = this.id.slice(3,4);
    if (index == 0) {return};
    let item1 = settings.links[index - 1];
    let item2 = settings.links[index];

    settings.links.splice(index - 1, 2, item2, item1);
    saveSettings();
    instantiateBookmarks();
}

function moveBookmarkDown() {
    let index = this.id.slice(3,4);
    if (index == settings.links.length - 1) {return};
    let item1 = settings.links[index];
    let item2 = settings.links[+index + 1];

    settings.links.splice(index, 2, item2, item1);
    saveSettings();
    instantiateBookmarks();
}

function saveName() {
    let index = this.id.slice(3,4);
    setTimeout(() => {
        settings.links[index][0] = this.value;
        saveSettings();
    });
}

function saveDest() {
    let index = this.id.slice(3,4);
    setTimeout(() => {
        settings.links[index][1] = this.value;
        saveSettings();
    });
}