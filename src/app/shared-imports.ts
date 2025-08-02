import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const SHARED_IMPORTS = importProvidersFrom(
  HttpClientModule,
  FormsModule,
  CommonModule
);
