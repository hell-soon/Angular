import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { Profile, ProfileResponse } from '../../data/interfaces/profile.type';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProfileCardComponent, FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  profileService = inject(ProfileService);

  profiles: Profile[] = [];

  query = '';

  querySubject = new Subject<string>();
  buttonSubject = new Subject<string>();

  constructor() {
    this.profileService.getProfile().subscribe((data) => {
      this.updateProfiles(data);

      this.searchProfile(600, this.querySubject);
      this.searchProfile(0, this.buttonSubject);
    });
  }

  onQueryChange(query: string) {
    this.querySubject.next(query);
  }

  updateQuery(query: string) {
    this.profiles = [];
    this.buttonSubject.next(query);
  }

  private updateProfiles(data: ProfileResponse | Profile[]) {
    if ('items' in data) {
      this.profiles = data.items;
    } else {
      this.profiles = data;
    }
  }

  private searchProfile(delay: number, subject: Subject<string>) {
    subject
      .pipe(
        debounceTime(delay),
        switchMap((query) =>
          query
            ? this.profileService.getSearchProfile(query)
            : this.profileService.getProfile(),
        ),
      )
      .subscribe((data) => {
        this.updateProfiles(data);
      });
  }
}
