import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherProvider } from '../../providers/weather/weather' ;
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	weather: any;
  temp_weather : any;
  final_city : string;
  humidity : string;
  direction : string;
  wind_speed : string;
  raw_speed : string;
  heat_inf : string;
  heat_sup : string;
  temp_c : string;
  condition_translate : string;
  icon_url : string;
	location:{
		city:string ,
		state: string
	}
   weather_to_send:  string;

   temp_w_to_send: string;
   nbr : any;


  constructor(public navCtrl: NavController,
   private weatherProvider: WeatherProvider,
   public storage: Storage ) {

    this.weather_to_send = '';
    this.temp_w_to_send = '';

    // this.location = {
    //   city: 'Abidjan',
    //   state:''
    
    // }

  }





  ionViewWillEnter() {

  	this.storage.get('location').then( (val) =>{

  		if (val != null) {
			
			this.location = JSON.parse(val);

		}

  		else {
  		
  		this.location = {
  		city: 'Abidjan',
  		state:'CI'
  	
  	}

  		}
        // let see = this.weatherProvider.getBozWeather(this.location.city).subscribe(res => res);
        // this.weather = see;
        // let temp = JSON.stringify(this.weather);

       this.weatherProvider.getBozWeather(this.location.city)
       .subscribe( weather => {
       this.weather = weather;
       this.fill_Bozweather();        
      });


        
  	});

      let nbr = this.weatherProvider.checkEntries().subscribe(res => { 

        this.nbr = res;
        this.nbr = this.nbr.nbr;

      });

      let nbr_check = parseInt(this.nbr);

    if ( nbr_check > 9 )
      console.log("Base données à jour");

    else {

     // alert('Nous pouvons envoyer');
      //  this.insert_weather('Abidjan','CI');
      // this.insert_weather('Yamoussoukro','CI');
      // this.insert_weather('Dabou','CI');
      // this.insert_weather('Grand-Bassam','CI');
      // this.insert_weather('San_Pedro','CI');
      // this.insert_weather('Man','CI');
      // this.insert_weather('Dabou');
      // this.insert_weather('Bingerville','CI');
      // this.insert_weather('Korhogo','CI');
      // this.insert_weather('Lakota','CI');
      // this.insert_weather('Anyama','CI');



    }





  }


  no_entry(){

    this.weatherProvider.getWeather(this.location.city,this.location.state)
    .subscribe( weather => {
      this.weather = weather;
      this.weather = this.weather.current_observation;
      console.log(weather);
      this.fill_text();
      this.fill_w_to_send(this.weather);
      let test = this.weatherProvider.insertEntry(JSON.parse(this.weather_to_send)).subscribe(res => res);
      //alert(JSON.stringify(test));


            

      });


  }


  fill_Bozweather() {

    
    

    var temp = JSON.stringify(this.weather);

    if (temp.length == 13) {
      this.no_entry();
      return null;
    }

    temp = temp.substring(1,temp.length - 1);

    this.weather = JSON.parse(temp);

    //alert(this.humidity);

    //City
    this.final_city = this.weather.station_name;
    //Humidity 
    this.humidity = this.humidity_format(this.weather.humidity,1);

    //Temp
    this.temp_c = this.weather.temp_c;

    //Direction 
    this.direction = this.direction_format(this.weather.direction);

    //Speed
    this.wind_speed = this.speed_format(this.weather.wind_speed);
    this.raw_speed = this.weather.wind_speed;

    //Heat
    this.heat_inf = this.weather.heat_index_c;
    this.heat_sup = Math.ceil(parseInt(this.weather.heat_index_c) * 1.24).toString();

    //Translate
    this.condition_translate = this.weather.ts_condition;


    //Icon
    this.icon_url = this.weather.icon;





  }


  insert_weather(city,state) {

     this.weatherProvider.getWeather(city,state)
    .subscribe( weather => {
      this.temp_weather = weather;
      this.temp_weather = this.temp_weather.current_observation;
      //console.log(weather);
      this.format_to_db(this.temp_weather,city);
      //this.weatherProvider.insertEntry(JSON.parse(this.temp_w_to_send));
      let test = this.weatherProvider.insertEntry(JSON.parse(this.temp_w_to_send)).subscribe(res => res);


            

      });



  }


  format_to_db(weather_var,city_raw) {


    let direction;
    let heat;
    let humidity;
    let temp_c ;
    let wind_speed ;
    let translate_cond ;
    let icon;


    if (weather_var.wind_dir == null) {
      direction = ''
    }
    else
      direction =this.direction_format(weather_var.wind_dir);

      heat = weather_var.heat_index_c;

      humidity = weather_var.relative_humidity;


      temp_c = weather_var.temp_c;

      wind_speed = weather_var.wind_kph;

    if (this.translate_tx(weather_var.weather) == '') {
      translate_cond = '';
    }
    else
      translate_cond = this.translate_tx(weather_var.weather);

    //Icon
    icon = weather_var.icon_url;

    this.temp_w_to_send = '{ "city":"'+city_raw+'", "direction":"'+direction+'", "heat":"'+heat+'", "humidity":"'+humidity+'", "temp_c":"'+temp_c+'", "wind_speed":"'+wind_speed+'", "icon":"'+icon+'", "translate_cond":"'+translate_cond+'"}' ;

    //alert(this.temp_w_to_send);

  }


  fill_text() {

    //alert(JSON.stringify(this.weather));

    let humidity_val = this.humidity_format(this.weather.relative_humidity,0);
    let direction_val = this.weather.wind_dir;
    let wind_mph_val = this.weather.wind_kph;
    let heat_val = this.weather.heat_index_c;
    let to_translate = this.weather.weather;

    //City
    this.final_city = this.weather.display_location.city;
    //Humidity 
    this.humidity = humidity_val;

    //Temp
    this.temp_c = this.weather.temp_c;

    //Direction 
    this.direction = this.direction_format(direction_val);

    //Speed
    this.wind_speed = this.speed_format(wind_mph_val);
    this.raw_speed = this.weather.wind_speed;

    //Heat
    this.heat_inf = heat_val;
    this.heat_sup = Math.ceil(parseInt(this.weather.heat_index_c) * 1.24).toString();

    //Translate
    this.condition_translate = this.translate_tx(to_translate);

    //Icon
    this.icon_url = this.weather.icon_url;




  }

  fill_w_to_send(weather_fill) {



    let direction;
    let heat;
    let humidity;
    let temp_c ;
    let wind_speed ;
    let translate_cond ;
    let icon;


    if (weather_fill.wind_dir == null) {
      direction = ''
    }
    else
      direction = this.direction_format(weather_fill.wind_dir);

      heat = weather_fill.heat_index_c;


      humidity = weather_fill.relative_humidity;

    if (weather_fill.temp_c == null) {
      temp_c = '';
    }
    else
      temp_c = weather_fill.temp_c;

      wind_speed = weather_fill.wind_kph;

    if (this.translate_tx(weather_fill.weather) == '') {
      translate_cond = '';
    }
    else
      translate_cond = this.translate_tx(weather_fill.weather);


    //Icon
    icon = weather_fill.icon_url;

    this.weather_to_send = '{ "city":"'+this.location.city+'", "direction":"'+direction+'", "heat":"'+heat+'", "humidity":"'+humidity+'", "temp_c":"'+temp_c+'", "wind_speed":"'+wind_speed+'", "icon":"'+icon+'", "translate_cond":"'+translate_cond+'"}' ;


    //alert(this.weather_to_send);


  }


humidity_format(ab,boz) {


    let final_result : string;

    if (ab == null) {
      final_result = '';
      return final_result;
    }


        if (boz == '1')
            ab = ab + '%';
        

      let index = ab.indexOf('%');

      if (index != -1) {

      let result = ab.substr(0,index);

        if (result < '35') {
      final_result = "L'air est sec et difficile à respirer, evitez les mouvements brusques et essayer de rester à l'ombre " ;
    }

        if ((result > '35') && (result < '65') ) {
      final_result = "L'air est doux et facile à respirer, idéal pour se promener et profiter des légères brises qui vous caresserons le visage";
    }


        if (result > '65') {
      final_result = "L'air est humide et agréable à vivre et à respirer, idéal pour rester chez soi et sentir ce vent vent berçer vos envies" ;
    }


        if (result >= '95') {
      final_result = "Risque de pluie très élevé restez couvert et pensez à vous abriter" ;
    }

    return final_result;
  }

}

direction_format(dir){
  
  let result = '';
  
  if (dir == null) {
    return result;
  }

  

  for (let i = 0; i <= dir.length ; i++) {
    

    if (dir.charAt(i) == 'N') {
      //init
      if (i == 0) 
      result += 'Nord';
      else
      result += '-Nord';

    }

        if (dir.charAt(i) == 'S') {
           //Init
           if (i == 0) 
           result += 'Sud'; 
            else
          result += '-Sud';
      
    }


        if (dir.charAt(i) == 'W') {
          //Init
           if (i == 0) 
           result += 'Ouest';
           else
          result += '-Ouest';
      
    }


        if (dir.charAt(i) == 'E') {
           //Init
           if (i == 0) 
           result += 'Est';
           else
          result += '-Est';
      
    }



} 

return result;

}

speed_format(wind){


  
  let result;

   if (wind == null) {
   
      result = '';
      return result;
   
    }

   let to_kmh = parseInt(wind);

  if (to_kmh <= 5 ) {
    result = 'Vent calme, vent paisible';
    return result;
    
  }

    if ((to_kmh > 5) && (11 > to_kmh) ) {
    result = 'Vent présent caractérisé par de légères brises; le sens du vent du vent est révelé par la direction de la fumée';
    return result;
  }


    if ((to_kmh >= 11)  && (19 > to_kmh)) {
    result = 'Vent agréable, on le ressent sur le visage, on le sent passer, on sent les feuilles bouger';
    return result;
  }



    if ((to_kmh >= 19)  && (28 > to_kmh)) {
    result = 'Belle brise capable de soulever la poussière, les papiers, un vent légèrement agité et remarquable';
    return result;
  }




}

heat_format(heat){

let result = "Tempretature ressentie par le corps  <strong>A l'ombre :</strong>"+heat+"  <strong>Au soleil :</strong> "+parseInt(heat )* 1.24+"  ";

return result;

}


translate_tx(text){

  if (text == null) {
    let nothing = '';
    return nothing;
  }

  let concat = text.replace(/\s/g,'');


  let trans_tab = {

    Drizzle : 'Pluie fine',
    Rain: 'Pluie',
    PartlyCloudy: 'Partiellement nuageux',
    Clear: 'Ciel clair',
    Snow: 'Neige',
    SnowGrains: 'Grains de neige',
    Icecrystals: 'Cristaux de glace',
    IcePellets: 'Granules de glace',
    Hail: 'Grêle',
    Mist: 'Brouillard',
    Fog: 'Brume de brouillard',
    FogPatches: 'Patchs de brouillard',
    Smoke: 'Fumée',
    VolcanicAsh: 'Cendre volcanique',
    WidespreadDust: 'Poussière généralisée',
    Sand: 'Temps ensablé',
    Haze: 'Vapeur légère',
    Spray: 'La grêle',
    DustWhirls: 'Tourbillons de poussière',
    Sandstorm: 'Tempête de sable',
    LowDriftingSnow: 'Neige à faible dérive',
    LowDriftingWidespreadDust: 'Faible dérive de poussière',
    LowDriftingSand: 'Sable à faible dérive',
    BlowingSnow: 'Poudrerie',
    BlowingWidespreadDust: 'Souffler la poussière',
    BlowingSand: 'Souffler du sable',
    RainMist: 'Brume de pluie',
    RainShowers: 'Averses de pluie',
    SnowShowers: 'Averses de neige',
    SnowBlowingSnowMist: 'Brume de neige',
    IcePelletShowers: 'Douche à pellets',
    HailShowers: 'Douches de grêle',
    SmallHallShowers: 'Petites averses de grêle',
    Thunderstorm: 'Orage',
    ThunderstormsandRain: 'Pluie et orage',
    ThunderstormsandSnow: 'Neige et orage',
    ThunderstormsandIcePellets: 'Douche à pellets et orage',
    ThunderstormswithHail: 'Grêle et douche à pellets',
    ThunderstormswithSmallHail: 'Petite grêle et orage',
    FreezingDrizzle: 'Brune verglaçante',
    Freezingrain : 'Pluie verglaçante',
    FreezingFog: 'Brouillard givrant',
    PatchesofFog: 'Patchs de brume de brouillard',
    ShallowFog: 'Léger brouillard',
    PartialFog: 'Brouillard partiel',
    Overcast: 'Temps couvert',
    MostlyCloudy: 'Temps nuageux',
    ScatteredClouds: 'Nuages dispersés',
    SmallHail: 'Grêle légère',
    Squalls: 'Orages',
    FunnelCloud: 'Nuage en entonnoir',
    UnknownPrecipitation: 'Précipitation inconnue'



  }


  return trans_tab[concat];

}



}
