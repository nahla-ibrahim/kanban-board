import { Component, effect, ElementRef, output, signal, ViewChild } from '@angular/core';
import { ClickOutsideDirective } from "../../directives/click-outside";
import { form, required, Field, submit } from '@angular/forms/signals';
import { Title } from '../../models/board.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-new-list',
  imports: [ClickOutsideDirective, Field, FontAwesomeModule],
  templateUrl: './add-new-list.html',
  styleUrl: './add-new-list.css',
})
export class AddNewList {  
  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;

  faPlus= faPlus;
  addList = output<string>();
  showListTitleInput = signal<boolean>(false);
  newList = signal<Title>({
    title: ''
  });
  newListForm = form(this.newList, (schema) => {
    required(schema.title, {message : 'The title of list is required'})
  })

  setListTitleInput = (value: boolean, titleInput?: HTMLInputElement) => {
    this.showListTitleInput.set(value)
    if(titleInput) titleInput.focus()
  }

  addNewList = (e: Event) => {
    e.preventDefault();

    submit(this.newListForm, async() => {
      this.addList.emit(this.newList().title);
      this.setListTitleInput(false)
      this.newListForm().value.set({title: ''})
    })
  }

  constructor() {
    effect(() => {
      if (this.showListTitleInput()) {
        queueMicrotask(() => this.titleInput?.nativeElement?.focus());
      }
    });
  }
}