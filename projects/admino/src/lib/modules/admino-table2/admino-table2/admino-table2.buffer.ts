export class AdminoTableBufferData {
    index: number;
    data: any;
    bufferindex: number;
}
export class AdminoTableBuffer {
    container = [];
    maxBufferSize = 10000;

    set(index, data) {
        const bufferindex = index % this.maxBufferSize;
        const bufferdata = this.container[bufferindex];
        if (bufferdata) {
            bufferdata.index = index;
            bufferdata.data = data;
            bufferdata.bufferindex = bufferindex;
        } else {
            this.container[bufferindex] = { index, data, bufferindex };
        }
    }
    get(index) {
        const bufferdata = this.container[index % this.maxBufferSize];
        if (bufferdata) {
            if (bufferdata.index !== index) {
                if (bufferdata.data) {
                    delete bufferdata.data;
                    bufferdata.index = index;
                }
            }
            // // console.log(bufferdata.index, index);
        }
        return bufferdata;
    }
    clear(startIndex, endIndex) {
        const start = startIndex <= endIndex ? startIndex : endIndex;
        const end = startIndex <= endIndex ? endIndex : startIndex;
        for (let index = start; index <= end; index++) {
            const bufferdata = this.container[index % this.maxBufferSize];
            if (bufferdata) {
                // bufferdata.index = index;
                // if (bufferdata.data) {
                //     // for (const key of Object.keys(bufferdata.data)) {
                //     delete bufferdata.data;
                //     // }
                // }
                console.log("delete,", bufferdata.data)
                for (const key of Object.keys(bufferdata)) {
                    delete bufferdata[key];
                }
                // delete bufferdata.data;
            }
        }
    }
    clearAll() {
        this.container.forEach((bdata) => {
            const bufferdata = bdata;
            if (bufferdata) {
                bufferdata.index = -1;
                for (const key of Object.keys(bufferdata)) {
                    delete bufferdata[key];
                }
            }
        });
    }
    // // get element at index 11 (you want the 11th item in the array)
    // eleventh = container[(index + 11) % maxlen];

    // // get element at index 11 (you want the 11th item in the array)
    // thirtyfifth = container[(index + 35) % maxlen];

    // // print out all 100 elements that we have left in the array, note
    // // that it doesn't matter if we address past 100 - circular buffer
    // // so we'll simply get back to the beginning if we do that.
    // for(i = 0; i < 200; i++) {
    // document.write(container[(index + i) % maxlen] + "<br>\n");


    // // private cache: Map<any, EmbeddedViewRef<any>> = new Map<any, EmbeddedViewRef<any>>();
    // private collectionCache = [];
    // fillSpaces(start, end) {
    //     let a = 0;
    //     for (let i = start; i < end; i++) {
    //         const el = this.collectionCache[i];
    //         if (!el) {
    //             this.collectionCache[i] = {};
    //         }
    //         a++;
    //     }
    // }
    // clearData() {
    //     Object.keys(this.collectionCache).forEach((key) => {
    //         delete this.collectionCache[key];
    //     });
    // }
    // patchData(data) {
    //     Object.keys(data).forEach((key) => {
    //         if (!this.collectionCache[key]) {
    //             this.collectionCache[key] = {};
    //         }
    //         Object.assign(this.collectionCache[key], data[key]);
    //     });
    //     // console.log(this.cache);

    // }
}