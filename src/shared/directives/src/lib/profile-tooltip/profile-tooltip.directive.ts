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
import { UserService } from 'services';
import { SimpleUserInfoType, UserSummaryInfo } from 'utils';

@Directive({
  selector: '[libProfileTooltip]',
  standalone: true,
})
export class ProfileTooltipDirective {
  @Input() authorInfo!: SimpleUserInfoType;
  authorSummaryInfo!: UserSummaryInfo;
  private profileTooltip!: ComponentRef<ProfileTooltipComponent>;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userservice: UserService,
    private containerRef: ViewContainerRef
  ) {}

  @HostListener('mouseenter') showAuthorInfo() {
    const sub = this.userservice
      .fetchUserSummaryInfo(this.authorInfo.username)
      .subscribe((response: any) => {
        this.authorSummaryInfo = response.data;
        this.createTooltip();
        sub.unsubscribe();
      });
  }

  @HostListener('mouseleave') destroyTooltip() {
    if (this.profileTooltip) {
      this.profileTooltip.destroy();
    }
  }

  createTooltip() {
    this.profileTooltip = this.containerRef.createComponent(
      ProfileTooltipComponent
    );
    this.profileTooltip.instance.authorInfo = this.authorSummaryInfo;
    this.renderer.appendChild(
      this.el.nativeElement,
      this.profileTooltip.location.nativeElement
    );
  }
}
