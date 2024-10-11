import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { navbarDataII } from './nav-data2';
import { INavbarData } from './helper2';

interface AdminSideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav2',
  templateUrl: './sidenav2.component.html',
  styleUrls: ['./sidenav2.component.css']
})
export class Sidenav2Component implements OnInit {
  collapsed = false;
  @Output() onToggleSideNav: EventEmitter<AdminSideNavToggle> = new EventEmitter();
  screenWidth = 0;
  navDataII = navbarDataII;
  multiple: boolean = false;

  ngOnInit() {
    this.openSidenav();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = true;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  openSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navDataII) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }
}