import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionProgressService } from 'services';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-sending-post-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sending-post-loader.component.html',
  styleUrls: ['./sending-post-loader.component.css'],
})
export class SendingPostLoaderComponent implements OnInit {
  loading$!: Observable<boolean>;

  constructor(private actionProgressService: ActionProgressService) {}

  ngOnInit(): void {
    this.loading$ =
      this.actionProgressService.toggleSendingPostLoaderObservable;
  }
}
