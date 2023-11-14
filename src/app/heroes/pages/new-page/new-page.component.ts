import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, switchMap } from 'rxjs';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css'],
})
export class NewPageComponent implements OnInit {
  public altImgRegex: RegExp = new RegExp(
    '^(https?|ftp):\\/\\/.*(jpeg|jpg|png|gif|bmp)$'
  );

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<string>(''),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>('', [
      Validators.pattern(this.altImgRegex),
    ]),
  });

  public publishers: string[] = ['DC Comics', 'Marvel Comics'];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');

        return this.heroForm.reset(hero);
      });
  }

  public get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    if (this.currentHero.id) {
      this.heroesService.updateHeroById(this.currentHero).subscribe((hero) => {
        this.showSnackBar(`${hero.superhero} updated!`);
      });

      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.showSnackBar(`${hero.superhero} created!`);
      this.router.navigate(['/heroes/edit', hero.id]);
    });
  }

  public onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required.');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((deleted: boolean) => deleted)
      )
      .subscribe(() => this.router.navigate(['/heroes']));

    /* dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.heroesService
        .deleteHeroById(this.currentHero.id)
        .subscribe((deleted) => {
          if (deleted) {
            this.router.navigate(['/heroes']);
          }
        });
    }); */
  }

  private showSnackBar(message: string): void {
    this.snackbar.open(message, 'Done', { duration: 3000 });
  }
}
