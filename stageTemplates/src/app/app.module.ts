import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListAgenceComponent } from './list-agence/list-agence.component';
import { ListSiteComponent } from './list-sites/list-sites.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CrudUserComponent } from './crud-user/crud-user.component';
import { SearchComponent } from './search/search.component';
import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { DetailBarrageComponent } from './detail-barrage/detail-barrage.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { DetailAgenceComponent } from './detail-agence/detail-agence.component';
import { EditSiteDialogComponent } from './edit-site-dialog/edit-site-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';
import { CrudGrandeurComponent } from './crud-grandeur/crud-grandeur.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { CommonModule } from '@angular/common';
import { CrudAgenceComponent } from './crud-agence/crud-agence.component';
import { AddAgenceDialogComponent } from './add-agence-dialog/add-agence-dialog.component';
import { EditAgenceDialogComponent } from './edit-agence-dialog/edit-agence-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { EditPropGrandeurDialogComponent } from './edit-prop-grandeur-dialog/edit-prop-grandeur-dialog.component';
import { Sidenav2Component } from './sidenav2/sidenav2.component';
import { CrudTypeGrandeurComponent } from './crud-type-grandeur/crud-type-grandeur.component';
import { AddPropGrandeurDialogComponent } from './add-prop-grandeur-dialog/add-prop-grandeur-dialog.component';
import { EditParamGrandeurDialogComponent } from './edit-param-grandeur-dialog/edit-param-grandeur-dialog.component';
import { AddTypeGrandeurDialogComponent } from './add-type-grandeur-dialog/add-type-grandeur-dialog.component';
import { CrudUserAdminComponent } from './crud-user-admin/crud-user-admin.component';
import { DeletingDialogComponent } from './deleting-dialog/deleting-dialog.component';
import { ExecuteMesureComponent } from './execute-mesure/execute-mesure.component';
import { AddMesureGrandeurDialogComponent } from './add-mesure-grandeur-dialog/add-mesure-grandeur-dialog.component';
import { EditMesureGrandeurDialogComponent } from './edit-mesure-grandeur-dialog/edit-mesure-grandeur-dialog.component';
import { CrudRoleComponent } from './crud-role/crud-role.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { CrudSiteComponent } from './crud-site/crud-site.component';
import { AddSiteDialogComponent } from './add-site-dialog/add-site-dialog.component';
import { MeasureGridComponent } from './measure-grid/measure-grid.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Graphe3DComponent } from './graphe3-d/graphe3-d.component'; // Assurez-vous que ce chemin est correct




















@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListAgenceComponent,
    ListSiteComponent,
    CrudUserComponent,
    SearchComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    StatisticsComponent,
    SettingsComponent,
    DetailBarrageComponent,
    AddUserDialogComponent,
    DetailUserComponent,
    DetailAgenceComponent,
    EditSiteDialogComponent,
    AddRoleDialogComponent,
    CrudGrandeurComponent,
    SublevelMenuComponent,
    CrudAgenceComponent,
    EditUserDialogComponent,
    EditPropGrandeurDialogComponent,
    AddAgenceDialogComponent,
    EditAgenceDialogComponent,
    EditUserDialogComponent,
    Sidenav2Component,
    CrudTypeGrandeurComponent,
    AddPropGrandeurDialogComponent,
    EditParamGrandeurDialogComponent,
    AddTypeGrandeurDialogComponent,
    CrudUserAdminComponent,
    DeletingDialogComponent,
    ExecuteMesureComponent,
    AddMesureGrandeurDialogComponent,
    EditMesureGrandeurDialogComponent,
    CrudRoleComponent,
    EditRoleDialogComponent,
    CrudSiteComponent,
    AddSiteDialogComponent,
    MeasureGridComponent,
    Graphe3DComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    CommonModule,
    BrowserModule,
    NgxPaginationModule,
    
 
    MatIconModule,
    MatTableModule,
    HighchartsChartModule

    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
