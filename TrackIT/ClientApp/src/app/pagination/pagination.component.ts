import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

    @Input() totalPages: number;
    @Input() pageIndex: number;
    @Input() pagesBefore: Array<number> = [];
    @Input() pagesAfter: Array<number> = [];

    @Output() pageChanged: EventEmitter<number> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    goToPage(page) {
        this.pageChanged.emit(page);
    }
}
// Just need to put the pagination method in the calling class so it can call it and set the variables and call setPagination() when required
// May try to put it here and return the before and after arrays (in a new object?).
// Using @ViewChild("appPagination") child: PaginationComponent;
// this.child.setPagination();
//  which will return the new object or through an Output event emitter(s)?
//
//setPagination() {
//    this.pagesBefore = [];
//    this.pagesAfter = [];
//    for (var i = this.pageIndex - this.maxPagesEitherSide; i < this.pageIndex; i++) {
//        if (i > 0) this.pagesBefore.push(i);
//    }
//    for (var i = (this.pageIndex + 1); i <= this.totalPages; i++) {
//        this.pagesAfter.push(i);
//        if (i >= this.pageIndex + this.maxPagesEitherSide) break;
//    }
//}
