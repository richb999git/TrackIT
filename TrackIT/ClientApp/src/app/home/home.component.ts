import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor(private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "url('/assets/images/email-pattern-green2.png')";
    }
}
