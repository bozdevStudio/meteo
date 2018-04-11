import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  'rxjs/add/operator/map' ;



@Injectable()
export class WeatherProvider {
	apiKey = '39be540416f3eb21' ;
	url ;
  bozServer;

  constructor(public http: HttpClient) {
    console.log('Hello WeatherProvider Provider');
    this.url = 'http://api.wunderground.com/api/'+this.apiKey+'/conditions/q';
    this.bozServer = 'http://www.bozdev.com/meteo/'
  }


  getWeather(city, state) {


  	return this.http.get(this.url+'/'+state+'/'+city+'.json')
  	.map(res => res );


  }

  getBozWeather(city) {

    let dtime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let result = this.checkEntry(city,dtime);

    let check = JSON.stringify(result).length;


    if (result == null) {
      //result = null;
      return result;
    }
      else

      return result;



  }

  getList(){

     return this.http.get(this.bozServer+'town_list.php')
    .map(res => res );

  }


   checkEntry(city,datetime){

     return this.http.get(this.bozServer+'check.php?q='+city+'&dtime='+datetime)
    .map(res => res );

   }

   insertEntry(x_weather) {



     let city = x_weather.city;
     let condition = x_weather.translate_cond;
     let temp_c = x_weather.temp_c;
     let humidity = x_weather.humidity;
     let speed = x_weather.wind_speed;
     let icon = x_weather.icon;
     let heat = x_weather.heat;
     let direction = x_weather.direction;
     let d_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

     let result = this.http.get(this.bozServer+'insert_entry.php?q='+city+'&dtime='+d_time+'&condition='+condition+'&temp='+temp_c+'&humidity='+humidity+'&speed='+speed+'&icon='+icon+'&heat='+heat+'&direction='+direction)
     .map(res => res);


     return result;



   }

   checkEntries() {

   return this.http.get(this.bozServer+'check_entries.php').map(res => res);


   }


}
