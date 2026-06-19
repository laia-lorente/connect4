import { Component, inject } from '@angular/core';
import { WebsocketService } from './services/websocket';
import { LoginComponent } from './login/login';
import { GameComponent } from './game/game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected ws = inject(WebsocketService);
}