import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, OnDestroy, output, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, fromEvent, switchMap, tap, timer } from 'rxjs';
import { DialogScrollStrategy } from './models';

/**
 * Dialog is a container to display content in an overlay window.
 * @component
 */
@Component({
    selector: 'ch-dialog',
    standalone: true,
    imports: [CommonModule, CdkPortal, CdkDrag, CdkDragHandle],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'collision-id': crypto.randomUUID()
    }
})
export class DialogComponent implements OnDestroy {
    private overlay = inject(Overlay);
    private portal = viewChild(CdkPortal);

    /**
     * Specifies if popup is visible.
     * @group TwoWayBindings
     * @default false
     */
    visible = model<boolean>(false);

    /**
     * Specifies teh height of the popup.
     * @group Props
     * @default 'auto'
     */
    height = input<number | string>('auto');

    /**
     * Specifies the width of the popup.
     * @group Props
     * @default 'auto'
     */
    width = input<number | string>('auto');

    /**
     * Specifies the target element relative to which the popup should be positioned.
     * @group Props
     */
    target = input<HTMLElement>();

    /**
     * Specifies whether the popup should display a backdrop behind it.
     * @group Props
     * @default true
     */
    hasBackdrop = input<boolean>(true);

    /**
     * Specifies the CSS class or classes to be applied to the backdrop element.
     * @group Props
     * @default 'cdk-overlay-dark-backdrop'
     */
    backdropClass = input<string | string[]>('cdk-overlay-dark-backdrop');

    /**
     * Specifies whether the popup should close when the backdrop is clicked.
     * This property is only relevant if `hasBackdrop` is set to `true`.
     * @group Props
     * @default true
     */
    closeOnBackdropClick = input<boolean>(true);

    /**
     * Specifies an array of possible positions for the popup relative to the target element.
     * @group Props
     */
    positions = input<ConnectedPosition[]>([
        {
            originX: 'center',
            originY: 'center',
            overlayX: 'center',
            overlayY: 'center'
        }
    ]);

    /**
     * Specifies the CSS class or classes to be applied to the popup container element.
     * @group Props
     * @default ''
     */
    cssClass = input<string | string[]>('');

    /**
     * Specifies the scroll strategy to be used for the popup.
     * @group Props
     * @default 'block'
     */
    scrollStrategy = input<DialogScrollStrategy>('block');

    /**
     * Specifies if the dialog can be dragged around the screen.
     * @group Props
     * @default false
     */
    dragEnabled = input<boolean>(true);

    isTouchStillInProgressAfterOpen = signal<boolean>(false);

    onOpened = output<OverlayRef>();

    overlayScrollStrategy = computed(() => this.getOverlayScrollStrategy(this.scrollStrategy()));

    dimensions = computed(() => {
        const height = this.height();
        const width = this.width();

        return {
            height: !isNaN(Number(height)) ? `${height}px` : height,
            width: !isNaN(Number(width)) ? `${width}px` : width
        };
    });

    private dialogRef?: OverlayRef;

    constructor() {
        toObservable(this.visible)
            .pipe(takeUntilDestroyed())
            .subscribe((isVisible: boolean) => {
                if (isVisible) {
                    this.open(this.target());
                } else this.disposeDialogRef();
            });

        this.trackTouchInProgressDuringDialogOpen();
    }

    ngOnDestroy(): void {
        this.close();
    }

    private trackTouchInProgressDuringDialogOpen = () => {
        fromEvent<TouchEvent>(window, 'touchstart')
            .pipe(
                filter(() => !this.visible()),
                tap(() => this.isTouchStillInProgressAfterOpen.set(true)),
                switchMap(() =>
                    fromEvent<TouchEvent>(window, 'touchend').pipe(
                        switchMap(() => timer(100)),
                        tap(() => {
                            this.isTouchStillInProgressAfterOpen.set(false);
                        })
                    )
                )
            )
            .subscribe();
    };
    private open = (targetElement?: HTMLElement) => {
        const positionStrategy = this.handleDialogPositionStrategy(targetElement);

        this.dialogRef = this.createDialog(positionStrategy, this.hasBackdrop(), this.backdropClass());
        this.onOpened.emit(this.dialogRef);

        this.attachComponentToDialog();

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });

        if (this.closeOnBackdropClick()) this.setupOnBackdropClickHandler();
    };

    private setupOnBackdropClickHandler = (): void => {
        this.dialogRef
            ?.backdropClick()
            .pipe(filter(() => !this.isTouchStillInProgressAfterOpen()))
            .subscribe(() => {
                this.close();
            });
    };

    private handleDialogPositionStrategy = (targetElement?: HTMLElement | ElementRef) => {
        if (targetElement) {
            return this.overlay.position().flexibleConnectedTo(targetElement).withFlexibleDimensions(true).withPush(true).withPositions(this.positions()).withGrowAfterOpen(true);
        } else {
            return this.overlay.position().global().centerHorizontally().centerVertically();
        }
    };

    private createDialog = (positionStrategy?: PositionStrategy, hasBackdrop: boolean = true, backdropClass: string | string[] = ''): OverlayRef =>
        this.overlay.create({
            positionStrategy,
            hasBackdrop: hasBackdrop,
            backdropClass: backdropClass,
            scrollStrategy: this.overlayScrollStrategy()
        });

    private attachComponentToDialog = () => {
        const componentRef = this.dialogRef?.attach(this.portal());
        return componentRef;
    };

    /**
     * Close the dialog
     * @group Method
     */
    close = () => {
        this.disposeDialogRef();
        this.visible.set(false);
    };

    private disposeDialogRef = () => {
        if (this.dialogRef) {
            this.dialogRef.dispose();
        }
    };

    private getOverlayScrollStrategy = (strategy: DialogScrollStrategy): ScrollStrategy => {
        switch (strategy) {
            case 'reposition':
                return this.overlay.scrollStrategies.reposition();
            case 'close':
                return this.overlay.scrollStrategies.close();
            case 'noop':
                return this.overlay.scrollStrategies.noop();
            default:
                return this.overlay.scrollStrategies.block();
        }
    };
}
