import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  nombreUtilisateurs: number = 0;
  nombreSites: number = 0;
  nombreBarrages: number = 0;


  ngOnInit(): void {
   
  }
}
