/* eslint-disable @nx/enforce-module-boundaries */
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ProfileTooltipComponent } from 'profile-tooltip';
import { Subscription } from 'rxjs';
import { UserService } from 'services';
import { SimpleUserInfoType, UserSummaryInfoFollowing } from 'utils';

@Directive({
  selector: '[libProfileTooltip]',
  standalone: true,
})
export class ProfileTooltipDirective {
  @Input() authorInfo!: SimpleUserInfoType;
  authorSummaryInfo!: UserSummaryInfoFollowing;
  private profileTooltip!: ComponentRef<ProfileTooltipComponent> | undefined;
  private isTooltipCreated = false;
  private subscription: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userservice: UserService,
    private containerRef: ViewContainerRef
  ) {}

  @HostListener('mouseenter') showAuthorInfo() {
    if (!this.isTooltipCreated) {
      this.subscription = this.userservice
        .fetchUserFullInformation(this.authorInfo.username)
        .subscribe((response: any) => {
          this.authorSummaryInfo = response.data;
          this.createTooltip();
          this.subscription?.unsubscribe();
        });
    }
  }

  @HostListener('mouseleave') destroyTooltip() {
    if (this.profileTooltip) {
      this.profileTooltip.destroy();
      this.profileTooltip = undefined;
    }
    this.isTooltipCreated = false;
  }

  createTooltip() {
    this.containerRef.clear();
    this.profileTooltip = this.containerRef.createComponent(
      ProfileTooltipComponent
    );
    this.profileTooltip.instance.authorFullInfo = this.authorSummaryInfo;
    this.renderer.appendChild(
      this.el.nativeElement,
      this.profileTooltip.location.nativeElement
    );
    this.isTooltipCreated = true;
  }
}
