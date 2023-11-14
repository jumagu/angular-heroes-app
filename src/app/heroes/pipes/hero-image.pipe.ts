import { Pipe, PipeTransform } from '@angular/core';

import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage',
})

export class HeroImagePipe implements PipeTransform {
  private altImgRegex: RegExp = new RegExp(
    '^(https?|ftp):\\/\\/.*(jpeg|jpg|png|gif|bmp)$'
  );

  transform(hero: Hero): string {
    if (!hero.id && !hero.alt_img) return 'assets/no-image.png';

    if (hero.alt_img === '') return 'assets/no-image.png';

    if (hero.alt_img && !this.altImgRegex.test(hero.alt_img)) return 'assets/no-image.png';

    if (hero.alt_img && this.altImgRegex.test(hero.alt_img)) return hero.alt_img;

    return `assets/heroes/${hero.id}.jpg`;
  }
}
