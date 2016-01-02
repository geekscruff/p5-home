// A wind direction vector
var wind;
// Circle position
var position;
// Background colour based on weather conditions
var day_night_background = 'skyblue';
// Percentage of clouds
var clouds;
// Wind icon
var wind_icon;
// Weather icon
var weather_icon;
// Day or Night
var d_n;
var done = false;

function preload() {    
  wind_icon = loadImage("assets/wind26.png");
  // Load default
  weather_icon = loadImage("assets/01d.png");
}

function setup() {
  createCanvas(720, 720);
  // Request the data from openweathermap
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=York,GB&units=imperial&APPID=15beecfbadf84bb6e86f493968eb38b5';
  loadJSON(url, gotWeather);
  // Wind icon starts in the middle
  position = createVector(width/2, height/2);
  // wind starts as (0,0)
  wind = createVector();
}

function draw() {
  //background(conditions);
  background(day_night_background);
    
  // This section draws an arrow pointing in the direction of wind
  push();
  translate(32, height - 32);
  // Rotate by the wind's angle
  rotate(wind.heading() + PI/2);
  noStroke();
  fill(255);
  ellipse(0, 0, 48, 48);
  stroke(45, 123, 182);
  strokeWeight(3);
  line(0, -16, 0, 16);
  noStroke();
  fill(45, 123, 182);
  triangle(0, -18, -6, -10, 6, -10);
  pop()
  
  push();
  translate(32, height - 32);
  noStroke();
  fill(0);
  ellipse(50, 0, 48, 48);
  image(weather_icon, 26, -21);
  pop();
  
  // Move in the wind's direction
  position.add(wind);
    
  cloud(clouds);
  
  //stroke(0);
  //fill(51);
  //ellipse(position.x, position.y, 16, 16);
  // Use a wind icon instead of an ellipse
  // Ideally angle this in the direction of the wind, but can't get that working
  // Have multiple icons
  image(wind_icon, position.x, position.y);
    
  if (position.x > width)  position.x = 0;
  if (position.x < 0)      position.x = width;
  if (position.y > height) position.y = 0;
  if (position.y < 0)      position.y = height; 
    
}

function gotWeather(weather) {
  
  gotDateTime(weather.sys.sunrise,weather.sys.sunset);

  // Get the angle (convert to radians)
  var angle = radians(Number(weather.wind.deg));
  // Get the wind speed
  var windmag = Number(weather.wind.speed);
  
  // Display as HTML elements
  var temperatureDiv = createDiv(floor(weather.main.temp) + '&deg;');
  var windDiv = createDiv("WIND " + windmag + " <small>MPH</small>");
  
  // Make a vector
  wind = p5.Vector.fromAngle(angle);
    
  var desc = String(weather.weather[0].description);
  var descDiv = createDiv("Description: " + desc);
  var weather_id = Number(weather.weather[0].id)
  
  // Codes http://openweathermap.org/weather-conditions
  // Can get icons
  switch(true) {
    case (weather_id < 200):
        weather_icon = loadImage("assets/" + "11" + d_n + ".png");
        break;
    case (weather_id >= 300 && weather_id < 400):
        weather_icon = loadImage("assets/" + "09" + d_n + ".png");
        break;
    case (weather_id >= 500 && weather_id <= 504):
        weather_icon = loadImage("assets/" + "10" + d_n + ".png");
        break;
    case (weather_id == '511'):
        weather_icon = loadImage("assets/" + "13" + d_n + ".png");
        break;
    case (weather_id >= 520 && weather_id <= 531):
        weather_icon = loadImage("assets/" + "09" + d_n + ".png");
        break;
    case (weather_id >= 600 && weather_id < 700):
        weather_icon = loadImage("assets/" + "13" + d_n + ".png");
        break;
    case (weather_id >= 600 && weather_id < 700):
        weather_icon = loadImage("assets/" + "50" + d_n + ".png");
        break;
    case (weather_id === 800):
          weather_icon = loadImage("assets/" + "01" + d_n + ".png");
        break;
    case (weather_id === 801):
        weather_icon = loadImage("assets/" + "02" + d_n + ".png");
        break;
    case (weather_id >= 802 && weather_id <= 803):
        weather_icon = loadImage("assets/" + "03" + d_n + ".png");
        break;
    case (weather_id === 804):
        weather_icon = loadImage("assets/" + "04" + d_n + ".png");
        break;
    //case (weather_id >= 900 && weather_id < 907):
    //    conditions = 'red';
    //    break;
    // http://www.december.com/html/spec/colorsvg.html
    default:
        weather_icon = loadImage("assets/" + "01" + d_n + ".png");
 }
    
  // Get cloudiness percentage
  clouds = Number(weather.clouds.all);
  var cloudiness;
    
 // we could add a number of clouds and then generate multiple clouds based on this
 switch(true) {
    case (clouds >=1 && clouds < 20):
        cloudiness = 'Hardy cloudy at all';
        break;
    case (clouds >=20 && clouds < 40):
        cloudiness = 'A teeny bit cloudy';
        break;
    case (clouds >=40 && clouds < 60):
        cloudiness = 'A bit cloudy';
        break;
    case (clouds >=60 && clouds < 80):
        cloudiness = 'Quite cloudy';
        break;
    case (clouds >=80 && clouds <= 100):
        cloudiness = 'Right cloudy';
        break;
    default:
        cloudiness = 'Not cloudy at all. Yay!';
 }
    
  var cloudyDiv = createDiv("Cloudy: " + cloudiness + " (" + clouds + "%)");    
}

function gotDateTime(sunrise, sunset) {
    // Add date and time
  var d = new Date()
  var day_night
  if (Number(d) >= Number(sunrise) && Number(d) <  Number(sunset)) {
      // it's daytime
      day_night = 'Daytime';
      d_n = 'd';
      day_night_background = 'skyblue';
  }
  else if (Number(d) < Number(sunrise) || Number(d) >= Number(sunset)) {
      //it's nighttime
      day_night = 'Night time';
      d_n = 'n';
      day_night_background = 'midnightblue';
  }
    
  var dateDiv = createDiv("Date and Time: " + d + " (" + day_night + ")");
}

function cloud(num) {
  var c = 0;
  w = getWidths();
  h = getHeights();
  while (c <= num) {
      fill('whitesmoke')
      //noStroke(0);
      rect(w[c]+2,h[c]-6.5,55,13.5,0,0,0,0)
      arc(w[c]+15,h[c], 30, 30, radians(149), radians(0)); // left
      arc(w[c]+30,h[c]-15, 30, 30, radians(190), radians(189)); // middle
      arc(w[c]+45,h[c], 30, 30, radians(230), radians(31)); // right
      c++;
  }
}

function getHeights() {
    return [236,427,46,602,454,316,280,272,537,427,464,326,431,73,421,112,217,278,82,420,550,21,193,313,203,206,560,409,530,379,84,341,83,437,480,384,154,4,288,599,497,417,521,172,480,84,59,585,421,82,218,135,386,85,362,95,351,567,134,301,55,195,394,192,267,415,529,52,57,394,152,419,247,131,559,158,550,364,572,581,580,438,222,76,53,140,507,509,159,350,333,409,493,473,540,245,41,206,304,427]
}

function getWidths() {
    return [329,261,164,460,52,309,269,567,233,107,83,430,293,70,418,447,164,231,574,520,328,137,212,163,505,61,387,156,487,161,160,469,582,47,533,168,373,93,601,320,68,105,523,600,489,141,207,329,207,575,216,430,19,338,55,58,88,514,76,524,103,156,318,406,378,418,146,39,332,61,295,39,243,446,554,571,303,480,452,519,380,479,309,242,496,25,207,6,580,471,14,142,607,506,114,309,121,248,175,567]
}