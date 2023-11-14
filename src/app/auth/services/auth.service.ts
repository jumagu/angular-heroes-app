import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { User } from '../interfaces/user.interface';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.apiUrl;
  private user?: User;

  constructor(private httpClient: HttpClient) {}

  public get currentUser(): User | undefined {
    if (!this.user) return undefined;

    return structuredClone(this.user);
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.httpClient
      .get<User[]>(`${this.baseUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map((user) => {
          if (user.length === 0) {
            return false;
          } else {
            this.user = user[0];
            localStorage.setItem('token', user[0].id.toString());
            return true;
          }
        }),
        catchError(() => of(false))
      );
  }

  public logout() {
    this.user = undefined;

    localStorage.clear();
  }

  public checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.httpClient.get<User>(`${this.baseUrl}/users/${token}`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!user),
      catchError(() => of(false))
    );
  }
}
