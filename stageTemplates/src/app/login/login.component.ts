import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthModel } from '../models/authmodel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authmodel = new AuthModel();
  errorMessage: string | null = null;  // Add this line

  constructor(private authService: AuthService, private router: Router) {}

  login(authmodel: AuthModel) {
    this.authService.login(authmodel).subscribe(
      (response: any) => {
        const token = response.accessToken;
        const expiration = response.expiration;
        const utilisateurconnecte = response.utilisateurConnecte;
        
        localStorage.setItem('utilisateurconnecte', JSON.stringify(utilisateurconnecte));
        localStorage.setItem('authToken', token);
        
        this.router.navigate(['/listAgences']);
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';  // Set error message
      }
    );
  }
}
