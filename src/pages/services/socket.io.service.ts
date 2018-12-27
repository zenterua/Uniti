import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketIo extends Socket {
    constructor(@Inject('_OPTIONS_') private options) {
        super({ url: 'http://uniti.redstone.media:3000/', options}); 
    }
}

 