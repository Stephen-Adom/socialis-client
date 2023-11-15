import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MentionConfig,
  MentionDirective,
  MentionModule,
} from 'angular-mentions';
import { format } from 'date-fns';
import { AppState, getAllAuthUserFollowing } from 'state';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';

type userMentionType = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  imageUrl: string;
  totalPost: number;
  followers: number;
  following: number;
  createdAt: string;
};

@Component({
  selector: 'lib-textarea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MentionModule],
  templateUrl: './textarea-form.component.html',
  styleUrls: ['./textarea-form.component.css'],
})
export class TextareaFormComponent implements OnInit, OnDestroy {
  @ViewChild(MentionDirective) mentionDirective!: MentionDirective;
  @ViewChild('textArea') textArea!: ElementRef<any>;
  @Input({ required: true }) Form!: FormGroup;
  mentionConfig!: MentionConfig;
  authUserFollowingSubscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.authUserFollowingSubscription = this.store
      .select(getAllAuthUserFollowing)
      .pipe(
        map((allfollowings) => {
          return allfollowings.map((following) => {
            return {
              id: following.id,
              firstname: following.firstname,
              lastname: following.lastname,
              username: following.username,
              imageUrl: following.imageUrl,
              totalPost: following.totalPost,
              followers: following.followers,
              following: following.following,
              createdAt: following.createdAt,
            };
          });
        })
      )
      .subscribe((users) => {
        this.mentionConfig = {
          triggerChar: '@',
          labelKey: 'username',
          items: users,
          mentionSelect: (item: userMentionType, triggerChar?: string) =>
            triggerChar + item.username + ' ',
          mentionFilter: (searchString: string, items: userMentionType[]) => {
            if (searchString) {
              return items.filter((item: userMentionType) =>
                item.username.toLowerCase().includes(searchString)
              );
            }

            return items;
          },
        };
      });
  }

  handleKeyDown(event: KeyboardEvent) {
    console.log(event);
    if (event.key === 'Escape') {
      console.log('escape pressed');
      this.hideMentionList();
    }

    if (
      event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft' ||
      event.key === 'Backspace'
    ) {
      this.isCursorNextToUsername();
    }
  }

  showMentionList() {
    const textarea: HTMLTextAreaElement = this.textArea.nativeElement;
    this.mentionDirective.mentionConfig.labelKey = 'username';
    // mentionList.removeAttribute('hidden');
    this.mentionDirective.updateConfig();
  }

  hideMentionList() {
    const mentionList = this.document.documentElement.querySelector(
      '.scrollable-menu'
    ) as HTMLDivElement;

    this.mentionDirective.stopSearch();
    // mentionList.setAttribute('hidden', 'true');
  }

  isCursorNextToUsername() {
    const textarea: HTMLTextAreaElement = this.textArea.nativeElement;
    const cursorPosition = textarea.selectionStart;
    console.log(cursorPosition, 'cursorPosition');

    // Get the text content of the textarea
    const text = textarea.value;
    const textArray = text.substring(0, cursorPosition).split(' ');
    const textWithCursor =
      textArray.length === 1 ? textArray[0] : textArray[textArray.length - 1];

    if (textWithCursor.includes('@')) {
      this.mentionConfig.labelKey = 'username';
      this.mentionDirective.showSearchList(this.textArea.nativeElement);
      text.replace(textWithCursor, textWithCursor);
      // console.log(.substring(0, cursorPosition));
      // this.showMentionList();
    } else {
      this.hideMentionList();
    }
  }

  formatCreatedAt(createdAt: string) {
    return format(new Date(createdAt), 'MMMM, yyyy');
  }

  ngOnDestroy(): void {
    this.authUserFollowingSubscription.unsubscribe();
  }
}
