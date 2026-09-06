import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryCreate } from '../../core/models/category.model';
import { CategoryDialog, CategoryDialogData } from './category-dialog';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  newSubCategoryName: Record<number, string> = {};

  constructor(
    private readonly categoryService: CategoryService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get incomeCategories(): Category[] {
    return this.categories().filter((c) => c.type === 'Income');
  }

  get expenseCategories(): Category[] {
    return this.categories().filter((c) => c.type === 'Expense');
  }

  addCategory(defaultType: 'Income' | 'Expense'): void {
    const ref = this.dialog.open<CategoryDialog, CategoryDialogData, CategoryCreate>(CategoryDialog, {
      width: '380px',
      maxWidth: '95vw',
      data: { category: null, defaultType },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.categoryService.create(result).subscribe(() => this.load());
    });
  }

  editCategory(category: Category): void {
    const ref = this.dialog.open<CategoryDialog, CategoryDialogData, CategoryCreate>(CategoryDialog, {
      width: '380px',
      maxWidth: '95vw',
      data: { category, defaultType: category.type },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.categoryService.update(category.id, result).subscribe(() => this.load());
    });
  }

  deleteCategory(category: Category): void {
    if (!confirm(`Delete category "${category.name}"? This only works if it has no transactions.`)) return;
    this.categoryService.delete(category.id).subscribe({
      next: () => this.load(),
      error: () => alert('Could not delete this category — it may still have transactions linked to it.'),
    });
  }

  addSubCategory(category: Category): void {
    const name = (this.newSubCategoryName[category.id] || '').trim();
    if (!name) return;
    this.categoryService.createSubCategory(category.id, name).subscribe(() => {
      this.newSubCategoryName[category.id] = '';
      this.load();
    });
  }

  deleteSubCategory(subCategoryId: number): void {
    if (!confirm('Delete this sub-category? This only works if it has no transactions.')) return;
    this.categoryService.deleteSubCategory(subCategoryId).subscribe({
      next: () => this.load(),
      error: () => alert('Could not delete this sub-category — it may still have transactions linked to it.'),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
