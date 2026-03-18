# The Dram Project

A reference website for Scotch Whisky Single Malt — browse official tasting notes organized by region and distillery.

🌐 **Live site:** [dram.philippelavoie.com](https://dram.philippelavoie.com)

---

## About

Created by Philippe Lavoie, a Scotch amateur from Montréal. After visiting Scotland and 6 distilleries, the idea was to build a clean reference site holding the official tasting notes for the most common single malts.

Data is sourced from a Google Spreadsheet and displayed through a responsive web interface with desktop, tablet, and mobile views.

---

## Features

- 🥃 Browse whiskies by Scottish region and distillery
- 📝 Official tasting notes: nose, taste, and finish
- 💰 SAQ (Société des alcools du Québec) pricing and links
- 📱 Responsive design — works on desktop, tablet, and mobile
- 🔗 Permalink support for deep-linking to specific bottles
- 🗺️ Interactive map view (`map.html`)

---

## Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [jQuery](https://jquery.com/) | 3.7.1 | DOM manipulation & AJAX |
| [jQuery UI](https://jqueryui.com/) | 1.14.1 | UI effects (slide, animations) |
| [jQuery Mobile](https://jquerymobile.com/) | 1.4.1 | Mobile interface (loaded conditionally) |
| [jQuery Roundabout](http://fredhq.com/projects/roundabout) | — | Carousel for desktop view |
| [Knockout.js](https://knockoutjs.com/) | 3.5.1 | MVVM data binding |
| [Underscore.js](https://underscorejs.org/) | 1.13.8 | Utility functions |
| [Modernizr](https://modernizr.com/) | 2.6.2 | Feature detection |
| [YepNope](http://yepnopejs.com/) | — | Conditional resource loading |
| [Bootstrap](https://getbootstrap.com/) | 2.x | Layout and UI components |
| [Glyphicons](https://glyphicons.com/) | — | Icons |

---

## Project Structure

```
DramProject/
├── index.html              # Main application entry point
├── map.html                # Interactive map view
├── CNAME                   # Custom domain configuration (dram.philippelavoie.com)
├── css/
│   ├── style.css           # Main stylesheet
│   ├── mobile.css          # Mobile-specific overrides
│   ├── bootstrap.min.css   # Bootstrap framework
│   ├── bootstrap-responsive.min.css
│   └── jquery.mobile-1.4.1.min.css
├── js/
│   ├── script.js           # Main application logic & SpreadSheet module
│   ├── DramViewModel.js    # Knockout ViewModel (data loading & mapping)
│   ├── DistilleryViewModel.js  # Distillery & Bottle view models
│   ├── jquery-3.7.1.min.js
│   ├── jquery-ui-1.14.1.min.js
│   ├── knockout-3.5.1.js
│   ├── underscore-1.13.8.min.js
│   └── ...
└── img/
    ├── logo.png
    ├── favicon.ico
    └── ...
```

---

## GitHub Pages

This site is published via **GitHub Pages** directly from the `master` branch (root folder).

The custom domain `dram.philippelavoie.com` is configured via the `CNAME` file.

**To configure Pages:** Go to *Settings → Pages*, set Source to `master` branch, root folder.

---

## Data Source

The whisky data is stored in a Google Spreadsheet and loaded at runtime via the [Google Visualization API](https://developers.google.com/chart/interactive/docs/spreadsheets).

Spreadsheet columns: Region, Distillery, Order, Whisky Name, Alcohol %, Appearance, Nose, Taste, Finish, Description, External URL, Picture URL, Scotchit URL, SAQ URL, SAQ Price.

---

## Links

- 🐛 [Report a bug or suggest a feature](https://github.com/drdeteck/DramProject/issues/new)
- 👤 [Author's website](http://www.philippelavoie.com)
- 💼 [Philippe Lavoie on LinkedIn](http://www.linkedin.com/in/philippelavoie)
- 🥃 [r/scotch on Reddit](http://www.reddit.com/r/scotch)
