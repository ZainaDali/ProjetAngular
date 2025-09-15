import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 👉 importer RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 👉 l’ajouter dans imports
  template: `
    <div class="min-h-screen bg-gray-100 text-gray-800">
      <header class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">MediNotes 🩺</h1>
      </header>
      <main class="p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {}
