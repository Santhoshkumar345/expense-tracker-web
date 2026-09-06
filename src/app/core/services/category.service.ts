import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryCreate, CategoryUpdate, SubCategory } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  create(dto: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, dto);
  }

  update(id: number, dto: CategoryUpdate): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createSubCategory(categoryId: number, name: string): Observable<SubCategory> {
    return this.http.post<SubCategory>(`${this.baseUrl}/${categoryId}/subcategories`, { name });
  }

  deleteSubCategory(subCategoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subcategories/${subCategoryId}`);
  }
}
