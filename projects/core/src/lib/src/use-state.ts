import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { deepProxy } from '../utils';

export function useState<State extends Record<string, any>>(state: State) {
    const cdRef = inject(ChangeDetectorRef) as ViewRef;
    cdRef.detach(); // we don't need automatic change detection
    setTimeout(() => cdRef.detectChanges()); // detect the very first changes when the state initializes
    return deepProxy(state, {
        set: (target, property: keyof State, value) => {
            target[property] = value; // change the state
            cdRef.detectChanges(); // manually trigger the change detection
            return true;
        },
        get(target: any, property: string) {
            return (target as Record<string, any>)[property]; // just return the state property
        },
    }) as State;
}