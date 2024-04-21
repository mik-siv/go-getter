import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';

export interface ListItem {
  name: string;
  id: string;

  [key: string]: any;
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
})
export class ItemListComponent {
  @Input() items: ListItem[] = []; // List of items to display
  @Input() activeItem: ListItem | null = null; // Currently active item
  @Output() itemClicked = new EventEmitter<ListItem>(); // Event emitted on item click

  onClick(item: ListItem) {
    this.itemClicked.emit(item);
  }
}
