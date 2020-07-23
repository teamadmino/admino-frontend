import { DecimalPipe, CurrencyPipe, DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable()
export class FormatService {
  constructor(private decimalPipe: DecimalPipe, private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {}

  format(value, format: string) {
    if (format === undefined) {
      return value;
    } else {
      const split = format.split(":");
      const type = split[0];

      if (type === "number") {
        const formatDef = split[1];
        const locale = split[2] ? split[2] : null;
        return this.decimalPipe.transform(value, formatDef, locale);
      } else if (type === "date") {
        const formatDef = split[1];
        // const timezone = split[2] ? split[2] : null;
        const locale = split[2] ? split[2] : null;
        return this.datePipe.transform(value, formatDef, "", locale);
      } else if (type === "currency") {
        const formatDef = split[1];
        const locale = split[2] ? split[2] : null;
        return this.currencyPipe.transform(value, formatDef, locale);
      } else {
        return value;
      }
    }
  }
}
