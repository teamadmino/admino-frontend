import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminoConfig } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    configLoaded: BehaviorSubject<AdminoConfig> = new BehaviorSubject(null);

    config: AdminoConfig;
    constructor(private http: HttpClient) {
        this.configLoaded.subscribe((config) => {
            if (config) {
                this.config = config;
            }
        });
    }

    loadConfig(configPath: string) {
        this.http.get(configPath).subscribe((result: AdminoConfig) => {
            this.configLoaded.next(result);
        });
    }
}
