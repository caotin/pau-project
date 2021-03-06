import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Feedback } from '../core/model/feedback';
import { Router } from '@angular/router';
import { FeedbackService } from '../core/service/feedback.service';
import { Location } from '@angular/common';
@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackComponent implements OnInit {
    private feedback: Feedback[];
    private feedbacks: Feedback;
    limit: number;
    numberOfBooks: number;
    page: number = 1;
    filter: Feedback = new Feedback();
    pagesIndex = [];
    maxpage: number = 0;
    max: number = 0;

    constructor(private feedbackService: FeedbackService,
        private _router: Router,
        private location: Location,
        private ref: ChangeDetectorRef) { }

    ngOnInit() {
        this.feedbacks = this.feedbackService.getter();
        this.init();
    }
    load() {
        location.reload();
    }
    processForm() {
        this.feedbacks.image = 'https://www.freeiconspng.com/uploads/feedback-icon-31.png';
        if (this.feedbacks.idFeedback == undefined) {
            this.feedbackService.createFeedback(this.feedbacks).subscribe((feedbacks) => {
                console.log(feedbacks);
                this.init();
                this.load();
                // this.router.navigate(['/table-class']);

                this.clear();
            }, (error) => {
                console.log(error);
            });
        } else {
            this.feedbackService.updateFeedback(this.feedbacks).subscribe((feedbacks) => {
                console.log(feedbacks);
                this.init();
                // this.router.navigate(['/table-class']);
                this.load();
                this.clear();
            }, (error) => {
                console.log(error);
            });
        }
    }
    // update
    updateFeedback(feedback) {
        let answer = confirm('Bạn Muốn Sửa ?');
        if (answer) {
            this.feedbacks.idFeedback = feedback.idFeedback;
            this.feedbacks.fullName = feedback.fullName;
            this.feedbacks.image = feedback.image;
            this.feedbacks.message = feedback.message;
        } else {
            // some code
            console.log('end');
        }
        // this.feedbackService.setter(feedback);

    }
    // getdata
    init() {
        this.feedbackService.getFeedback().subscribe((data) => {
            console.log(data);
            this.feedback = data;
            this.numberOfBooks = this.feedback.length;
            this.limit = 6;
            if (this.numberOfBooks < this.limit) {
                this.maxpage = 1;
            } else if (this.numberOfBooks % 6 == 0) {
                this.maxpage = (this.numberOfBooks / 6);
            } else {
                this.maxpage = ((this.numberOfBooks % 6) / (this.numberOfBooks % 6)) + (this.numberOfBooks / 6);
            }
            // cover number
            this.max = Math.floor(this.maxpage);
            // push item page
            for (let i = 1; i <= this.max; i++) {
                this.pagesIndex.push(i);
            }
        }, (error) => {
            console.log(error);
        });
        setInterval(() => {
            this.ref.markForCheck();
        }, 100);
    }
    // delete
    deleteFeedback(feedback) {
        let answer = confirm('Bạn Muốn Xóa ?');
        if (answer) {
            this.feedbackService.deleteFeedback(feedback.idFeedback).subscribe((data) => {
                this.feedback.splice(this.feedback.indexOf(feedback), 1);
                this.load();
            }, (error) => {
                console.log(error);
            });
        } else {
            // some code
            console.log('end');
        }

    }
    // prevpage
    prevPage() {
        this.page--;
    }
    // nextpage
    nextPage() {
        this.page++;
    }
    // set page
    setPage(pagenumber: number) {
        this.page = pagenumber;
    }
    // clear input
    clear() {
        this.feedbacks.idFeedback = null;
        this.feedbacks.fullName = '';
        this.feedbacks.image = '';
        this.feedbacks.message = '';

    }
}
