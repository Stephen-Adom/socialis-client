/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryMediaType, UserInfoType } from 'utils';
import { AppState, getUserInformation } from 'state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-story-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-slide.component.html',
  styleUrls: ['./story-slide.component.css'],
})
export class StorySlideComponent implements OnInit {
  @Input({ required: true }) story!: StoryMediaType;
  @Input({ required: true }) activeIndex!: number | null;
  @Input({ required: true }) author!: string;
  @Output() watchedDialogvisibleEvent = new EventEmitter<StoryMediaType>();
  @Output() toggleWatchedDialog = new EventEmitter<boolean>();
  authUser$!: Observable<UserInfoType | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authUser$ = this.store.select(getUserInformation);
  }

  viewWatched(storymedia: StoryMediaType) {
    this.watchedDialogvisibleEvent.emit(storymedia);
    this.toggleWatchedDialog.emit(true);
  }
}
