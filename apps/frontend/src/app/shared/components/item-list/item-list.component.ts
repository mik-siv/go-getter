import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';

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
  @Input() items: ListItem[];
  @Input() activeItem: ListItem;
  @Output() itemClicked = new EventEmitter();
  listName = input<string>();
  isExpanded = input<boolean>(false);

  onClick(item: ListItem): void {
    this.itemClicked.emit(item);
  }
}
