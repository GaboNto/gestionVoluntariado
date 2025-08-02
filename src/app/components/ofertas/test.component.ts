import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `<h1 style="color: green">Test cargado desde router</h1>`
})
export class TestComponent {}
