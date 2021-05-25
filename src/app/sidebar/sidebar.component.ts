import { Component } from '@angular/core';
import { TemporaryShellService } from '@shared/services/shell/shell.service';


@Component({
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styles: [
      `
        a:hover {
          cursor: pointer;
        }
      `
    ]
})

export class SidebarComponent {
    constructor(private shellService: TemporaryShellService) {
    }

    navigate(url: string) {
        this.shellService.navigate(url);
    }
}
