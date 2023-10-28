import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionProgressService } from 'services';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-action-in-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-in-progress.component.html',
  styleUrls: ['./action-in-progress.component.scss'],
})
export class ActionInProgressComponent implements OnInit {
  actionState$!: Observable<boolean>;

  constructor(private actionProgessService: ActionProgressService) {}

  ngOnInit(): void {
    this.actionState$ = this.actionProgessService.toggleActionObservable;
  }
}
