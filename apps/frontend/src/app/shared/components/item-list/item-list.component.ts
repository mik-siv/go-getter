import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

export interface ListItem {
  name: string;
  id: string;

  [key: string]: any;
}

@Component({
    selector: 'app-item-list',
    imports: [MaterialModule],
    templateUrl: './item-list.component.html',
    styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  @Input() items: ListItem[];
  @Input() activeItem: ListItem;
  @Output() itemClicked = new EventEmitter();
  @Output() deleteItemClicked = new EventEmitter();
  listName = input<string>();
  isExpanded = input<boolean>(false);
  createNew = output<void>();

  onClick(item: ListItem): void {
    this.itemClicked.emit(item);
  }

  onDeleteButtonClicked(item: ListItem): void {
    this.deleteItemClicked.emit(item);
  }

  createNewItem(event: MouseEvent): void {
    event.stopPropagation();
    this.createNew.emit();
  }
}
