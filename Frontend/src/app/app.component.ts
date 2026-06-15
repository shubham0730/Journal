import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'journals-frontend';
  isLoading$ = this.loaderService.isLoading$;
  isDialogOpen$ = this.loaderService.isDialogOpen$;
  constructor(public  loaderService: LoaderService) {}
}
