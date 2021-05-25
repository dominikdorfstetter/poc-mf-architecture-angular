import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalLogFactory } from '../../core/global-log/global-log.factory';

const globalLog = GlobalLogFactory.getInstance();

@Component({
  template: `
  <div class="card">

  <div class="header">
      <h2 class="title">Flight Search</h2>
  </div>
  <div class="content">


      <div class="form-group">
          <label>From:</label>
          <input name="from" class="form-control">
      </div>
      <div class="form-group">
          <label>To:</label>
          <input name="to" class="form-control">
      </div>

      <div class="form-group">
          <button
              class="btn btn-default" (click)="search()">Search</button>

          </div>

  </div>
  </div>
  `
})
export class Page1Component implements OnInit {

  constructor(private router: Router) { }

  public ngOnInit() {
    globalLog.emitInfo('client-a loaded');
  }

  control = new FormControl();

    async search() {
        await this.router.navigate(['.'], { queryParamsHandling: 'merge', queryParams: { id: 17 }});
        window.dispatchEvent(new CustomEvent('client-message', { detail: 17 }));
    }


}
