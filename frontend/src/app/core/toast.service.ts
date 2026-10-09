import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal('');
  private timer?: ReturnType<typeof setTimeout>;

  show(text: string) {
    this.message.set(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(''), 1600);
  }
}
