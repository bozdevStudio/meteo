import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherProvider } from '../../providers/weather/weather' ;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	villes : any;
	temp : any;

  constructor(public navCtrl: NavController,
  	private weatherProvider: WeatherProvider) {

  }


  ionViewWillEnter() {

  	this.weatherProvider.getList().subscribe(res => {

  		this.temp = res;
  		alert(JSON.stringify(res));

  		let taille = Object.keys(this.temp).length;

  		 // for (var i = 0; i <= taille-1 ; i++) {

  				this.villes = res;
  				//alert(JSON.stringify(this.villes));
  				alert(JSON.stringify(this.villes));


  			 // }


  });

}

}