import { ConnectedPosition } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';

@Component({
    selector: 'ch-dialog-position',
    standalone: true,
    imports: [CommonModule, DialogComponent, ButtonComponent],
    templateUrl: './dialog-position.component.html',
    styleUrls: ['./dialog-position.component.scss']
})
export class DialogPositionComponent {
    positions: string[] = ['Top Left', 'Top', 'Top Right', 'Left', 'Center', 'Right', 'Bottom Left', 'Bottom', 'Bottom Right', 'Offset'];
    target = signal<HTMLElement | undefined>(undefined);
    visible = signal<boolean>(false);
    dialogPositions = signal<ConnectedPosition[]>([]);

    handleClick = (position: string, target: ButtonComponent) => {
        this.target.set(target.getNativeElement());

        const dialogPosition = this.calculateDialogPositionConfig(position);
        this.dialogPositions.set(dialogPosition);

        this.visible.set(true);
    };

    private calculateDialogPositionConfig = (position: string): ConnectedPosition[] => {
        switch (position) {
            case 'Top Left':
                return [
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    }
                ];
            case 'Top':
                return [
                    {
                        originX: 'center',
                        originY: 'top',
                        overlayX: 'center',
                        overlayY: 'bottom'
                    }
                ];
            case 'Top Right':
                return [
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ];
            case 'Bottom Left':
                return [
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ];
            case 'Bottom':
                return [
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top'
                    }
                ];
            case 'Bottom Right':
                return [
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    }
                ];
            case 'Left':
                return [
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center'
                    }
                ];

            case 'Right':
                return [
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center'
                    }
                ];
            case 'Offset':
                return [
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                        offsetX: 150,
                        offsetY: -5
                    }
                ];
            default:
                return [
                    {
                        originX: 'center',
                        originY: 'center',
                        overlayX: 'center',
                        overlayY: 'center'
                    }
                ];
        }
    };
}
