import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

    @Input() totalPages: number; // used in HTML
    @Input() pageIndex: number; // used in HTML
    @Input() pagesBefore: Array<number> = []; // used in HTML
    @Input() pagesAfter: Array<number> = []; // used in HTML

    @Output() pageChanged: EventEmitter<number> = new EventEmitter();


    constructor() { }

    ngOnInit() {
    }

    goToPage(page) {
        this.pageChanged.emit(page);
    }

}
// Just need to put the pagination method in the calling class so it can call it and set the variables and call setPagination() when required
// You can use ViewChild instead:
//      @ViewChild(PaginationComponent, { static: false }) private myChild: PaginationComponent;
// and then call the setPagination() method but myChild is not available until ngAfterViewInit life cycle hook so can't be used in ngOnInit
// doesn't always get myChild though...also each pagination not updating correctly (only the first one on the page). Think I need to use a service
// but it's getting too complicated for the small gain (which isn't that clever anyway)

//setPagination(pageIndex: number, totalPages: number) {
//    this.pagesBefore2 = [];
//    this.pagesAfter2 = [];
//    for (var i = pageIndex - this.maxPagesEitherSide; i < pageIndex; i++) {
//        if (i > 0) this.pagesBefore2.push(i);
//    }
//    for (var i = (pageIndex + 1); i <= totalPages; i++) {
//        this.pagesAfter2.push(i);
//        if (i >= pageIndex + this.maxPagesEitherSide) break;
//    }
//}
//
// and also add in the variables:
// pagination properties:
//   private pageIndex: number = 1;
//   private pagesBefore: Array < number > =[];
//   private pagesAfter: Array < number > =[];
//   private maxPagesEitherSide: number = 4;
