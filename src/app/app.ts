import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'booksapp';
  readonly APIUrl="http://localhost:5038/api/books/";

  bookForm!: FormGroup;
  books: any = [];

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.refreshBooks();
  }

  createForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required]],
      author: ['', Validators.required],
      year: ['', [Validators.required]]
    });
  }

  refreshBooks() {
    this.http.get(this.APIUrl + 'GetBooks').subscribe(data => {
      this.books = data;
    });
  }

  submitBook() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append("title", this.bookForm.value.title);
    formData.append("description", this.bookForm.value.description);
    formData.append("price", this.bookForm.value.price.toString());
    formData.append("author", this.bookForm.value.author);
    formData.append("year", this.bookForm.value.year.toString());

    this.http.post(this.APIUrl + 'AddBook', formData).subscribe(data => {
      alert(data);
      this.resetForm();
      this.refreshBooks();
    });
  }

  resetForm() {
    this.bookForm.reset();
  }

  deleteBook(id: any) {
    if (confirm("Are you sure you want to delete this book?")) {
      this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(data => {
        alert(data);
        this.refreshBooks();
      });
    }
  }
}
