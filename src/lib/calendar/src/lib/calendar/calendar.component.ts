import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { addDays } from 'date-fns';

@Component({
  selector: 'lib-calendar',
  standalone: true,
  imports: [CommonModule, DialogModule, CalendarModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @Input({ required: true }) visible = false;
  @Output() sendSelectedDate: EventEmitter<Date> = new EventEmitter();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter();
  date = new Date();
  minDate = addDays(new Date(), 1);

  onDateSelect(event: Date) {
    this.sendSelectedDate.emit(event);
  }

  onHide() {
    this.visible = false;
    this.modalHide.emit(false);
  }
}
