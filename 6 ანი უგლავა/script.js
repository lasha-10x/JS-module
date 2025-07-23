
const apiKey="2cfefa8cc7d0a0497af648250697a29f";
document.getElementById("cityInput").addEventListener("keydown",function(e){
    
     console.log("Key pressed:", e.key);
    if(e.key==="Enter"){
    const city=document.getElementById("cityInput").value.trim();
     if(city){
        getWeatherData(city);
       
     }else{
        alert("Please enter a city name");
     }
    }

});
async function getWeatherData(city){
  try{
   const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
   if(!response.ok){
      throw new Error("City not found");
    }
   const data=await response.json();
    displayWeather(data);
    console.log(data);
   }
  catch(error){
    alert("Error: " + error.message);
  }
}
function displayWeather(data){
    const{name:city,
         main:{temp,humidity,feels_like,pressure,temp_max,temp_min},
         weather:[{description,id}],
         wind,
         sys:{sunrise,sunset}
        }=data;
    document.getElementById("city").textContent=city;
    document.getElementById("temp").innerHTML=`${Math.round(temp)}&#8451;`;
    document.getElementById("feels").innerHTML=`${Math.round(feels_like)}&#8451;`;
    document.getElementById("high").innerHTML=`${Math.round(temp_max)}&#8451;`;
    document.getElementById("low").innerHTML=`${Math.round(temp_min)}&#8451;`;

    document.querySelector(".humidity").textContent=`Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent=`Wind: ${wind.speed} m/s`;
    document.querySelector(".pressure").textContent=`Pressure: ${pressure} hPa`;
    const rise=new Date(sunrise*1000).toLocaleTimeString();
    const set=new Date(sunset*1000).toLocaleTimeString();
    document.querySelector(".sunrise").textContent=`Sunrise: ${rise}`;
    document.querySelector(".sunset").textContent=`Sunset: ${set}`;

    

}
