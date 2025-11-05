import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class EmptyStringsToUndefinedPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.normalize(value);
  }

  private normalize(value: any): any {
    if (value === '') return undefined;
    if (Array.isArray(value)) {
      return value.map(v => this.normalize(v));
    }
    if (value && typeof value === 'object') {
      const out: any = {};
      for (const key of Object.keys(value)) {
        out[key] = this.normalize(value[key]);
      }
      return out;
    }
    return value;
  }
}
