import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProfileResponse } from '../interfaces/profile.type';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);

  baseUrl = 'https://api.github.com/';

  getProfile() {
    return this.http.get<ProfileResponse['items']>(`${this.baseUrl}users`);
  }

  getSearchProfile(query: string) {
    return this.http.get<ProfileResponse>(
      `${this.baseUrl}search/users?q=${query}`,
    );
  }
}
