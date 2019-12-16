import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.css']
})
export class ShowErrorsComponent implements OnInit {

    @Input() errors: any;
    private entries: any;

    constructor() { }

    ngOnInit() {
    }

    objectHasProperties(obj) {
        return Object.keys(obj).length > 0;
    }

    convertObjectToArray(obj) {
        this.entries = Object.entries(obj);
    }

}
