import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {Message} from '../../dtos/message';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  error: boolean = false;
  errorMessage: string = '';
  messageForm: FormGroup;
  // After first submission attempt, form validation will start
  submitted: boolean = false;
  private message: Message[];

  constructor(private messageService: MessageService, private ngbPaginationConfig: NgbPaginationConfig, private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef, private authenticationService: AuthenticationService) {
    this.messageForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      text: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadMessage();
  }

  /**
   * Returns true if the authenticated user is an admin
   */
  isAdmin(): boolean {
    return this.authenticationService.getUserRole() === 'ADMIN';
  }

  /**
   * Starts form validation and builds a message dto for sending a creation request if the form is valid.
   * If the procedure was successful, the form will be cleared.
   */
  addMessage() {
    this.submitted = true;
    if (this.messageForm.valid) {
      const message: Message = new Message(null,
        this.messageForm.controls.title.value,
        this.messageForm.controls.summary.value,
        this.messageForm.controls.text.value,
        new Date().toISOString()
      );
      this.createMessage(message);
      this.clearForm();
    } else {
      console.log('Invalid input');
    }
  }

  /**
   * Sends message creation request
   * @param message the message which should be created
   */
  createMessage(message: Message) {
    this.messageService.createMessage(message).subscribe(
      () => {
        this.loadMessage();
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }

  getMessage(): Message[] {
    return this.message;
  }

  /**
   * Shows the specified message details. If it is necessary, the details text will be loaded
   * @param id the id of the message which details should be shown
   */
  getMessageDetails(id: number) {
    if (_.isEmpty(this.message.find(x => x.id === id).text)) {
      this.loadMessageDetails(id);
    }
  }

  /**
   * Loads the text of message and update the existing array of message
   * @param id the id of the message which details should be loaded
   */
  loadMessageDetails(id: number) {
    this.messageService.getMessageById(id).subscribe(
      (message: Message) => {
        const result = this.message.find(x => x.id === id);
        result.text = message.text;
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }

  /**
   * Error flag will be deactivated, which clears the error message
   */
  vanishError() {
    this.error = false;
  }

  /**
   * Loads the specified page of message from the backend
   */
  private loadMessage() {
    // Backend pagination starts at page 0, therefore page must be reduced by 1
    this.messageService.getMessage().subscribe(
      (message: Message[]) => {
        this.message = message;
      },
      error => {
        this.defaultServiceErrorHandling(error);
      }
    );
  }


  private defaultServiceErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
  }

  private clearForm() {
    this.messageForm.reset();
    this.submitted = false;
  }

}
